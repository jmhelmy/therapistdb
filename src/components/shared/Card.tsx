// src/components/shared/Card.tsx
export default function Card({
    title,
    children,
  }: {
    title: string
    children: React.ReactNode
  }) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <div className="space-y-2 text-sm text-gray-800">{children}</div>
      </div>
    )
  }
  