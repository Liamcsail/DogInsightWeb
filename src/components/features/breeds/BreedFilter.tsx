import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter as FilterIcon } from 'lucide-react'

interface BreedFilterProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  selectedPersonality: string[]
  onPersonalityChange: (personality: string) => void
  categories: string[]
  personalities: string[]
}

export function BreedFilter({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedPersonality,
  onPersonalityChange,
  categories,
  personalities,
}: BreedFilterProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Input
              type="search"
              placeholder="搜索犬种..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-2">
          <FilterIcon className="text-gray-400 flex-shrink-0" />
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => onCategoryChange(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {personalities.map(personality => (
          <Badge
            key={personality}
            variant={selectedPersonality.includes(personality) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onPersonalityChange(personality)}
          >
            {personality}
          </Badge>
        ))}
      </div>
    </div>
  )
}