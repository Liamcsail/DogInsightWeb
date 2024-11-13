import React from 'react'
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface PostFilterProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedTag: string
  onTagSelect: (tag: string) => void
  breedTags: string[]
  topicTags: string[]
}

export function PostFilter({
  searchTerm,
  onSearchChange,
  selectedTag,
  onTagSelect,
  breedTags,
  topicTags
}: PostFilterProps) {
  return (
    <div className="space-y-4">
      <Input
        type="search"
        placeholder="搜索狗狗品种或话题..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="mb-4"
      />
      <div className="flex flex-wrap gap-2 mb-4">
        {breedTags.map(tag => (
          <Badge
            key={tag}
            variant={selectedTag === tag ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onTagSelect(selectedTag === tag ? '' : tag)}
          >
            {tag}
          </Badge>
        ))}
        {topicTags.map(tag => (
          <Badge
            key={tag}
            variant={selectedTag === tag ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() => onTagSelect(selectedTag === tag ? '' : tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  )
}