import type { Movie } from '../../query/api/types'
import { useMovieGridKeyboardNavigation } from '../../hooks/useMovieGridKeyboardNavigation'
import MovieCard from '../MovieCard'
import styles from './MoviesResultsGrid.module.css'

type MoviesResultsGridProps = {
  results: Movie[]
  activeMovieId: number | null
  emptyLabel: string
  isFetchingNextPage: boolean
  hasNextPage: boolean
  onToggleMovie: (movieId?: number) => void
}

export default function MoviesResultsGrid({
  results,
  activeMovieId,
  emptyLabel,
  isFetchingNextPage,
  hasNextPage,
  onToggleMovie,
}: Readonly<MoviesResultsGridProps>) {
  const { gridRef, onCardKeyDown } = useMovieGridKeyboardNavigation()

  return (
    <main ref={gridRef} className={styles.grid}>
      {results.length ? (
        results.map((m, index) => (
          <MovieCard
            key={m.id}
            movie={m}
            active={activeMovieId === m.id}
            cardIndex={index}
            onCardKeyDown={onCardKeyDown}
            onToggle={(movieId) => onToggleMovie(movieId ?? m.id)}
          />
        ))
      ) : (
        <div className={styles.empty}>{emptyLabel}</div>
      )}

      {results.length > 0 && isFetchingNextPage ? (
        <div className={styles.fetchingMore}>Loading more movies…</div>
      ) : null}
      {results.length > 0 && !hasNextPage ? (
        <div className={styles.fetchingMore}>End of results</div>
      ) : null}
    </main>
  )
}

