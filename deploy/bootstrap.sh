#!/usr/bin/env bash
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq nginx certbot python3-certbot-nginx ca-certificates xz-utils curl
if ! command -v node >/dev/null; then
  cd /tmp
  curl -fsSLO https://nodejs.org/dist/v24.13.1/node-v24.13.1-linux-x64.tar.xz
  curl -fsSLO https://nodejs.org/dist/v24.13.1/SHASUMS256.txt
  grep ' node-v24.13.1-linux-x64.tar.xz$' SHASUMS256.txt | sha256sum -c -
  tar -xJf node-v24.13.1-linux-x64.tar.xz -C /opt
  ln -sf /opt/node-v24.13.1-linux-x64/bin/node /usr/local/bin/node
  ln -sf /opt/node-v24.13.1-linux-x64/bin/npm /usr/local/bin/npm
  ln -sf /opt/node-v24.13.1-linux-x64/bin/npx /usr/local/bin/npx
fi
id foodtracker >/dev/null 2>&1 || useradd --system --home /opt/food-tracker --shell /usr/sbin/nologin foodtracker
install -d -o foodtracker -g foodtracker /opt/food-tracker /var/lib/food-tracker
node --version
nginx -v
echo 'Server dependencies ready'
