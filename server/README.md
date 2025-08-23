<div align="center">
  <h1 style="margin-bottom: 0.25rem;">Expense Tracker – Server</h1>
  <p style="margin-top: 0; color: #6b7280;">Express API powering the Expense Tracker.</p>
  <p>
    <img alt="Express" src="https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white" />
    <img alt="Node" src="https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white" />
    <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-pg-336791?logo=postgresql&logoColor=white" />
  </p>
</div>

<h2>Tech Stack</h2>

- Node.js 18+
- Express 4
- PostgreSQL (via `pg`)
- Helmet, CORS, Morgan

<h2>Requirements</h2>

- Node.js >= 18
- npm or yarn

<h2>Installation & Run</h2>

1) Install dependencies

```bash
npm install
```

2) Configure environment

```bash
cp .env.example .env
```

Then edit `.env` with your actual configuration values.

3) Start the server

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Default: http://localhost:8080

<h2>Environment</h2>

Key variables in `server/.env`:

- `PORT` – server port (default: 8080)
- `DATABASE_URL` – Postgres connection string
- `JWT_SECRET` – secret for JWT signing
- `CORS_ORIGIN` – allowed frontend origin (e.g., http://localhost:5173)

<h2>Notes</h2>

- Logging via `morgan` (dev-friendly).
- Security headers via `helmet`.
- CORS configured via `CORS_ORIGIN`.

<h2>OpenAPI Spec & Client Generation</h2>

- Spec location: `server/docs/Expense Tracker API.yaml`
- To regenerate the client SDK after spec changes:

```bash
cd ../client
npm run api:generate
```
