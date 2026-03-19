import type { KeyboardEvent } from 'react'
import styles from './SearchFiltersForm.module.css'

type FilterInputFieldProps = {
  label: string
  value: string
  placeholder: string
  onChange: (value: string) => void
  onEnter: () => void
  disabled?: boolean
  maxLength?: number
}

export default function FilterInputField({
  label,
  value,
  placeholder,
  onChange,
  onEnter,
  disabled = false,
  maxLength,
}: Readonly<FilterInputFieldProps>) {
  function handleInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') return
    e.preventDefault()
    onEnter()
  }

  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input
        value={value}
        onKeyDown={handleInputKeyDown}
        onChange={(e) => {
          onChange(e.target.value)
        }}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
      />
    </label>
  )
}

