import styles from './RecentSearchesSidebar.module.css'

type RecentSearchesSidebarProps = {
  items: string[]
  onApply: (term: string) => void
  onClear: () => void
}

export default function RecentSearchesSidebar({
  items,
  onApply,
  onClear,
}: Readonly<RecentSearchesSidebarProps>) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2>Recent Searches</h2>
        <button
          type="button"
          className={styles.btn}
          onClick={onClear}
          disabled={!items.length}
        >
          Clear
        </button>
      </div>
      {items.length ? (
        <ul className={styles.recentList}>
          {items.map((term) => (
            <li key={term}>
              <button
                type="button"
                className={styles.recentBtn}
                onClick={() => onApply(term)}
              >
                {term}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.emptySmall}>No recent searches yet.</div>
      )}
    </aside>
  )
}

