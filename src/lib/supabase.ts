import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// 类型定义
export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  settings: {
    email_notifications: boolean;
    theme: "light" | "dark" | "system";
  };
}

export interface IdentifyRecord {
  id: string;
  user_id: string;
  image_url: string;
  results: Array<{
    breed: string;
    percentage: number;
    confidence: number;
  }>;
  description: string | null;
  created_at: string;
  is_public: boolean;
  post_id?: string;
}

export interface Breed {
  id: string;
  name: string;
  description: string;
  category: string;
  personality: string[];
  care_needs: string;
  health_issues: string[];
  history: string;
  stats: {
    friendliness: number;
    energy_level: number;
    trainability: number;
    grooming_needs: number;
    adaptability: number;
  };
  fun_facts: string[];
  image_url: string;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  identify_record_id: string | null;
  description: string;
  breed_tags: string[];
  topic_tags: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
  media: Array<{
    url: string;
    type: "image" | "video";
  }>;
  status: "published" | "draft" | "archived";
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  likes_count: number;
  is_edited: boolean;
}

// Storage 工具函数
export const storageHelpers = {
  async uploadImage(file: File, bucket: string): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(fileName);

    return publicUrl;
  },

  async deleteImage(bucket: string, path: string) {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) throw error;
  },
};
