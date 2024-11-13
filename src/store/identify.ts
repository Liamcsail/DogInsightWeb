import { create } from "zustand";

interface BreedResult {
  name: string;
  percentage: number;
}

interface IdentifyRecord {
  id: string;
  image: string;
  breeds: BreedResult[];
  description: string;
  characteristics: string[];
  createdAt: string;
}

interface IdentifyState {
  records: IdentifyRecord[];
  currentRecord: IdentifyRecord | null;
  isLoading: boolean;
  error: string | null;
  // 添加新记录
  addRecord: (record: IdentifyRecord) => void;
  // 设置当前查看的记录
  setCurrentRecord: (record: IdentifyRecord | null) => void;
  // 加载历史记录
  loadRecords: (records: IdentifyRecord[]) => void;
  // 设置加载状态
  setLoading: (isLoading: boolean) => void;
  // 设置错误信息
  setError: (error: string | null) => void;
}

export const useIdentifyStore = create<IdentifyState>((set) => ({
  records: [],
  currentRecord: null,
  isLoading: false,
  error: null,

  addRecord: (record) =>
    set((state) => ({
      records: [record, ...state.records],
      currentRecord: record,
      error: null,
    })),

  setCurrentRecord: (record) => set({ currentRecord: record }),

  loadRecords: (records) =>
    set({
      records,
      isLoading: false,
      error: null,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}));
