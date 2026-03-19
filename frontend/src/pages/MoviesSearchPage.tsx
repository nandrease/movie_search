import { useEffect, useMemo, useState } from 'react'
import MoviesSearchHeader from '../components/MoviesSearchHeader'
import MoviesSearchMetaBar from '../components/MoviesSearchMetaBar'
import MoviesResultsGrid from '../components/MoviesResultsGrid'
import RecentSearchesSidebar from '../components/RecentSearchesSidebar'
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
        <MoviesSearchHeader
          mode={mode}
          query={query}
          genre={genre}
          originalLanguage={originalLanguage}
          onQueryChange={setQuery}
          onGenreChange={setGenre}
          onOriginalLanguageChange={setOriginalLanguage}
          onSubmit={applyFilters}
        />

        <MoviesSearchMetaBar
          resultsLabel={resultsLabel}
          currentPage={data?.page}
          isError={q.isError}
          canPrev={canPrev}
          canNext={canNext}
          isFetching={q.isFetching}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => p + 1)}
          onReset={() => {
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
        />
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

        <MoviesResultsGrid
          results={results}
          activeMovieId={activeMovieId}
          emptyLabel={emptyLabel}
          onToggleMovie={(movieId) => {
            setActiveMovieId((cur) => (cur === movieId ? null : movieId))
          }}
        />
      </div>
    </div>
  )
}

