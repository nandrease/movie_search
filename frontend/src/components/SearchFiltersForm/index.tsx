import FilterInputField from './FilterInputField'
import FilterSelectField from './FilterSelectField'
import styles from './SearchFiltersForm.module.css'

type SearchFiltersFormProps = {
  query: string
  genre: string
  originalLanguage: string
  genreSuggestions: string[]
  onQueryChange: (value: string) => void
  onGenreChange: (value: string) => void
  onOriginalLanguageChange: (value: string) => void
  onSubmit: (overrides?: Partial<{ query: string; genre: string; originalLanguage: string }>) => void
}

export default function SearchFiltersForm({
  query,
  genre,
  originalLanguage,
  genreSuggestions,
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
          (from instanceof HTMLInputElement || from instanceof HTMLSelectElement) &&
          (to instanceof HTMLInputElement || to instanceof HTMLSelectElement)
        if (isInputSwitch) {
          onSubmit()
        }
      }}
    >
      <FilterInputField
        label="Search"
        name="search"
        value={query}
        placeholder="Batman, Inception, ..."
        onChange={onQueryChange}
        onEnter={onSubmit}
      />

      <FilterSelectField
        label="Genre (popular only)"
        name="genre"
        value={genre}
        placeholder="Select genre"
        onChange={(value) => {
          onGenreChange(value)
          onSubmit({ genre: value })
        }}
        options={genreSuggestions}
        disabled={query.trim().length > 0}
      />

      <FilterInputField
        label="Original language"
        name="original-language"
        value={originalLanguage}
        placeholder="en, ja, ko..."
        onChange={onOriginalLanguageChange}
        onEnter={onSubmit}
        maxLength={5}
      />
    </form>
  )
}

