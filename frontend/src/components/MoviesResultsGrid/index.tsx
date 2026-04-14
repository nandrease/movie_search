import type { Movie } from '../../query/api/types'
import { useMovieGridKeyboardNavigation } from '../../hooks/useMovieGridKeyboardNavigation'
import MovieCard from '../MovieCard'
import styles from './MoviesResultsGrid.module.css'

type MoviesResultsGridProps = {
  results: Movie[]
  activeMovieId: number | null
  emptyLabel: string
  onToggleMovie: (movieId?: number) => void
}

export default function MoviesResultsGrid({
  results,
  activeMovieId,
  emptyLabel,
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
    </main>
  )
}

