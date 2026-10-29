#!/usr/bin/env bash
# Run as root: bash /opt/food-tracker/releases/<revision>/deploy/release.sh <full-commit-sha>
set -euo pipefail
revision="${1:?Full GitHub commit SHA required}"
[[ "$revision" =~ ^[0-9a-f]{40}$ ]] || { echo 'Invalid revision'; exit 1; }
release="/opt/food-tracker/releases/$revision"
if [[ -e "$release" ]]; then echo 'Release already exists'; exit 1; fi
mkdir -p "$release"
curl -fsSL "https://github.com/NataliFeo/ai-food-tracker/archive/$revision.tar.gz" | tar -xz --strip-components=1 -C "$release"
cd "$release"
export NEXT_TELEMETRY_DISABLED=1
npm ci --no-audit --no-fund
npm run build
mkdir -p runtime
cp -a .next/standalone/. runtime/
mkdir -p runtime/.next
cp -a .next/static runtime/.next/
cp -a public runtime/
mkdir -p runtime/.next/cache
chown -R foodtracker:foodtracker runtime/.next/cache
ln -sfn "$release/runtime" /opt/food-tracker/current
systemctl restart food-tracker
for attempt in {1..15}; do
  if curl -fsS http://127.0.0.1:3000/api/health; then echo " Published $revision"; exit 0; fi
  sleep 1
done
echo 'Service did not become healthy; inspect journalctl -u food-tracker'
exit 1
