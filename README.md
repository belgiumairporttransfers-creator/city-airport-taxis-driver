# City Airport Taxis — Driver Dashboard

Next.js driver portal for profile, documents, vehicle settings, chat, and calendar.

## Local development

```bash
pnpm install
cp .env.production.example .env.local
# Edit .env.local — set NEXT_PUBLIC_BACKEND_URL=http://localhost:5000/api
pnpm dev
```

Open [http://localhost:3002](http://localhost:3002).

## Production deploy (VPS)

Same pattern as the admin dashboard: **GitHub Actions → GHCR → SSH → Docker Compose**.

See **[.github/DEPLOY.md](.github/DEPLOY.md)** for full VPS setup, GitHub secrets, Nginx, and SSL.

Quick summary:

1. Push this repo to `city-airport-taxis-driver` on GitHub
2. Create `.env.production` on the VPS at `/opt/city-airport-taxis-driver`
3. Configure GitHub Actions secrets/variables (same VPS as backend/admin)
4. Push to `main` or run the **Deploy** workflow
5. Point Nginx at `127.0.0.1:3002` (e.g. `driver.city-airport-taxis.be`)

## Environment

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_BACKEND_URL` | Backend API base URL (e.g. `https://api.city-airport-taxis.be/api`) |
| `NEXT_PUBLIC_SITE_URL` | Public driver portal URL (e.g. `https://driver.city-airport-taxis.be`) |
| `NEXT_PUBLIC_SOCKET_PATH` | Socket.io path (default `/socket.io`) |
| `PORT` | Host port on VPS (default `3002`, maps to container port 3000) |

`NEXT_PUBLIC_*` variables are embedded at **Docker build time** in CI.
