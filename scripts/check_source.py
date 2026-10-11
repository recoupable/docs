"""Check the retained publication against its source pin, optionally a local source checkout."""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess

parser = argparse.ArgumentParser()
parser.add_argument('--source', help='Optional Marketing checkout at the pinned commit')
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent
pin = json.loads((root / 'SOURCE-PROVENANCE.json').read_text())
errors = []
source = Path(args.source).resolve() if args.source else None
managed = {entry['path'] for entry in pin['files']}
published = {str(p.relative_to(root)) for p in root.rglob('*') if p.is_file() and (p.suffix == '.mdx' or str(p.relative_to(root)).startswith('api-reference/openapi/')) and not any(part.startswith('.') or part == 'node_modules' for part in p.relative_to(root).parts)}
extras = published - managed
if extras:
    errors.append('Unmapped publication files: ' + ', '.join(sorted(extras)))
if source:
    commit = subprocess.check_output(['git', '-C', str(source), 'rev-parse', 'HEAD'], text=True).strip()
    if commit != pin['commit']:
        errors.append(f'Source HEAD {commit} differs from pinned {pin["commit"]}')
    source_root = source / pin['sourceDirectory']
    source_files = {str(p.relative_to(source_root)) for p in source_root.rglob('*') if p.is_file() and p.name != 'docs.json'}
    if source_files != managed:
        errors.append('Source file inventory differs from the pin')
for entry in pin['files']:
    for path in [root / entry['path']] + ([source / entry['sourcePath']] if source else []):
        if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest() != entry['sha256']:
            errors.append(f'Missing or stale file: {path}')
navigation = json.loads((root / 'docs.json').read_text())['navigation']
if hashlib.sha256(json.dumps(navigation, sort_keys=True).encode()).hexdigest() != pin['navigationSha256']:
    errors.append('Docs navigation differs from the pinned source')
if errors:
    raise SystemExit('\n'.join(errors))
print(f'Verified {len(pin["files"])} files and navigation against Marketing {pin["commit"]}')
