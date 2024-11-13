import { create } from 'zustand'

interface Breed {
  id: number
  name: string
  image: string
  description: string
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
  currentBreed: Breed | null
  categories: string[]
  personalities: string[]
  isLoading: boolean
  error: string | null
  // 加载犬种列表
  loadBreeds: (breeds: Breed[]) => void
  // 设置当前查看的犬种
  setCurrentBreed: (breed: Breed | null) => void
  // 按条件筛选犬种
  filterBreeds: (searchTerm: string, category: string, personalities: string[]) => Breed[]
  // 设置加载状态
  setLoading: (isLoading: boolean) => void
  // 设置错误信息
  setError: (error: string | null) => void
}

export const useBreedsStore = create<BreedsState>((set, get) => ({
  breeds: [],
  currentBreed: null,
  categories: ['全部', '小型犬', '中型犬', '大型犬'],
  personalities: ['友善', '聪明', '活泼', '温顺', '忠诚'],
  isLoading: false,
  error: null,

  loadBreeds: (breeds) => set({ 
    breeds, 
    isLoading: false, 
    error: null 
  }),

  setCurrentBreed: (breed) => set({ currentBreed: breed }),

  filterBreeds: (searchTerm, category, personalities) => {
    const { breeds } = get()
    return breeds.filter(breed => 
      (breed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       breed.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (category === '全部' || breed.category === category) &&
      (personalities.length === 0 || 
       breed.personality.some(p => personalities.includes(p)))
    )
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error })
}))