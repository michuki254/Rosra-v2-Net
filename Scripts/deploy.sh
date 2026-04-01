#!/bin/bash
# ROSRA App - Quick Deploy
# Usage: bash deploy.sh
set -e

SSH_KEY="~/.ssh/hostinger_vps"
VPS="root@72.62.91.88"
SSH_OPTS="-i ${SSH_KEY}"
APP_DIR="/var/www/rosraapp"
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

cd "$PROJECT_DIR"

DOTNET="/mnt/c/Program Files/dotnet/dotnet.exe"
PUBLISH_DIR="/mnt/c/tmp/rosraapp-publish"

echo "[1/3] Publishing..."
rm -rf "$PUBLISH_DIR"
"$DOTNET" publish RosraApp.csproj -c Release -o "C:\\tmp\\rosraapp-publish" --runtime linux-x64 --self-contained false

echo "[2/3] Syncing to VPS (appsettings protected)..."
rsync -avz --delete -e "ssh ${SSH_OPTS}" \
  --exclude='appsettings.json' \
  --exclude='appsettings.Production.json' \
  --exclude='appsettings.*.json' \
  --exclude='*.db' \
  "$PUBLISH_DIR"/ ${VPS}:${APP_DIR}/

echo "[3/3] Restarting..."
ssh ${SSH_OPTS} ${VPS} "systemctl stop rosraapp; sleep 1; kill \$(lsof -t -i:5000) 2>/dev/null; sleep 1; chown -R www-data:www-data ${APP_DIR} && systemctl start rosraapp && sleep 2 && systemctl status rosraapp --no-pager"

echo ""
echo "Done! http://72.62.91.88"
