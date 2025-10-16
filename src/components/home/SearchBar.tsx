import { useState } from 'react'
import { Search } from 'lucide-react'
import { CAR_CATEGORIES } from '../../types'

interface SearchBarProps {
  onSearch: (query: string, category: string) => void
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query, category)
  }

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory)
    onSearch(query, newCategory)
  }

  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              onSearch(e.target.value, category)
            }}
            placeholder="Search car images..."
            className="w-full pl-12 pr-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 text-white transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleCategoryChange('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              category === 'all'
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All
          </button>
          {CAR_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                category === cat
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </form>
    </div>
  )
}
