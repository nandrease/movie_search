import SearchFiltersForm from '../SearchFiltersForm'
import type { MovieSearchFiltersForm } from '../../search/movieSearchFilters'
import styles from './MoviesSearchHeader.module.css'

type MoviesSearchHeaderProps = {
  mode: 'search' | 'popular'
  genreSuggestions: string[]
  onFilterChange: () => void
  onSearchSubmit: (data: MovieSearchFiltersForm) => void
}

export default function MoviesSearchHeader({
  mode,
  genreSuggestions,
  onFilterChange,
  onSearchSubmit,
}: Readonly<MoviesSearchHeaderProps>) {
  return (
    <>
      <div className={styles.title}>
        <h1>Movie Search</h1>
        <p className={styles.subtitle}>
          {mode === 'search'
            ? 'Search TMDB via our Nest backend'
            : 'Browse popular movies from TMDB via our Nest backend'}
        </p>
        <small className={styles.small}>
          Type in the search field, then press Enter or click Search to run a search and save it to search history.
        </small>
      </div>

      <SearchFiltersForm
        genreSuggestions={genreSuggestions}
        onFilterChange={onFilterChange}
        onSearchSubmit={onSearchSubmit}
      />
    </>
  )
}
