# Project startup commands

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
- **GET `/`**: API landing info (service metadata + useful links)
- **GET `/health`**: backend health status (`status`, `uptimeSeconds`, `timestamp`)
- **GET `/docs`**: Swagger UI
- **GET `/docs-json`**: OpenAPI schema JSON
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
- **GET `/movies/genres`**: official TMDB movie genres
  - **optional query params**: `language`
  - **examples**:
    - `/movies/genres`
    - `/movies/genres?language=en-US`

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

## State management
- Using React Query (@tanstack/react-query) not Redux store. I just wanted to try React query.
- therefore using custom React Context interceptor (`src\query\requestTiming\requestInterceptor.ts`)
- Otherwise is state managed in MovieSearchPage and props are passed down the component tree. Decided not to use Redux to keep the application leaner as it doesn't have so much state management.

## Test task implementation
- Implemented a custom hook (`useRecentSearches`) to store recent searches in `localStorage`.
- Open the browser developer console to view request timing logs (e.g. `movies/fetch fulfilled in 52.80ms`).

## Styling
- Used modular css approach instead of Styled components, as I find it a bit easier to read and get a grasp of the code
- Made sure that page looks ok with dark/light mode: prefers-color-scheme
- Used Netflix like experience with arrow navigation and full screen view
- Used infinite scroll from React Query for better UX

## Search
- using react-hook-form to eliminated duplicated state and keep separated search suggestions and recent searches. Recent searches are updated only when user submits SearchFilters Form.

# Next steps

- Include tests
- Improve mobile view to hide the search bar to free up screen space
- Accessibility

# External help
Used ChatGPT to give me general guide for the structure of the app.
Use Copilot for code review and optimizations.

App is quite interesting. I'll probably keep improving it further
