# Retained documentation publication

Author product documentation in `recoupable/marketing/content/docs/source`.
This repository retains the Mintlify publication while the host cutover is pending.
`SOURCE-PROVENANCE.json` pins the Marketing commit and every copied file hash.
Theme, colors, navbar, footer, logos and host settings remain local to this host;
navigation mirrors the maintained source.

After merging a Marketing documentation change, publish its copy with
`python3 scripts/sync-legacy-docs.py --target /path/to/docs` from Marketing.
Open a separate Docs PR. Check with `python3 scripts/check_source.py`, or add
`--source /path/to/marketing` to also compare a checkout at the pinned commit.
Never edit a copied page independently: correct the maintained source and refresh
the copy. Pinning content does not verify endpoint deployment or user journeys.

Marketing#101 and mono#318 package 25 track the eventual host cutover.
DNS, redirects and repository archival require their own compatibility evidence.
The coordinated lipsync instructions remain release pending until the API and
existing worker are deployed and the real generated artifact is inspected.
