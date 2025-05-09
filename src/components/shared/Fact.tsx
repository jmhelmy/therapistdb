// src/components/shared/Fact.tsx
export function Fact({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="grid grid-cols-[auto,1fr] gap-x-4 py-1 text-sm text-gray-800">
      <dt className="font-semibold">{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}
