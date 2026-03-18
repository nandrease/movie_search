import type { Movie } from '../api/types'

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
      className={`card${active ? ' expanded' : ''}`}
      onClick={onToggle}
      aria-expanded={active}
    >
      <div className="poster">
        {movie.image ? (
          <img src={movie.image} alt="" loading="lazy" />
        ) : (
          <div className="posterPlaceholder">No image</div>
        )}
      </div>

      <div className="cardBody">
        <div className="cardTitleRow">
          <h3 className="cardTitle">{movie.title}</h3>
          <span className="rating" title="TMDB rating">
            {movie.rating.toFixed(1)}
          </span>
        </div>

        {movie.originalTitle ? (
          <div className="cardSub">
            {movie.originalTitle}
            {movie.language ? (
              <span className="lang">({movie.language})</span>
            ) : null}
          </div>
        ) : null}

        {movie.genres.length ? (
          <div className="cardGenres">{movie.genres.join(', ')}</div>
        ) : null}

        <div className="cardDescription" aria-hidden={!active}>
          {movie.description}
        </div>

        <div className="cardMeta">
          <span>{movie.releaseYear ?? '—'}</span>
          <span className="dot">•</span>
          <span>ID {movie.id}</span>
        </div>
      </div>
    </button>
  )
}

