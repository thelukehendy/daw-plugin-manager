# UA diggable “Editions” are not plugins (identity)

- **Date:** 2026-09-25
- **Advisor:** Grok Bot (wave 6)
- **Problem:** 5 Universal Audio diggable residuals labeled `identity_kind=plugin` but named Editions.

| plugin_id | name |
|---|---|
| `universal-audio--uad-producer-edition` | UAD Producer Edition |
| `universal-audio--uad-studio-edition` | UAD Studio Edition |
| `universal-audio--uad-signature-edition-v3` | UAD Signature Edition V3 |
| `universal-audio--uadx-essentials-edition` | UADx Essentials Edition |
| `universal-audio--uadx-signature-edition-v2` | UADx Signature Edition V2 |

### Doctrine (aligns with accepted UA Version History file)
- These are **commerce bundles / edition packs**, not single DSP plugins.
- Accepted UA Version History tip (12.0) is a **suite/software** tip — already forbidden to stamp onto every UAD/UADx SKU.
- Stamping 12.0 onto “Producer Edition” would be a second identity crime (suite → edition pack).

### Recommendation
1. Reclass all five → `bundle` (or `suite_component` if Muse’s dictionary prefers that for edition packs).
2. Resolvability `unversioned_by_kind` / stop dig.
3. User-facing: show portal UA Connect; no per-edition version chip.
4. Keep true UAD/UADx plugin SKUs on Version History / Connect doctrine separately.

### Related local DB smell (lane 5 preview)
Other `identity_kind=plugin` rows with Edition/Suite/Bundle in the name exist (e.g. Neural DSP “Fortin * Suite”, Goodhertz “Mastering Edition” — some are legitimate single products). Guard should be **vendor-specific allow/deny lists**, not a blind regex.

- **New evidence:** Diggable list + naming; UA product taxonomy (editions sold as packs).
