import styles from './MoviesSearchMetaBar.module.css'

type MoviesSearchMetaBarProps = {
  resultsLabel: string
  loadedPages?: number
  isError: boolean
  isFetching: boolean
  onReset: () => void
}

export default function MoviesSearchMetaBar({
  resultsLabel,
  loadedPages,
  isError,
  isFetching,
  onReset,
}: Readonly<MoviesSearchMetaBarProps>) {
  return (
    <div className={styles.meta}>
      <div className={styles.metaLeft}>
        <span className={[styles.pill, isError ? styles.pillError : ''].join(' ').trim()}>
          {resultsLabel}
        </span>
        {typeof loadedPages === 'number' ? (
          <span className={`${styles.pill} ${styles.pillSubtle}`}>
            Loaded {loadedPages} page{loadedPages === 1 ? '' : 's'}
          </span>
        ) : null}
      </div>

      <div className={styles.metaRight}>
        <button className={`${styles.btn} ${styles.btnGhost}`} onClick={onReset} disabled={isFetching}>
          Reset
        </button>
      </div>
    </div>
  )
}

