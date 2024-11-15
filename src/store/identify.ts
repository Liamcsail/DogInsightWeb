import { create } from "zustand";
import { storage } from "../lib/storage";
import { supabase } from "../lib/supabase";

interface BreedResult {
  name: string;
  percentage: number;
  confidence: number;
}

interface IdentifyRecord {
  id: string;
  image: string;
  breeds: BreedResult[];
  description: string;
  characteristics: string[];
  createdAt: string;
  isPublic: boolean;
  userId: string;
  postId?: string;
}

interface IdentifyState {
  records: IdentifyRecord[];
  currentRecord: IdentifyRecord | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    breed?: string;
    startDate?: string;
    endDate?: string;
    isPublic?: boolean;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };

  // Actions
  addRecord: (record: IdentifyRecord) => Promise<void>;
  setCurrentRecord: (record: IdentifyRecord | null) => void;
  loadRecords: (params?: { page?: number; breed?: string }) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  updateRecord: (id: string, updates: Partial<IdentifyRecord>) => Promise<void>;
  setFilters: (filters: Partial<IdentifyState["filters"]>) => void;
  togglePublic: (id: string) => Promise<void>;
  shareRecord: (id: string) => Promise<void>;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export const useIdentifyStore = create<IdentifyState>((set, get) => ({
  records: [],
  currentRecord: null,
  isLoading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },

  addRecord: async (record) => {
    try {
      set({ isLoading: true, error: null });

      // Save to Supabase
      const { data, error } = await supabase
        .from("identify_records")
        .insert(record)
        .single();

      if (error) throw error;

      // Update local state
      set((state) => ({
        records: [data, ...state.records],
        currentRecord: data,
        isLoading: false,
      }));

      // Save to local storage
      storage.history.add(data);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "添加记录失败",
        isLoading: false,
      });
    }
  },

  setCurrentRecord: (record) => set({ currentRecord: record }),

  loadRecords: async (params) => {
    try {
      set({ isLoading: true, error: null });

      const { page = 1, breed } = params || {};
      const { limit } = get().pagination;
      const filters = get().filters;

      let query = supabase
        .from("identify_records")
        .select("*", { count: "exact" });

      // Apply filters
      if (breed) query = query.ilike("breeds:name", `%${breed}%`);
      if (filters.startDate) query = query.gte("created_at", filters.startDate);
      if (filters.endDate) query = query.lte("created_at", filters.endDate);
      if (filters.isPublic !== undefined)
        query = query.eq("is_public", filters.isPublic);

      const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (error) throw error;

      set({
        records: data,
        pagination: { ...get().pagination, page, total: count || 0 },
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "加载记录失败",
        isLoading: false,
      });
    }
  },

  deleteRecord: async (id) => {
    try {
      set({ isLoading: true, error: null });

      const { error } = await supabase
        .from("identify_records")
        .delete()
        .eq("id", id);

      if (error) throw error;

      set((state) => ({
        records: state.records.filter((r) => r.id !== id),
        currentRecord:
          state.currentRecord?.id === id ? null : state.currentRecord,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "删除记录失败",
        isLoading: false,
      });
    }
  },

  updateRecord: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase
        .from("identify_records")
        .update(updates)
        .eq("id", id)
        .single();

      if (error) throw error;

      set((state) => ({
        records: state.records.map((r) =>
          r.id === id ? { ...r, ...updates } : r,
        ),
        currentRecord:
          state.currentRecord?.id === id
            ? { ...state.currentRecord, ...updates }
            : state.currentRecord,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "更新记录失败",
        isLoading: false,
      });
    }
  },

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  togglePublic: async (id) => {
    const record = get().records.find((r) => r.id === id);
    if (record) {
      await get().updateRecord(id, { isPublic: !record.isPublic });
    }
  },

  shareRecord: async (id) => {
    const record = get().records.find((r) => r.id === id);
    if (record) {
      // Implement sharing logic (e.g., generate sharing link)
      // This is a placeholder for the actual implementation
      console.log(`Sharing record ${id}`);
    }
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  reset: () =>
    set({
      records: [],
      currentRecord: null,
      isLoading: false,
      error: null,
      filters: {},
      pagination: { page: 1, limit: 10, total: 0 },
    }),
}));
