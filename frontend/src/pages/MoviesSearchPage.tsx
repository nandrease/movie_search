import { useCallback, useMemo, useState } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import MoviesSearchHeader from '../components/MoviesSearchHeader'
import MoviesSearchMetaBar from '../components/MoviesSearchMetaBar'
import MoviesResultsGrid from '../components/MoviesResultsGrid'
import RecentSearchesSidebar from '../components/RecentSearchesSidebar'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useRecentSearches } from '../hooks/useRecentSearches'
import {
  defaultMovieSearchFilters,
  type MovieSearchFiltersForm,
} from '../search/movieSearchFilters'
import { useMovieGenresQuery } from '../query/useMovieGenresQuery'
import { useMoviesQuery } from '../query/useMoviesQuery'
import styles from './MoviesSearchPage.module.css'

export default function MoviesSearchPage() {
  const form = useForm<MovieSearchFiltersForm>({
    defaultValues: defaultMovieSearchFilters,
  })

  const query = useWatch({ control: form.control, name: 'query' })
  const genre = useWatch({ control: form.control, name: 'genre' })
  const originalLanguage = useWatch({ control: form.control, name: 'originalLanguage' })

  const [page, setPage] = useState(1)
  const [activeMovieId, setActiveMovieId] = useState<number | null>(null)

  const { items: recentSearches, push: pushRecentSearch, clear: clearRecentSearches } =
    useRecentSearches('movie-search:recent-searches', 5)

  const debouncedQuery = useDebouncedValue(query, 400)
  const effectiveQuery = useMemo(() => debouncedQuery.trim(), [debouncedQuery])
  const mode = effectiveQuery ? 'search' : 'popular'
  const effectiveGenre = genre.trim() || undefined
  const effectiveOriginalLanguage = originalLanguage.trim() || undefined

  function resetPageForFilterChange() {
    setPage(1)
  }

  const handleSearchSubmit = useCallback(
    (data: MovieSearchFiltersForm) => {
      const trimmed = data.query.trim()
      if (trimmed) pushRecentSearch(trimmed)
    },
    [pushRecentSearch],
  )

  const q = useMoviesQuery({
    mode,
    query: effectiveQuery,
    page,
    genre: effectiveGenre,
    originalLanguage: effectiveOriginalLanguage,
  })
  const genresQuery = useMovieGenresQuery()

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
    <FormProvider {...form}>
      <div className={styles.app}>
        <header className={styles.header}>
          <MoviesSearchHeader
            mode={mode}
            genreSuggestions={(genresQuery.data ?? []).map((genreItem) => genreItem.name)}
            onFilterChange={resetPageForFilterChange}
            onSearchSubmit={handleSearchSubmit}
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
              form.reset(defaultMovieSearchFilters)
              setPage(1)
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
              form.setValue('query', term, { shouldDirty: true })
              setPage(1)
            }}
          />

          <MoviesResultsGrid
            results={results}
            activeMovieId={activeMovieId}
            emptyLabel={emptyLabel}
            onToggleMovie={(movieId) => {
              if (movieId === undefined) {
                setActiveMovieId(null)
                return
              }
              setActiveMovieId((cur) => (cur === movieId ? null : movieId))
            }}
          />
        </div>
      </div>
    </FormProvider>
  )
}
