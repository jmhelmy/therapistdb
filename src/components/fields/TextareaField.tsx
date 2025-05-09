type Props = {
    label: string
    name: string
    register: ReturnType<typeof useForm>['register']
    error?: string
    placeholder?: string
    rows?: number
    helperText?: string
  }
  
  export default function TextareaField({ label, name, register, error, placeholder = '', rows = 4, helperText }: Props) {
    return (
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1">{label}</label>
        {helperText && <p className="text-sm text-gray-500 mb-1">{helperText}</p>}
        <textarea
          {...register(name)}
          rows={rows}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    )
  }
  