import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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

  const [activeMovieId, setActiveMovieId] = useState<number | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const { items: recentSearches, push: pushRecentSearch, clear: clearRecentSearches } =
    useRecentSearches('movie-search:recent-searches', 5)

  const debouncedQuery = useDebouncedValue(query, 400)
  const effectiveQuery = useMemo(() => debouncedQuery.trim(), [debouncedQuery])
  const mode = effectiveQuery ? 'search' : 'popular'
  const effectiveGenre = genre.trim() || undefined
  const effectiveOriginalLanguage = originalLanguage.trim() || undefined

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
    genre: effectiveGenre,
    originalLanguage: effectiveOriginalLanguage,
  })
  const genresQuery = useMovieGenresQuery()

  const pages = useMemo(() => q.data?.pages ?? [], [q.data?.pages])
  const lastPage = pages.at(-1)
  const results = useMemo(() => pages.flatMap((pageItem) => pageItem.results), [pages])

  useEffect(() => {
    if (!q.hasNextPage) return
    const target = loadMoreRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        if (q.isFetchingNextPage) return
        q.fetchNextPage()
      },
      { rootMargin: '360px 0px' },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [q])

  const resultsLabel = useMemo(() => {
    if (q.isFetching) return 'Loading…'
    if (q.isError) return 'Error'
    if (!lastPage) return '—'
    return `${lastPage.totalResults.toLocaleString()} results`
  }, [lastPage, q.isError, q.isFetching])

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
            onFilterChange={() => setActiveMovieId(null)}
            onSearchSubmit={handleSearchSubmit}
          />

          <MoviesSearchMetaBar
            resultsLabel={resultsLabel}
            loadedPages={pages.length || undefined}
            isError={q.isError}
            isFetching={q.isFetching}
            onReset={() => {
              form.reset(defaultMovieSearchFilters)
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
          <div className={styles.resultsCol}>
            <MoviesResultsGrid
              results={results}
              activeMovieId={activeMovieId}
              emptyLabel={emptyLabel}
              isFetchingNextPage={q.isFetchingNextPage}
              hasNextPage={!!q.hasNextPage}
              onToggleMovie={(movieId) => {
                if (movieId === undefined) {
                  setActiveMovieId(null)
                  return
                }
                setActiveMovieId((cur) => (cur === movieId ? null : movieId))
              }}
            />
            <div ref={loadMoreRef} className={styles.loadMoreTrigger} aria-hidden />
          </div>

          <div className={styles.sidebarCol}>
            <RecentSearchesSidebar
              items={recentSearches}
              onClear={clearRecentSearches}
              onApply={(term) => {
                form.setValue('query', term, { shouldDirty: true })
                setActiveMovieId(null)
              }}
            />
          </div>
        </div>
      </div>
    </FormProvider>
  )
}
