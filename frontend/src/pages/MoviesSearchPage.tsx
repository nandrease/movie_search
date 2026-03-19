import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { fetchMovies, searchMovies } from '../api/movies'
import type { Movie } from '../api/types'
import MovieCard from '../components/MovieCard'
import { useDebouncedValue } from '../hooks/useDebouncedValue'

export default function MoviesSearchPage() {
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState('')
  const [originalLanguage, setOriginalLanguage] = useState('')
  const [page, setPage] = useState(1)
  const [activeMovieId, setActiveMovieId] = useState<number | null>(null)

  const debouncedQuery = useDebouncedValue(query, 400)
  const debouncedGenre = useDebouncedValue(genre, 400)
  const debouncedOriginalLanguage = useDebouncedValue(originalLanguage, 400)

  const mode = debouncedQuery.trim() ? 'search' : 'popular'
  const effectiveQuery = useMemo(() => debouncedQuery.trim(), [debouncedQuery])
  const effectiveGenre = useMemo(() => debouncedGenre.trim() || undefined, [debouncedGenre])
  const effectiveOriginalLanguage = useMemo(
    () => debouncedOriginalLanguage.trim() || undefined,
    [debouncedOriginalLanguage],
  )

  const q = useQuery({
    queryKey: [
      'movies',
      {
        mode,
        query: effectiveQuery,
        page,
        genre: effectiveGenre,
        original_language: effectiveOriginalLanguage,
      },
    ],
    queryFn: async () => {
      if (mode === 'search') {
        return await searchMovies({
          query: effectiveQuery,
          page,
          originalLanguage: effectiveOriginalLanguage,
        })
      }

      return await fetchMovies({
        page,
        genre: effectiveGenre,
        originalLanguage: effectiveOriginalLanguage,
      })
    },
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  })

  const data = q.data
  const results = data?.results ?? []
  const canPrev = page > 1 && !q.isFetching
  const canNext = !!data && page < data.totalPages && !q.isFetching

  const resultsLabel = useMemo(() => {
    if (q.isFetching) return 'Loading…'
    if (q.isError) return 'Error'
    if (!data) return '—'
    return `${data.totalResults.toLocaleString()} results`
  }, [data, q.isError, q.isFetching])

  const emptyLabel = useMemo(() => {
    if (q.isFetching) return 'Loading movies…'
    if (mode === 'search') return 'No search results.'
    return 'No movies found.'
  }, [mode, q.isFetching])

  return (
    <div className="app">
      <header className="header">
        <div className="title">
          <h1>Movie Search</h1>
          <p className="subtitle">
            {mode === 'search'
              ? 'Search TMDB via your Nest backend'
              : 'Browse popular movies via your Nest backend'}
          </p>
        </div>

        <div className="controls">
          <label className="field">
            <span>Search</span>
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
              }}
              placeholder="Batman, Inception, ..."
            />
          </label>

          <label className="field">
            <span>Genre (popular only)</span>
            <input
              value={genre}
              onChange={(e) => {
                setGenre(e.target.value)
                setPage(1)
              }}
              placeholder="action or 28"
              disabled={mode === 'search'}
            />
          </label>

          <label className="field">
            <span>Original language</span>
            <input
              value={originalLanguage}
              onChange={(e) => {
                setOriginalLanguage(e.target.value)
                setPage(1)
              }}
              placeholder="en, ja, ko..."
              maxLength={5}
            />
          </label>
        </div>

        <div className="meta">
          <div className="metaLeft">
            <span className={`pill${q.isError ? ' error' : ''}`}>
              {resultsLabel}
            </span>
            {data ? <span className="pill subtle">Page {data.page}</span> : null}
          </div>

          <div className="metaRight">
            <button
              className="btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!canPrev}
            >
              Prev
            </button>
            <button
              className="btn"
              onClick={() => setPage((p) => p + 1)}
              disabled={!canNext}
            >
              Next
            </button>
            <button
              className="btn ghost"
              onClick={() => {
                setQuery('')
                setGenre('')
                setOriginalLanguage('')
                setPage(1)
                setActiveMovieId(null)
              }}
              disabled={q.isFetching}
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      {q.isError ? (
        <div className="errorBox">
          {q.error instanceof Error ? q.error.message : 'Request failed'}
        </div>
      ) : null}

      <main className="grid">
        {results.length ? (
          results.map((m: Movie) => (
            <MovieCard
              key={m.id}
              movie={m}
              active={activeMovieId === m.id}
              onToggle={() =>
                setActiveMovieId((cur) => (cur === m.id ? null : m.id))
              }
            />
          ))
        ) : (
          <div className="empty">{emptyLabel}</div>
        )}
      </main>
    </div>
  )
}

