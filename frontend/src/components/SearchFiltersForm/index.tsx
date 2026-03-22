import { Controller, useFormContext } from 'react-hook-form'
import type { MovieSearchFiltersForm } from '../../search/movieSearchFilters'
import FilterInputField from './FilterInputField'
import FilterSelectField from './FilterSelectField'
import styles from './SearchFiltersForm.module.css'

type SearchFiltersFormProps = {
  genreSuggestions: string[]
  onFilterChange: () => void
  onSearchSubmit: (data: MovieSearchFiltersForm) => void
}

export default function SearchFiltersForm({
  genreSuggestions,
  onFilterChange,
  onSearchSubmit,
}: Readonly<SearchFiltersFormProps>) {
  const { control, handleSubmit, watch } = useFormContext<MovieSearchFiltersForm>()
  const query = watch('query')

  return (
    <form className={styles.controls} onSubmit={handleSubmit(onSearchSubmit)}>
      <Controller
        name="query"
        control={control}
        render={({ field }) => (
          <FilterInputField
            label="Search"
            inputProps={{
              ...field,
              placeholder: 'Batman, Inception, ...',
              onChange: (e) => {
                field.onChange(e)
                onFilterChange()
              },
            }}
          />
        )}
      />

      <Controller
        name="genre"
        control={control}
        render={({ field }) => (
          <FilterSelectField
            label="Genre (popular only)"
            placeholder="Select genre"
            options={genreSuggestions}
            selectProps={{
              ...field,
              disabled: query.trim().length > 0,
              onChange: (e) => {
                field.onChange(e)
                onFilterChange()
              },
            }}
          />
        )}
      />

      <Controller
        name="originalLanguage"
        control={control}
        render={({ field }) => (
          <FilterInputField
            label="Original language"
            inputProps={{
              ...field,
              placeholder: 'en, ja, ko...',
              maxLength: 5,
              onChange: (e) => {
                field.onChange(e)
                onFilterChange()
              },
            }}
          />
        )}
      />

      <div className={styles.submitWrap}>
        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </div>
    </form>
  )
}
