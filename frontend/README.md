# Frontend (React + TypeScript + Vite)

This is the SPA client for the Movie Search project.

## Requirements

- Node.js (LTS recommended)
- Backend service URL in `VITE_API_BASE_URL`

## Environment

Create `frontend/.env` (or set in your deployment environment):

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Run locally

```bash
npm install
npm run dev
```

Default local URL: `http://localhost:5173`

## Build

```bash
npm run build
npm run preview
```

## Deployed

- GitHub Pages: <https://nandrease.github.io/movie_search/>

## Notes

- Data fetching is handled via React Query (`src/query/`).
- Request timing logs are implemented in:
  - `src/query/requestTiming/RequestTimingProvider.tsx`
  - `src/query/requestTiming/requestInterceptor.ts`
- Styling uses CSS Modules (no component library).
