# Deploy — city-airport-taxis-driver

Repo: `git@github.com:belgiumairporttransfers-creator/city-airport-taxis-driver.git`

## Flow

```
Push to main  →  GitHub Actions  →  GHCR  →  SSH VPS  →  docker compose up
```

Image: `ghcr.io/belgiumairporttransfers-creator/city-airport-taxis-driver:latest`

The driver dashboard runs on **port 3002** on the same VPS as the backend (5000) and admin (3000).

## VPS setup (one-time)

If the backend/admin is already deployed on the VPS, Docker and Nginx are likely installed. Clone this repo and add env + Nginx config:

```bash
ssh root@YOUR_VPS_IP
git clone git@github.com:belgiumairporttransfers-creator/city-airport-taxis-driver.git /opt/city-airport-taxis-driver
cd /opt/city-airport-taxis-driver
cp .env.production.example .env.production
nano .env.production   # set production URLs — never commit
sudo bash deploy/docker-vps-setup.sh   # safe to re-run
```

Or from your **local machine**:

```bash
cd driver-dashboard
cp .env.production.example .env.production
nano .env.production
VPS_IP=YOUR_VPS_IP bash deploy/first-vps-deploy.sh
```

## Environment (`.env.production`)

| Variable | Example | Notes |
|----------|---------|-------|
| `NEXT_PUBLIC_BACKEND_URL` | `https://api.city-airport-taxis.be/api` | **Build-time** — baked into the Docker image by CI |
| `NEXT_PUBLIC_SITE_URL` | `https://driver.city-airport-taxis.be` | **Build-time** |
| `NEXT_PUBLIC_SOCKET_PATH` | `/socket.io` | Optional; **build-time** |
| `PORT` | `3002` | Host port mapped to the container |

`NEXT_PUBLIC_*` values must match the GitHub **Variables** used in the Deploy workflow.

## GitHub secrets & variables

Copy the **same deploy secrets** from the backend repo into this repo’s **production** environment (same as backend).

**Settings → Environments → production → Environment secrets**:

| Setting | Value |
|---------|--------|
| Variable `SSH_DEPLOY_ENABLED` | `true` |
| Secret `DEPLOY_HOST` | VPS IP (same as backend) |
| Secret `DEPLOY_USER` | SSH user (same as backend) |
| Secret `DEPLOY_SSH_KEY` | Private SSH key (same as backend) |
| Secret `DEPLOY_PATH` | `/opt/city-airport-taxis-driver` |
| Secret `DEPLOY_PORT_APP` | `3002` |
| Secret `GHCR_TOKEN` | PAT with `read:packages` (same as backend) |

Optional **Variables** (defaults are already in the workflow):

| Variable | Value |
|----------|--------|
| `NEXT_PUBLIC_BACKEND_URL` | `https://api.city-airport-taxis.be/api` |
| `NEXT_PUBLIC_SITE_URL` | `https://driver.city-airport-taxis.be` |
| `NEXT_PUBLIC_SOCKET_PATH` | `/socket.io` |

**Fastest setup:** copy backend production environment secrets into the driver repo, then change only `DEPLOY_PATH` and `DEPLOY_PORT_APP`.

```bash
cd driver-dashboard
cp deploy/github-actions.secrets.example deploy/github-actions.secrets
# Fill DEPLOY_HOST, DEPLOY_USER, DEPLOY_SSH_KEY_FILE, GHCR_TOKEN only
./deploy/set-github-actions-config.sh belgiumairporttransfers-creator/city-airport-taxis-driver
gh variable set SSH_DEPLOY_ENABLED -R belgiumairporttransfers-creator/city-airport-taxis-driver -b "true"
```

## Deploy

- **Auto:** push to `main`
- **Manual:** Actions → **Deploy** → Run workflow

## Nginx + SSL

```bash
sudo cp deploy/nginx-driver.conf.example /etc/nginx/sites-available/driver.city-airport-taxis.be
sudo nano /etc/nginx/sites-available/driver.city-airport-taxis.be   # set server_name
sudo ln -s /etc/nginx/sites-available/driver.city-airport-taxis.be /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d driver.city-airport-taxis.be
```

## Verify

```bash
curl -fsS http://127.0.0.1:3002/auth/login
docker compose -f docker-compose.prod.yml ps
```

Open `https://driver.city-airport-taxis.be` and log in with a driver account.
