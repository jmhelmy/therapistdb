// components/fields/TextField.tsx
import { UseFormRegister } from 'react-hook-form'

type Props = {
  label: string
  name: string
  register: UseFormRegister<any> // or UseFormRegister<YourSchemaType> if typing strictly
  error?: string
  placeholder?: string
  type?: string
}

export default function TextField({
  label,
  name,
  register,
  error,
  placeholder = '',
  type = 'text',
}: Props) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-800 mb-1">
        {label}
      </label>
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}
