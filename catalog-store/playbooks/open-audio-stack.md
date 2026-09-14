# Open Audio Stack (OAS) FOSS registry

## What worked
- Registry index `https://open-audio-stack.github.io/open-audio-stack-registry/plugins.json` — every package object has a clear top-level `version` (and `versions[version]` metadata).
- Store identity rows use `identity_source=open-audio-stack-registry-2026-09` and notes `OAS package {author}/{package}`; plugin id `oas--{slugify(author--package)}`.
- Treat as **vendorFeed** / manufacturer-feed style when `version` is present; stamp `source_url` to the registry JSON and SHA-256 of the file as `content_hash`.

## Recipe
1. Fetch plugins.json; hash bytes.
2. For each slug → store plugin via notes mapping.
3. Accept `version` field; evidence `OAS registry {slug} version={ver} date=...`.

## Notes
- Covers 559 FOSS packages across many `oas--*` manufacturers.
- Non-OAS curated rows under `surge-synthesizer` / `vital-audio` may still need separate public receipts.
