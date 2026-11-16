"""Discovery row availability follows metadata, not an action-name special case."""
import json
import tempfile
import unittest
from pathlib import Path
from refresh_context_mapping import refresh_context_mapping


class ContextMappingAvailabilityTests(unittest.TestCase):
    def test_labels_follow_metadata_and_can_be_removed(self):
        source = Path(__file__).resolve().parent.parent / 'content/docs/source/api-reference/openapi/context.json'
        document = json.loads(source.read_text())
        operation = document['paths']['/api/context']['post']
        operation['x-recoup-action-availability'] = {
            'read_catalog_case': {'x-recoup-availability': 'pending'},
        }
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory) / 'context.json'
            refresh_context_mapping(document, target, False)
            description = document['paths']['/api/context']['post']['description']
            self.assertEqual(description.count('| `read_catalog_case` — **Pending** |'), 2)
            self.assertNotIn('| `prepare_catalog_audit` — **Pending** |', description)
            refresh_context_mapping(document, target, True)
            operation['x-recoup-action-availability'] = {}
            refresh_context_mapping(document, target, False)
            self.assertNotIn('— **Pending**', operation['description'])


if __name__ == '__main__':
    unittest.main()
