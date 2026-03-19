import { useQuery } from '@tanstack/react-query'
import { fetchMovieGenres } from './api/movies'

export function useMovieGenresQuery(language = 'en-US') {
  return useQuery({
    queryKey: ['movieGenres', language],
    queryFn: async () => await fetchMovieGenres({ language }),
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}

