import type { Movie } from '../../api/types'
import styles from './MovieCard.module.css'

export type MovieCardProps = {
  movie: Movie
  active: boolean
  onToggle: () => void
}

export default function MovieCard({
  movie,
  active,
  onToggle,
}: Readonly<MovieCardProps>) {
  return (
    <button
      type="button"
      className={[styles.card, active ? styles.expanded : ''].join(' ').trim()}
      onClick={onToggle}
      aria-expanded={active}
    >
      <div className={styles.poster}>
        {movie.image ? (
          <img src={movie.image} alt="" loading="lazy" />
        ) : (
          <div className={styles.posterPlaceholder}>No image</div>
        )}
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardTitleRow}>
          <h3 className={styles.cardTitle}>{movie.title}</h3>
          <span className={styles.rating} title="TMDB rating">
            {movie.rating.toFixed(1)}
          </span>
        </div>

        {movie.originalTitle ? (
          <div className={styles.cardSub}>
            {movie.originalTitle}
            {movie.language ? (
              <span className={styles.lang}>({movie.language})</span>
            ) : null}
          </div>
        ) : null}

        {movie.genres.length ? (
          <div className={styles.cardGenres}>{movie.genres.join(', ')}</div>
        ) : null}

        <div className={styles.cardDescription} aria-hidden={!active}>
          {movie.description}
        </div>

        <div className={styles.cardMeta}>
          <span>{movie.releaseYear ?? '—'}</span>
          <span className={styles.dot}>•</span>
          <span>ID {movie.id}</span>
        </div>
      </div>
    </button>
  )
}

