# Movie Search
Frontend: React (Vite + TypeScript)
Backend: NestJS (TypeScript)
[Live demo](https://nandrease.github.io/movie_search/)
Note: The first request can be slow because the backend runs on a free Render instance and may need a cold start.

## Prereqs
- Node.js (LTS recommended)

## Structure
- `backend/`: NestJS API
- `frontend/`: React (Vite) app

## Deployed
- Backend (Render): https://movie-search-tq6p.onrender.com/ (auto-deploy on push to `master`)
- Frontend (GitHub Pages): https://nandrease.github.io/movie_search/ (auto-deploy on push to `master`)

### Frontend notes (GitHub Pages)
- Frontend calls the backend using `VITE_API_BASE_URL`.
- In GitHub Actions, set repository secret `VITE_API_BASE_URL` to your Render backend URL.

## Install

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Run (dev)

### Backend (NestJS)

```bash
cd backend
npm run start:dev
```

Default: `http://localhost:3000`

### Frontend (React)

```bash
cd frontend
npm run dev
```

Vite will print the local URL (typically `http://localhost:5173`).
