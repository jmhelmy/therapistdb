type Props = {
    label: string
    options: string[]
    selected: string[]
    onToggle: (option: string) => void
  }
  
  export default function CheckboxGroup({ label, options, selected, onToggle }: Props) {
    return (
      <div>
        <p className="text-sm font-bold text-gray-800 mb-1">{label}</p>
        <div className="grid grid-cols-2 gap-2">
          {options.map(option => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => onToggle(option)}
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
      </div>
    )
  }
  