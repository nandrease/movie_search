import { useEffect, useMemo, useState } from 'react'
import type { Movie } from '../query/api/types'
import MovieCard from '../components/MovieCard'
import RecentSearchesSidebar from '../components/RecentSearchesSidebar'
import SearchFiltersForm from '../components/SearchFiltersForm'
import { useRecentSearches } from '../hooks/useRecentSearches'
import { useMoviesQuery } from '../query/useMoviesQuery'
import styles from './MoviesSearchPage.module.css'

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

  const q = useMoviesQuery({
    mode,
    query: effectiveQuery,
    page,
    genre: effectiveGenre,
    originalLanguage: effectiveOriginalLanguage,
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
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.title}>
          <h1>Movie Search</h1>
          <p className={styles.subtitle}>
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

        <div className={styles.meta}>
          <div className={styles.metaLeft}>
            <span className={[styles.pill, q.isError ? styles.pillError : ''].join(' ').trim()}>
              {resultsLabel}
            </span>
            {data ? <span className={`${styles.pill} ${styles.pillSubtle}`}>Page {data.page}</span> : null}
          </div>

          <div className={styles.metaRight}>
            <button
              className={styles.btn}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!canPrev}
            >
              Prev
            </button>
            <button
              className={styles.btn}
              onClick={() => setPage((p) => p + 1)}
              disabled={!canNext}
            >
              Next
            </button>
            <button
              className={`${styles.btn} ${styles.btnGhost}`}
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
        <div className={styles.errorBox}>
          {q.error instanceof Error ? q.error.message : 'Request failed'}
        </div>
      ) : null}

      <div className={styles.content}>
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

        <main className={styles.grid}>
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
            <div className={styles.empty}>{emptyLabel}</div>
          )}
        </main>
      </div>
    </div>
  )
}

