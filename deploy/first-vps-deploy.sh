#!/usr/bin/env bash
# Run from your LOCAL machine (after SSH key is added to the VPS)
set -euo pipefail

VPS_IP="${VPS_IP:-YOUR_VPS_IP}"
VPS_USER="${VPS_USER:-root}"
APP_DIR="${APP_DIR:-/opt/city-airport-taxis-driver}"
REPO_URL="${REPO_URL:-https://github.com/belgiumairporttransfers-creator/city-airport-taxis-driver.git}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DRIVER_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "==> Deploying driver dashboard to ${VPS_USER}@${VPS_IP}"

if [[ ! -f "${DRIVER_DIR}/.env.production" ]]; then
  echo "Missing ${DRIVER_DIR}/.env.production"
  echo "Copy from .env.production.example and fill in production values."
  exit 1
fi

echo "==> Testing SSH connection"
ssh -o ConnectTimeout=15 "${VPS_USER}@${VPS_IP}" "echo SSH OK"

echo "==> Ensuring Docker + Nginx (one-time, safe if backend/admin already set up)"
ssh "${VPS_USER}@${VPS_IP}" "APP_DIR=${APP_DIR} bash -s" < "${SCRIPT_DIR}/docker-vps-setup.sh"

echo "==> Cloning / updating repo"
ssh "${VPS_USER}@${VPS_IP}" bash -s <<EOF
set -euo pipefail
if [[ -d "${APP_DIR}/.git" ]]; then
  git -C "${APP_DIR}" pull --ff-only
else
  git clone --depth 1 "${REPO_URL}" "${APP_DIR}"
fi
chmod +x "${APP_DIR}/deploy/"*.sh
EOF

echo "==> Uploading .env.production (secrets — not in git)"
scp "${DRIVER_DIR}/.env.production" "${VPS_USER}@${VPS_IP}:${APP_DIR}/.env.production"

echo "==> Building and starting containers"
ssh "${VPS_USER}@${VPS_IP}" "cd ${APP_DIR} && ./deploy/docker-deploy.sh"

echo "==> Health check"
ssh "${VPS_USER}@${VPS_IP}" "curl -fsS http://127.0.0.1:3002/auth/login >/dev/null"

echo ""
echo "Deploy complete. Driver dashboard is running on the VPS (localhost:3002)."
echo "Next: configure Nginx + SSL for driver.city-airport-taxis.be (see .github/DEPLOY.md)"
