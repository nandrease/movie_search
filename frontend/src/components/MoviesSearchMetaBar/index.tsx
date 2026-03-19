import styles from './MoviesSearchMetaBar.module.css'

type MoviesSearchMetaBarProps = {
  resultsLabel: string
  currentPage?: number
  isError: boolean
  canPrev: boolean
  canNext: boolean
  isFetching: boolean
  onPrev: () => void
  onNext: () => void
  onReset: () => void
}

export default function MoviesSearchMetaBar({
  resultsLabel,
  currentPage,
  isError,
  canPrev,
  canNext,
  isFetching,
  onPrev,
  onNext,
  onReset,
}: Readonly<MoviesSearchMetaBarProps>) {
  return (
    <div className={styles.meta}>
      <div className={styles.metaLeft}>
        <span className={[styles.pill, isError ? styles.pillError : ''].join(' ').trim()}>
          {resultsLabel}
        </span>
        {typeof currentPage === 'number' ? (
          <span className={`${styles.pill} ${styles.pillSubtle}`}>Page {currentPage}</span>
        ) : null}
      </div>

      <div className={styles.metaRight}>
        <button className={styles.btn} onClick={onPrev} disabled={!canPrev}>
          Prev
        </button>
        <button className={styles.btn} onClick={onNext} disabled={!canNext}>
          Next
        </button>
        <button className={`${styles.btn} ${styles.btnGhost}`} onClick={onReset} disabled={isFetching}>
          Reset
        </button>
      </div>
    </div>
  )
}

