# Backend (NestJS)

NestJS service that acts as a middle layer between the frontend and TMDB.

## Requirements

- Node.js (LTS recommended)
- `TMDB_API_KEY` in environment variables

## Environment

Create `backend/.env` (or copy `backend/.env.example`) and set:

```env
TMDB_API_KEY=your_tmdb_api_key
```

## Run locally

```bash
npm install
npm run start:dev
```

Default base URL: `http://localhost:3000`

## Deployed

- Render: <https://movie-search-tq6p.onrender.com/>

## API

### `GET /`

API landing info (service metadata + useful links).

### `GET /health`

Health status endpoint.

Returns:

- `status`
- `uptimeSeconds`
- `timestamp`

### `GET /docs`

Swagger UI for interactive API exploration.

### `GET /docs-json`

OpenAPI schema JSON.

### `GET /movies`

Fetches popular movies.

Optional query params:

- `page` (number)
- `language` (e.g. `en-US`)
- `original_language` (e.g. `en`, `ja`)
- `genre` (TMDB genre name like `action` or genre id like `28`)

Examples:

- `/movies`
- `/movies?page=2`
- `/movies?genre=action`
- `/movies?genre=28&original_language=ja`

### `GET /movies/search`

Searches movies by title.

Query params:

- required: `query`
- optional: `page`, `language`, `original_language`

Examples:

- `/movies/search?query=batman`
- `/movies/search?query=batman&original_language=en`

### `GET /movies/genres`

Returns official TMDB movie genres.

Optional query params:

- `language` (e.g. `en-US`)

Examples:

- `/movies/genres`
- `/movies/genres?language=en-US`

Response:

```ts
type MovieGenre = {
  id: number
  name: string
}
```

## Response shape

Both `/movies` and `/movies/search` return:

```ts
type PagedResponse<T> = {
  page: number
  results: T[]
  totalPages: number
  totalResults: number
}

type Movie = {
  id: number
  title: string
  description: string
  genres: string[]
  originalTitle?: string
  releaseYear: number | null
  rating: number
  image: string | null
  language?: string
}
```

## TMDB data transformation

The backend transforms TMDB payloads into this internal schema.
It is not a proxy pass-through.

Examples:

- `overview` -> `description`
- `release_date` -> `releaseYear`
- `poster_path` -> full image URL
- `genre_ids` -> genre names
- `originalTitle` and `language` only included when different from localized title
