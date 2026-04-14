import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchMovies, searchMovies } from './api/movies'
import type { PagedResponse, Movie } from './api/types'

type UseMoviesQueryParams = {
  mode: 'search' | 'popular'
  query: string
  genre?: string
  originalLanguage?: string
}

export function useMoviesQuery({
  mode,
  query,
  genre,
  originalLanguage,
}: UseMoviesQueryParams) {
  return useInfiniteQuery<PagedResponse<Movie>>({
    queryKey: [
      'movies',
      {
        mode,
        query,
        genre,
        original_language: originalLanguage,
      },
    ],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const page = pageParam
      if (mode === 'search') {
        return await searchMovies({
          query,
          page: page ? Number(page) : undefined,
          originalLanguage,
        })
      }

      return await fetchMovies({
        page: page ? Number(page) : undefined,
        genre,
        originalLanguage,
      })
    },
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    staleTime: 10_000,
  })
}

