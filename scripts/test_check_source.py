"""Publication integrity must reject unlisted and modified pages."""
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest


class IntegrityTests(unittest.TestCase):
    def test_stale_and_unlisted_pages_fail(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            scripts = root / 'scripts'
            scripts.mkdir()
            shutil.copyfile(Path(__file__).with_name('check_source.py'), scripts / 'check_source.py')
            navigation = {'tabs': []}
            (root / 'docs.json').write_text(json.dumps({'navigation': navigation}))
            guide = root / 'guide.mdx'
            guide.write_text('Maintained')
            pin = {
                'commit': 'a' * 40,
                'files': [{'path': 'guide.mdx', 'sha256': hashlib.sha256(b'Maintained').hexdigest()}],
                'navigationSha256': hashlib.sha256(json.dumps(navigation, sort_keys=True).encode()).hexdigest(),
            }
            (root / 'SOURCE-PROVENANCE.json').write_text(json.dumps(pin))
            command = ['python3', str(scripts / 'check_source.py')]
            self.assertEqual(subprocess.run(command, capture_output=True).returncode, 0)
            for relative in ['extra.mdx', 'api-reference/openapi/extra.json']:
                path = root / relative
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text('Unlisted')
                result = subprocess.run(command, capture_output=True, text=True)
                self.assertNotEqual(result.returncode, 0)
                self.assertIn('Unmapped publication files', result.stderr)
                path.unlink()
            guide.write_text('Changed without refreshing the pin')
            result = subprocess.run(command, capture_output=True, text=True)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn('stale file', result.stderr)


if __name__ == '__main__':
    unittest.main()
