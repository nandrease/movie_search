import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { fetchMovies, searchMovies } from '../api/movies'
import type { Movie } from '../api/types'
import MovieCard from '../components/MovieCard'
import RecentSearchesSidebar from '../components/RecentSearchesSidebar'
import SearchFiltersForm from '../components/SearchFiltersForm'
import { useRecentSearches } from '../hooks/useRecentSearches'

export default function MoviesSearchPage() {
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState('')
  const [originalLanguage, setOriginalLanguage] = useState('')
  const [appliedFilters, setAppliedFilters] = useState({
    query: '',
    genre: '',
    originalLanguage: '',
  })
  const [page, setPage] = useState(1)
  const [activeMovieId, setActiveMovieId] = useState<number | null>(null)
  const { items: recentSearches, push: pushRecentSearch, clear: clearRecentSearches } =
    useRecentSearches('movie-search:recent-searches', 5)

  const mode = appliedFilters.query.trim() ? 'search' : 'popular'
  const effectiveQuery = useMemo(() => appliedFilters.query.trim(), [appliedFilters.query])
  const effectiveGenre = useMemo(() => appliedFilters.genre.trim() || undefined, [appliedFilters.genre])
  const effectiveOriginalLanguage = useMemo(
    () => appliedFilters.originalLanguage.trim() || undefined,
    [appliedFilters.originalLanguage],
  )

  useEffect(() => {
    if (!effectiveQuery) return
    pushRecentSearch(effectiveQuery)
  }, [effectiveQuery, pushRecentSearch])

  function applyFilters() {
    setPage(1)
    setAppliedFilters({
      query,
      genre,
      originalLanguage,
    })
  }

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

        <SearchFiltersForm
          query={query}
          genre={genre}
          originalLanguage={originalLanguage}
          onQueryChange={setQuery}
          onGenreChange={setGenre}
          onOriginalLanguageChange={setOriginalLanguage}
          onSubmit={applyFilters}
        />

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
                setAppliedFilters({
                  query: '',
                  genre: '',
                  originalLanguage: '',
                })
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

      <div className="content">
        <RecentSearchesSidebar
          items={recentSearches}
          onClear={clearRecentSearches}
          onApply={(term) => {
            setQuery(term)
            setPage(1)
            setAppliedFilters((prev) => ({
              ...prev,
              query: term,
            }))
          }}
        />

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
    </div>
  )
}

