type Props = {
    label: string
    name: string
    register: ReturnType<typeof useForm>['register']
  }
  
  export default function CheckboxSingle({ label, name, register }: Props) {
    return (
      <label className="inline-flex items-center space-x-2 text-sm text-gray-700">
        <input type="checkbox" {...register(name)} className="form-checkbox" />
        <span>{label}</span>
      </label>
    )
  }
  