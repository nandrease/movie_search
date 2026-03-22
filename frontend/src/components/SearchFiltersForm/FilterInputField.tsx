import type { ComponentPropsWithoutRef } from 'react'
import styles from './SearchFiltersForm.module.css'

type FilterInputFieldProps = {
  label: string
  inputProps: ComponentPropsWithoutRef<'input'>
}

export default function FilterInputField({ label, inputProps }: Readonly<FilterInputFieldProps>) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input {...inputProps} autoComplete="off" />
    </label>
  )
}
