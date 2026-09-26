-- DAW Plugin Catalog Store — schema version 6
-- Zero-trust: product universe separate from verified versions
-- v2: micro vs macro update model + manufacturer scrub playbooks
-- v3: version confidence scoring + helpful app-facing plugin fields
-- v4: identity_kind for Electron UX (soundset/hardware/hub_app/…)
-- v5: app-facing hardware/compat data — apple_silicon, version_scheme,
--      changelog_url (documented in DATA-DICTIONARY.md for Cursor)
-- v6: popularity tiers for research prioritization (internal; not exported).
--      1 = household names, 2 = established mid-size, 3 = remaining
--      commercial, NULL = unranked long tail (researched last).
--      Plugins inherit the manufacturer tier unless individually overridden:
--      COALESCE(plugins.popularity_tier, manufacturers.popularity_tier, 99).

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS manufacturers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  aliases TEXT,                    -- JSON array
  website_url TEXT,
  update_portal_url TEXT NOT NULL,
  portal_app TEXT,
  update_channel TEXT,
  notes TEXT,
  -- v5 app-facing compat data (see DATA-DICTIONARY.md)
  apple_silicon TEXT,       -- manufacturer default: native|universal|rosetta|intel-only|mixed|unknown
  version_scheme TEXT,      -- semver|semver4|date|build|marketing
  version_example TEXT,     -- e.g. '4.10.19'
  changelog_url TEXT,
  -- v6 popularity tier for research prioritization (internal; not exported)
  popularity_tier INTEGER,  -- 1|2|3 ; NULL = unranked long tail, researched last
  -- v8 manufacturer default installed-version rule (JSON object; exported as the
  -- plugin's installedVersionRule when the plugin row has no rule of its own).
  -- Same shape as plugins.installed_version_rule. Only set when the whole
  -- product line genuinely shares one version scheme.
  default_installed_version_rule TEXT,
  created_at TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS plugins (
  id TEXT PRIMARY KEY,
  manufacturer_id TEXT NOT NULL REFERENCES manufacturers(id),
  name TEXT NOT NULL,
  match_patterns TEXT NOT NULL,    -- JSON array
  formats TEXT,                    -- JSON array
  product_line TEXT,
  -- v2 micro/macro generation model
  generation TEXT,                 -- e.g. '3', 'Pro-Q 3', or major line key
  generation_rank INTEGER,         -- order within product_line (higher = newer gen)
  update_class TEXT DEFAULT 'unknown',
    -- free_current | paid_upgrade | discontinued | bundled | unknown
  successor_plugin_id TEXT,        -- paid next gen (macro upgrade target)
  predecessor_plugin_id TEXT,      -- prior gen this product superseded
  -- legacy identity fields (aligned with successor/predecessor when set)
  bundled INTEGER DEFAULT 0,
  min_macos TEXT,
  update_portal_url TEXT,
  supersedes_plugin_id TEXT,       -- older plugin this one replaces
  superseded_by_plugin_id TEXT,    -- newer plugin that replaces this one
  discontinued INTEGER DEFAULT 0,
  notes TEXT,
  identity_source TEXT,
  -- v3 helpful app-facing fields (optional; exported when set)
  portal_app TEXT,                 -- Native Access, Waves Central, Avid Link, …
  update_channel TEXT,             -- plugin override of manufacturer channel
  is_freeware INTEGER,             -- 1 = free product
  requires_ilok INTEGER,           -- 1 = iLok / Pace commonly required
  notes_for_user TEXT,             -- short UX hint for Electron
  -- v4 identity kind (export identityKind when not 'plugin')
  identity_kind TEXT DEFAULT 'plugin',
    -- plugin | soundset | expansion | hardware | eurorack | bundle |
    -- suite_component | daw_stock_effect | hub_app | gen_ambiguous |
    -- discontinued | unknown_other
  -- v5 per-plugin Apple Silicon override (NULL = inherit manufacturer default)
  apple_silicon TEXT,       -- native|universal|rosetta|intel-only ; NULL inherits
  -- v7 installed-version normalization rule for the app's update verdict
  -- (JSON object; exported as installedVersionRule when set). Shape:
  -- {"source": "CFBundleShortVersionString", "transforms": [...], "compareSegments": N}
  -- transforms are applied in listed order; unknown transform = no verdict.
  installed_version_rule TEXT,
  -- v6 popularity tier for research prioritization (internal; not exported).
  -- NULL = inherit manufacturer tier in queue ordering.
  popularity_tier INTEGER,  -- 1|2|3 ; NULL inherits
  created_at TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS version_observations (
  id TEXT PRIMARY KEY,             -- uuid
  plugin_id TEXT NOT NULL REFERENCES plugins(id),
  observed_version TEXT NOT NULL,
  normalized_version TEXT,
  source_url TEXT NOT NULL,
  source_kind TEXT NOT NULL,       -- vendorFeed|releaseNotesPage|productPage|downloadsPage|labOnDisk|other
  extract_method TEXT,
  evidence_snippet TEXT,
  content_hash TEXT,
  lab_on_disk_version TEXT,
  lab_evidence TEXT,               -- JSON
  status TEXT NOT NULL,            -- candidate|accepted|rejected|superseded
  reject_reason TEXT,
  verified_at TEXT,
  verified_by TEXT,
  -- v3 confidence (0-100); export inherits onto plugin when current
  confidence INTEGER NOT NULL DEFAULT 50,
  confidence_reasons TEXT,         -- JSON array of strings
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS plugin_version_current (
  plugin_id TEXT PRIMARY KEY REFERENCES plugins(id),
  observation_id TEXT NOT NULL REFERENCES version_observations(id),
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS vendor_feeds (
  id TEXT PRIMARY KEY,
  manufacturer_id TEXT REFERENCES manufacturers(id),
  plugin_id TEXT REFERENCES plugins(id),
  feed_url TEXT NOT NULL,
  extract_expr TEXT,
  enabled INTEGER DEFAULT 1,
  last_checked_at TEXT,
  notes TEXT
);

-- v2: how we discover / scrub public versions per manufacturer
CREATE TABLE IF NOT EXISTS manufacturer_playbooks (
  manufacturer_id TEXT PRIMARY KEY REFERENCES manufacturers(id),
  method_summary TEXT,             -- how we discover versions
  primary_urls TEXT,               -- JSON array
  extract_notes TEXT,
  cadence_hint TEXT,               -- e.g. weekly
  last_scrub_at TEXT,
  success_rate_notes TEXT,
  hub_walled INTEGER DEFAULT 0,
  portal_app TEXT,
  updated_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_plugins_manufacturer ON plugins(manufacturer_id);
CREATE INDEX IF NOT EXISTS idx_plugins_product_line ON plugins(product_line);
CREATE INDEX IF NOT EXISTS idx_plugins_successor ON plugins(successor_plugin_id);
CREATE INDEX IF NOT EXISTS idx_observations_plugin ON version_observations(plugin_id);
CREATE INDEX IF NOT EXISTS idx_observations_status ON version_observations(status);
CREATE INDEX IF NOT EXISTS idx_observations_confidence ON version_observations(confidence);
