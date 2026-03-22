export type MovieSearchFiltersForm = {
  query: string
  genre: string
  originalLanguage: string
}

export const defaultMovieSearchFilters: MovieSearchFiltersForm = {
  query: '',
  genre: '',
  originalLanguage: '',
}
