import { User, IdentifyRecord } from "./supabase";

// Storage keys
const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  THEME: "theme",
  HISTORY: "identify_history",
  SETTINGS: "user_settings",
  DRAFT_POSTS: "draft_posts",
} as const;

type ThemeType = "light" | "dark" | "system";
type StorageKey = keyof typeof STORAGE_KEYS;

interface UserSettings {
  theme: ThemeType;
  notifications: boolean;
  language: string;
}

interface DraftPost {
  id: string;
  content: string;
  images: string[];
  lastModified: string;
}

export const storage = {
  get<T>(key: StorageKey): T | null {
    try {
      const item = localStorage.getItem(STORAGE_KEYS[key]);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set(key: StorageKey, value: any): void {
    try {
      localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  },

  remove(key: StorageKey): void {
    localStorage.removeItem(STORAGE_KEYS[key]);
  },

  clear(): void {
    localStorage.clear();
  },

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

  user: {
    get(): User | null {
      return storage.get("USER");
    },
    set(user: User): void {
      storage.set("USER", user);
    },
    remove(): void {
      storage.remove("USER");
    },
    update(updates: Partial<User>): void {
      const user = storage.user.get();
      if (user) {
        storage.user.set({ ...user, ...updates });
      }
    },
  },

  history: {
    get(): IdentifyRecord[] {
      return storage.get("HISTORY") || [];
    },
    add(record: IdentifyRecord): void {
      const history = storage.history.get();
      history.unshift(record);
      storage.set("HISTORY", history.slice(0, 50));
    },
    remove(id: string): void {
      const history = storage.history.get();
      storage.set(
        "HISTORY",
        history.filter((record) => record.id !== id),
      );
    },
    clear(): void {
      storage.remove("HISTORY");
    },
  },

  settings: {
    get(): UserSettings {
      return (
        storage.get("SETTINGS") || {
          theme: "system",
          notifications: true,
          language: "zh-CN",
        }
      );
    },
    set(settings: UserSettings): void {
      storage.set("SETTINGS", settings);
    },
    update(updates: Partial<UserSettings>): void {
      const current = storage.settings.get();
      storage.settings.set({ ...current, ...updates });
    },
  },

  drafts: {
    get(): DraftPost[] {
      return storage.get("DRAFT_POSTS") || [];
    },
    add(draft: Omit<DraftPost, "id">): string {
      const drafts = storage.drafts.get();
      const id = crypto.randomUUID();
      const newDraft = { ...draft, id };
      drafts.unshift(newDraft);
      storage.set("DRAFT_POSTS", drafts);
      return id;
    },
    update(id: string, updates: Partial<DraftPost>): void {
      const drafts = storage.drafts.get();
      const index = drafts.findIndex((d) => d.id === id);
      if (index !== -1) {
        drafts[index] = { ...drafts[index], ...updates };
        storage.set("DRAFT_POSTS", drafts);
      }
    },
    remove(id: string): void {
      const drafts = storage.drafts.get();
      storage.set(
        "DRAFT_POSTS",
        drafts.filter((d) => d.id !== id),
      );
    },
  },
};
