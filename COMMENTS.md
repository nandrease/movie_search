# Project structure

## Backend
```
npx -y @nestjs/cli new backend --package-manager npm --skip-git
```
### FrontEnd
```
npm create vite@latest frontend -- --template react-ts
```

# Backend

## Endpoints
- **GET `/`**: health check (`Hello World!`)
- **GET `/movies`**: popular movies (TMDB)
  - **query params**:
    - `page` (number)
    - `language` (TMDB response language, e.g. `en-US`)
    - `original_language` (filter results by original language, e.g. `en`, `ja`)
    - `genre` (genre name like `action` or TMDB genre id like `28`)
  - **examples**:
    - `/movies`
    - `/movies?page=2`
    - `/movies?genre=action`
    - `/movies?genre=28&original_language=ja`
- **GET `/movies/search`**: search movies (TMDB)
  - **required query params**: `query`
  - **optional query params**: `page`, `language`, `original_language`
  - **examples**:
    - `/movies/search?query=batman`
    - `/movies/search?query=batman&original_language=en`

### Backend data transformations
API returns movies in a paged response:
```
export type PagedResponse<T> = {
  page: number;
  results: T[];
  totalPages: number;
  totalResults: number;
};

export type Movie = {
  id: number;
  title: string;
  description: string;
  genres: string[];
  originalTitle?: string;
  releaseYear: number | null;
  rating: number;
  image: string | null;
  language?: string;
};
```
`originalTitle` and `language` are only returned when they differ from title


# Frontend
## Custom middleware
Using React Query (@tanstack/react-query) therefore using custom React Context interceptor (`frontend\src\interceptors\requestInterceptor.ts`)
