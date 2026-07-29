#!/bin/bash
# Install a macOS LaunchAgent that runs catalog:refresh every Monday at 08:15 local
# with no user action required. Free; uses only this machine + network.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
LABEL="com.dawpluginmanager.catalog-refresh"
PLIST="$HOME/Library/LaunchAgents/${LABEL}.plist"
LOG_DIR="$HOME/Library/Logs/DAW Plugin Manager"
mkdir -p "$LOG_DIR" "$HOME/Library/LaunchAgents"

# Resolve node + npx from common installs
NODE_BIN="$(command -v node || true)"
if [[ -z "$NODE_BIN" && -x /opt/homebrew/bin/node ]]; then NODE_BIN=/opt/homebrew/bin/node; fi
if [[ -z "$NODE_BIN" && -x /usr/local/bin/node ]]; then NODE_BIN=/usr/local/bin/node; fi
if [[ -z "$NODE_BIN" ]]; then
  echo "node not found on PATH; install Node 20+ first" >&2
  exit 1
fi
NODE_DIR="$(dirname "$NODE_BIN")"

cat >"$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${LABEL}</string>
  <key>WorkingDirectory</key>
  <string>${ROOT}</string>
  <key>ProgramArguments</key>
  <array>
    <string>${NODE_DIR}/npx</string>
    <string>--yes</string>
    <string>tsx</string>
    <string>scripts/catalog/refresh.ts</string>
  </array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key>
    <string>${NODE_DIR}:/usr/bin:/bin:/usr/sbin:/sbin</string>
    <key>CATALOG_DISCOVERY_MFGS</key>
    <string>25</string>
    <key>CATALOG_DISCOVERY_SEARCHES</key>
    <string>40</string>
    <key>CATALOG_DISCOVERY_FETCHES</key>
    <string>80</string>
  </dict>
  <key>StartCalendarInterval</key>
  <dict>
    <key>Weekday</key>
    <integer>1</integer>
    <key>Hour</key>
    <integer>8</integer>
    <key>Minute</key>
    <integer>15</integer>
  </dict>
  <key>StandardOutPath</key>
  <string>${LOG_DIR}/catalog-refresh.log</string>
  <key>StandardErrorPath</key>
  <string>${LOG_DIR}/catalog-refresh.err.log</string>
  <key>RunAtLoad</key>
  <false/>
</dict>
</plist>
EOF

launchctl bootout "gui/$(id -u)/${LABEL}" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$PLIST"
launchctl enable "gui/$(id -u)/${LABEL}" 2>/dev/null || true

echo "Installed weekly catalog refresh:"
echo "  plist: $PLIST"
echo "  schedule: Mondays 08:15 local"
echo "  logs: $LOG_DIR/catalog-refresh.log"
echo "Run now once:  cd \"$ROOT\" && npm run catalog:refresh"
