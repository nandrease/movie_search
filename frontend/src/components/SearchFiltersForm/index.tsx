import FilterInputField from './FilterInputField'
import styles from './SearchFiltersForm.module.css'

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
  return (
    <form
      className={styles.controls}
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
      <FilterInputField
        label="Search"
        value={query}
        placeholder="Batman, Inception, ..."
        onChange={onQueryChange}
        onEnter={onSubmit}
      />

      <FilterInputField
        label="Genre (popular only)"
        value={genre}
        placeholder="action or 28"
        onChange={onGenreChange}
        onEnter={onSubmit}
        disabled={query.trim().length > 0}
      />

      <FilterInputField
        label="Original language"
        value={originalLanguage}
        placeholder="en, ja, ko..."
        onChange={onOriginalLanguageChange}
        onEnter={onSubmit}
        maxLength={5}
      />
    </form>
  )
}

