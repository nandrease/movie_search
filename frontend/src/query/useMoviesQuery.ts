import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchMovies, searchMovies } from './api/movies'

type UseMoviesQueryParams = {
  mode: 'search' | 'popular'
  query: string
  page: number
  genre?: string
  originalLanguage?: string
}

export function useMoviesQuery({
  mode,
  query,
  page,
  genre,
  originalLanguage,
}: UseMoviesQueryParams) {
  return useQuery({
    queryKey: [
      'movies',
      {
        mode,
        query,
        page,
        genre,
        original_language: originalLanguage,
      },
    ],
    queryFn: async () => {
      if (mode === 'search') {
        return await searchMovies({
          query,
          page,
          originalLanguage,
        })
      }

      return await fetchMovies({
        page,
        genre,
        originalLanguage,
      })
    },
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  })
}

