// 存储键名常量
const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  THEME: "theme",
  HISTORY: "identify_history",
} as const;

// 本地存储工具类
export const storage = {
  // 获取存储的值
  get<T>(key: keyof typeof STORAGE_KEYS): T | null {
    try {
      const item = localStorage.getItem(STORAGE_KEYS[key]);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  // 设置存储的值
  set(key: keyof typeof STORAGE_KEYS, value: any): void {
    try {
      localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  },

  // 移除存储的值
  remove(key: keyof typeof STORAGE_KEYS): void {
    localStorage.removeItem(STORAGE_KEYS[key]);
  },

  // 清除所有存储
  clear(): void {
    localStorage.clear();
  },

  // 专门用于处理认证令牌的方法
  token: {
    get(): string | null {
      return storage.get("TOKEN");
    },
    set(token: string): void {
      storage.set("TOKEN", token);
    },
    remove(): void {
      storage.remove("TOKEN");
    },
  },

  // 处理用户信息的方法
  user: {
    get(): any | null {
      return storage.get("USER");
    },
    set(user: any): void {
      storage.set("USER", user);
    },
    remove(): void {
      storage.remove("USER");
    },
  },

  // 处理识别历史记录的方法
  history: {
    get(): any[] {
      return storage.get("HISTORY") || [];
    },
    add(record: any): void {
      const history = storage.history.get();
      history.unshift(record);
      storage.set("HISTORY", history.slice(0, 50)); // 只保留最近50条记录
    },
    clear(): void {
      storage.remove("HISTORY");
    },
  },
};
