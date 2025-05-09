'use client'

import { Tab } from './ProfileWizard'

type Props = {
  tabs: readonly Tab[]
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
}

export default function StepTabs({ tabs, activeTab, setActiveTab }: Props) {
  return (
    <nav className="flex space-x-4 mb-8">
      {tabs.map(tab => (
        <button
          key={tab}
          className={`px-3 py-1 rounded ${tab === activeTab ? 'bg-teal-600 text-white' : 'bg-gray-100'}`}
          onClick={() => setActiveTab(tab)}
          type="button"
        >
          {tab.replace(/([A-Z])/g, ' $1').trim()}
        </button>
      ))}
    </nav>
  )
}
