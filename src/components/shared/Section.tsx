// src/components/shared/Section.tsx
export default function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <div className="pt-4 border-t border-gray-200">
        <h4 className="font-semibold text-base mb-2">{title}</h4>
        {children}
      </div>
    )
  }
  