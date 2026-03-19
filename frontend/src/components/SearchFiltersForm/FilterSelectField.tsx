import styles from './SearchFiltersForm.module.css'

type FilterSelectFieldProps = {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder: string
  disabled?: boolean
}

export default function FilterSelectField({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
}: Readonly<FilterSelectFieldProps>) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <select
        name={name}
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
        }}
        disabled={disabled}
      >
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

