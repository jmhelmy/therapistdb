type Option = { value: string; label: string }

type Props = {
  label: string
  name: string
  options: Option[]
  register: ReturnType<typeof useForm>['register']
  error?: string
}

export default function Dropdown({ label, name, options, register, error }: Props) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-800 mb-1">{label}</label>
      <select {...register(name)} className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100">
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}
