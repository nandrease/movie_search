import type { Movie } from '../../query/api/types'
import MovieCard from '../MovieCard'
import styles from './MoviesResultsGrid.module.css'

type MoviesResultsGridProps = {
  results: Movie[]
  activeMovieId: number | null
  emptyLabel: string
  onToggleMovie: (movieId: number) => void
}

export default function MoviesResultsGrid({
  results,
  activeMovieId,
  emptyLabel,
  onToggleMovie,
}: Readonly<MoviesResultsGridProps>) {
  return (
    <main className={styles.grid}>
      {results.length ? (
        results.map((m) => (
          <MovieCard
            key={m.id}
            movie={m}
            active={activeMovieId === m.id}
            onToggle={() => onToggleMovie(m.id)}
          />
        ))
      ) : (
        <div className={styles.empty}>{emptyLabel}</div>
      )}
    </main>
  )
}

