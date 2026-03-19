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
    <aside className="sidebar">
      <div className="sidebarHeader">
        <h2>Recent Searches</h2>
        <button
          type="button"
          className="btn ghost"
          onClick={onClear}
          disabled={!items.length}
        >
          Clear
        </button>
      </div>
      {items.length ? (
        <ul className="recentList">
          {items.map((term) => (
            <li key={term}>
              <button
                type="button"
                className="recentBtn"
                onClick={() => onApply(term)}
              >
                {term}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty small">No recent searches yet.</div>
      )}
    </aside>
  )
}

