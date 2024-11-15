import { create } from "zustand";
import { supabase } from "../lib/supabase";

interface Breed {
  id: number;
  name: string;
  image: string;
  description: string;
  category: string;
  personality: string[];
  stats: {
    friendliness: number;
    energyLevel: number;
    trainability: number;
    groomingNeeds: number;
    adaptability: number;
  };
  careNeeds: string;
  healthIssues: string[];
  history: string;
  funFacts: string[];
  popularity: number;
  lifeExpectancy: string;
}

interface FilterOptions {
  searchTerm: string;
  category: string;
  personalities: string[];
  sortBy?: "name" | "popularity";
  sortOrder?: "asc" | "desc";
}

interface BreedsState {
  breeds: Breed[];
  currentBreed: Breed | null;
  categories: string[];
  personalities: string[];
  isLoading: boolean;
  error: string | null;
  filters: FilterOptions;
  favorites: number[];

  // Actions
  loadBreeds: () => Promise<void>;
  loadBreedById: (id: number) => Promise<void>;
  setCurrentBreed: (breed: Breed | null) => void;
  filterBreeds: (options: Partial<FilterOptions>) => Breed[];
  toggleFavorite: (breedId: number) => void;
  searchBreeds: (query: string) => Promise<void>;
  updateBreedStats: (
    id: number,
    stats: Partial<Breed["stats"]>,
  ) => Promise<void>;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearFilters: () => void;
}

export const useBreedsStore = create<BreedsState>((set, get) => ({
  breeds: [],
  currentBreed: null,
  categories: ["全部", "小型犬", "中型犬", "大型犬"],
  personalities: [
    "友善",
    "聪明",
    "活泼",
    "温顺",
    "忠诚",
    "警惕",
    "独立",
    "护家",
  ],
  isLoading: false,
  error: null,
  filters: {
    searchTerm: "",
    category: "全部",
    personalities: [],
    sortBy: "name",
    sortOrder: "asc",
  },
  favorites: [],

  loadBreeds: async () => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase
        .from("breeds")
        .select("*")
        .order("name");

      if (error) throw error;

      set({
        breeds: data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "加载犬种数据失败",
        isLoading: false,
      });
    }
  },

  loadBreedById: async (id) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase
        .from("breeds")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      set({
        currentBreed: data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "加载犬种详情失败",
        isLoading: false,
      });
    }
  },

  setCurrentBreed: (breed) => set({ currentBreed: breed }),

  filterBreeds: (options) => {
    const state = get();
    const currentFilters = { ...state.filters, ...options };
    set({ filters: currentFilters });

    let filtered = [...state.breeds];

    // 搜索词过滤
    if (currentFilters.searchTerm) {
      const term = currentFilters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (breed) =>
          breed.name.toLowerCase().includes(term) ||
          breed.description.toLowerCase().includes(term),
      );
    }

    // 类别过滤
    if (currentFilters.category !== "全部") {
      filtered = filtered.filter(
        (breed) => breed.category === currentFilters.category,
      );
    }

    // 性格特征过滤
    if (currentFilters.personalities.length > 0) {
      filtered = filtered.filter((breed) =>
        breed.personality.some((p) => currentFilters.personalities.includes(p)),
      );
    }

    // 排序
    if (currentFilters.sortBy) {
      filtered.sort((a, b) => {
        const aValue = currentFilters.sortBy === "name" ? a.name : a.popularity;
        const bValue = currentFilters.sortBy === "name" ? b.name : b.popularity;
        const modifier = currentFilters.sortOrder === "desc" ? -1 : 1;
        return (aValue > bValue ? 1 : -1) * modifier;
      });
    }

    return filtered;
  },

  toggleFavorite: (breedId) => {
    set((state) => ({
      favorites: state.favorites.includes(breedId)
        ? state.favorites.filter((id) => id !== breedId)
        : [...state.favorites, breedId],
    }));
  },

  searchBreeds: async (query) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase
        .from("breeds")
        .select("*")
        .ilike("name", `%${query}%`)
        .order("name");

      if (error) throw error;

      set({
        breeds: data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "搜索失败",
        isLoading: false,
      });
    }
  },

  updateBreedStats: async (id, stats) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase
        .from("breeds")
        .update({ stats })
        .eq("id", id)
        .single();

      if (error) throw error;

      set((state) => ({
        breeds: state.breeds.map((breed) =>
          breed.id === id
            ? { ...breed, stats: { ...breed.stats, ...stats } }
            : breed,
        ),
        currentBreed:
          state.currentBreed?.id === id
            ? {
                ...state.currentBreed,
                stats: { ...state.currentBreed.stats, ...stats },
              }
            : state.currentBreed,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "更新失败",
        isLoading: false,
      });
    }
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearFilters: () =>
    set({
      filters: {
        searchTerm: "",
        category: "全部",
        personalities: [],
        sortBy: "name",
        sortOrder: "asc",
      },
    }),
}));
