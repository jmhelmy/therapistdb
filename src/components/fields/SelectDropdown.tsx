type Option = { label: string; value: string }

type Props = {
  label: string
  name: string
  options: Option[]
  register: ReturnType<typeof useForm>['register']
  error?: string
  helperText?: string
}

export default function SelectDropdown({ label, name, options, register, error, helperText }: Props) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-800 mb-1">{label}</label>
      {helperText && <p className="text-sm text-gray-500 mb-1">{helperText}</p>}
      <select
        {...register(name)}
        className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100"
      >
        {options.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}
