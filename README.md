# Mainteny – Property Maintenance Command Center

Mainteny is a turnkey web application for property operators who need to manage maintenance requests with hospitality-level service. It unifies resident intake, vendor coordination and SLA monitoring in a single, design-forward workspace that you can roll out to premium multifamily clients — and confidently price at €5.000 for implementation and onboarding.

## Why it solves a real problem

Property managers often juggle residents, technicians and spreadsheets. Mainteny provides:

- **Centralised intake** – log work orders with full property, unit and vendor context.
- **Vendor visibility** – preferred partners stay organised with clear assignments and due dates.
- **Operational insights** – leadership teams see portfolio-wide workloads and urgent jobs at a glance.
- **Modern UX** – a brandable, high-end interface that elevates your offer above generic ticketing tools.

## Feature highlights

- Curated dashboard with real-time KPIs, urgency badges and status controls.
- Guided work-order form with smart defaults, vendor routing and SLA cues.
- SQLite-backed FastAPI service exposing a clean REST interface for integrations.
- Optional seeding script with showcase data to run instant demos.
- React + Tailwind front-end tuned for delightful interactions and smooth navigation.

## Architecture

```
backend/
  app/
    main.py          # FastAPI app with REST resources
    models.py        # SQLModel entities and DTOs
    crud.py          # Repository helpers for each resource
    database.py      # Engine + session management
    seed.py          # Optional demo data loader
frontend/
  src/
    App.tsx          # Dashboard shell and primary layout
    hooks/           # Axios-powered data loader + mutations
    components/      # Reusable UI building blocks (cards, lists, forms)
```

## Getting started

### Backend (FastAPI + SQLite)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows use .venv\\Scripts\\activate
pip install -r requirements.txt

# optional: seed showcase data
python -m app.seed

uvicorn app.main:app --reload
```

The API is served at `http://localhost:8000` with interactive docs available at `/docs`.

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

The development server runs on `http://localhost:5173` and proxies API requests to the FastAPI backend. Set `VITE_API_URL` in a `.env` file if you deploy the services separately.

### Production build

```bash
cd frontend
npm run build
```

Static assets are emitted in `frontend/dist/` and can be hosted on any modern CDN. Point environment variable `VITE_API_URL` to your backend URL before building.

## Extending Mainteny for clients

- **Branding**: swap Tailwind tokens in `tailwind.config.cjs` or adjust the hero copy in `App.tsx` for client messaging.
- **Automations**: integrate SMS/email alerts by wiring webhooks to the `/tickets` endpoints.
- **Role-based access**: layer on authentication (e.g. Auth0, Supabase) leveraging FastAPI dependency injection.
- **Reporting**: plug the API into BI tools or expand the dashboard metrics in `SummaryCards.tsx`.

With a polished UX, opinionated workflows and a scalable API, Mainteny is ready to demo to asset managers and facility operators right away.
