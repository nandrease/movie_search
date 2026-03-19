type SearchFiltersFormProps = {
  query: string
  genre: string
  originalLanguage: string
  onQueryChange: (value: string) => void
  onGenreChange: (value: string) => void
  onOriginalLanguageChange: (value: string) => void
  onSubmit: () => void
}

export default function SearchFiltersForm({
  query,
  genre,
  originalLanguage,
  onQueryChange,
  onGenreChange,
  onOriginalLanguageChange,
  onSubmit,
}: Readonly<SearchFiltersFormProps>) {
  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') return
    e.preventDefault()
    onSubmit()
  }

  return (
    <form
      className="controls"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      onBlurCapture={(e) => {
        const from = e.target
        const to = e.relatedTarget
        const isInputSwitch =
          from instanceof HTMLInputElement && to instanceof HTMLInputElement
        if (isInputSwitch) {
          onSubmit()
        }
      }}
    >
      <label className="field">
        <span>Search</span>
        <input
          value={query}
          onKeyDown={handleInputKeyDown}
          onChange={(e) => {
            onQueryChange(e.target.value)
          }}
          placeholder="Batman, Inception, ..."
        />
      </label>

      <label className="field">
        <span>Genre (popular only)</span>
        <input
          value={genre}
          onKeyDown={handleInputKeyDown}
          onChange={(e) => {
            onGenreChange(e.target.value)
          }}
          placeholder="action or 28"
          disabled={query.trim().length > 0}
        />
      </label>

      <label className="field">
        <span>Original language</span>
        <input
          value={originalLanguage}
          onKeyDown={handleInputKeyDown}
          onChange={(e) => {
            onOriginalLanguageChange(e.target.value)
          }}
          placeholder="en, ja, ko..."
          maxLength={5}
        />
      </label>
    </form>
  )
}

