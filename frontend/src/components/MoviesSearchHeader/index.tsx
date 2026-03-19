import SearchFiltersForm from '../SearchFiltersForm'
import styles from './MoviesSearchHeader.module.css'

type MoviesSearchHeaderProps = {
  mode: 'search' | 'popular'
  query: string
  genre: string
  originalLanguage: string
  onQueryChange: (value: string) => void
  onGenreChange: (value: string) => void
  onOriginalLanguageChange: (value: string) => void
  onSubmit: () => void
}

export default function MoviesSearchHeader({
  mode,
  query,
  genre,
  originalLanguage,
  onQueryChange,
  onGenreChange,
  onOriginalLanguageChange,
  onSubmit,
}: Readonly<MoviesSearchHeaderProps>) {
  return (
    <>
      <div className={styles.title}>
        <h1>Movie Search</h1>
        <p className={styles.subtitle}>
          {mode === 'search'
            ? 'Search TMDB via your Nest backend'
            : 'Browse popular movies via your Nest backend'}
        </p>
        <small className={styles.small}>Type on the search field and press Enter to search for movies.</small>
      </div>

      <SearchFiltersForm
        query={query}
        genre={genre}
        originalLanguage={originalLanguage}
        onQueryChange={onQueryChange}
        onGenreChange={onGenreChange}
        onOriginalLanguageChange={onOriginalLanguageChange}
        onSubmit={onSubmit}
      />
    </>
  )
}

