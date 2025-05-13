import Image from 'next/image'
import Link from 'next/link'
import path from 'path'
import fs from 'fs/promises'

interface Worksheet {
  id: string
  title: string
  image: string
  description: string
}

export default async function WorksheetsPage() {
  const dataFilePath = path.join(process.cwd(), 'public', 'worksheets.json')
  const fileContent = await fs.readFile(dataFilePath, 'utf-8')
  const worksheets: Worksheet[] = JSON.parse(fileContent)

  return (
    <main className="min-h-screen bg-[#f9f9f7] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-[#1a2d3e] mb-10">Therapy Worksheets</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {worksheets.map((sheet) => (
            <Link
              key={sheet.id}
              href={`/worksheets/${sheet.id}`}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 block"
            >
              <Image
                src={`/img/worksheet/${sheet.image}`}
                alt={sheet.title}
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-[#1a2d3e] mb-2">
                  {sheet.title}
                </h2>
                <p className="text-sm text-gray-600">{sheet.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
