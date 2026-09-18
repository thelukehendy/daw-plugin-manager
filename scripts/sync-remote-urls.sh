#!/usr/bin/env bash
# Rewrite catalog/remote-urls.json from the current git remote (origin).
# raw.githubusercontent first (tracks main quickly); jsDelivr is CDN fallback.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

url="$(git remote get-url origin 2>/dev/null || true)"
if [[ -z "$url" ]]; then
  echo "No git remote 'origin'. Create/push the public repo first." >&2
  exit 1
fi

# Support https://github.com/owner/repo.git and git@github.com:owner/repo.git
owner_repo="$(echo "$url" | sed -E 's#.*github.com[:/]([^/]+/[^.]+)(\.git)?$#\1#')"
if [[ "$owner_repo" == "$url" || "$owner_repo" != */* ]]; then
  echo "Could not parse GitHub owner/repo from: $url" >&2
  exit 1
fi

cat > catalog/remote-urls.json <<EOF
{
  "comment": "Generated from git remote origin. raw GitHub first (fresh); jsDelivr fallback.",
  "urls": [
    "https://raw.githubusercontent.com/${owner_repo}/main/catalog/catalog.json",
    "https://cdn.jsdelivr.net/gh/${owner_repo}@main/catalog/catalog.json"
  ]
}
EOF

echo "Updated catalog/remote-urls.json → ${owner_repo}"
echo "Rebuild the DMG after pushing so clients ship these URLs."
