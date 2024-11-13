import { create } from 'zustand'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  // 设置用户信息
  setUser: (user: User | null) => void
  // 设置加载状态
  setLoading: (isLoading: boolean) => void
  // 设置错误信息
  setError: (error: string | null) => void
  // 登出时清除状态
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user, error: null }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearAuth: () => set({ 
    user: null, 
    isLoading: false, 
    error: null 
  })
}))