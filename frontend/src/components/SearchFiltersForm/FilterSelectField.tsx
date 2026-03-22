import type { ComponentPropsWithoutRef } from 'react'
import styles from './SearchFiltersForm.module.css'

type FilterSelectFieldProps = {
  label: string
  options: string[]
  placeholder: string
  selectProps: ComponentPropsWithoutRef<'select'>
}

export default function FilterSelectField({
  label,
  options,
  placeholder,
  selectProps,
}: Readonly<FilterSelectFieldProps>) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <select {...selectProps}>
        <option value="">{placeholder}</option>
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  )
}
