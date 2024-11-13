import { useState, useEffect } from 'react'

export interface Breed {
  id: number
  name: string
  description: string
  image: string
  category: string
  personality: string[]
  stats: {
    friendliness: number
    energyLevel: number
    trainability: number
    groomingNeeds: number
    adaptability: number
  }
}

interface BreedsState {
  breeds: Breed[]
  isLoading: boolean
  error: string | null
  categories: string[]
  personalities: string[]
}

export function useBreeds() {
  const [state, setState] = useState<BreedsState>({
    breeds: [],
    isLoading: true,
    error: null,
    categories: ['全部', '小型犬', '中型犬', '大型犬'],
    personalities: ['友善', '聪明', '活泼', '温顺', '忠诚']
  })

  useEffect(() => {
    fetchBreeds()
  }, [])

  const fetchBreeds = async () => {
    try {
      const response = await fetch('/api/breeds')
      if (response.ok) {
        const data = await response.json()
        setState(prev => ({
          ...prev,
          breeds: data,
          isLoading: false
        }))
      } else {
        throw new Error('Failed to fetch breeds')
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: '获取犬种信息失败，请稍后重试',
        isLoading: false
      }))
    }
  }

  const getBreedById = async (id: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    try {
      const response = await fetch(`/api/breeds/${id}`)
      if (response.ok) {
        const breed = await response.json()
        return breed
      } else {
        throw new Error('Failed to fetch breed details')
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: '获取犬种详情失败，请稍后重试',
        isLoading: false
      }))
      return null
    }
  }

  const filterBreeds = (
    searchTerm: string = '',
    category: string = '全部',
    selectedPersonalities: string[] = []
  ) => {
    return state.breeds.filter(breed => 
      (breed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       breed.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (category === '全部' || breed.category === category) &&
      (selectedPersonalities.length === 0 || 
       breed.personality.some(p => selectedPersonalities.includes(p)))
    )
  }

  return {
    breeds: state.breeds,
    categories: state.categories,
    personalities: state.personalities,
    isLoading: state.isLoading,
    error: state.error,
    getBreedById,
    filterBreeds,
  }
}