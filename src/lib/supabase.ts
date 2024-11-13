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
  created_at: string;
}

export interface IdentifyRecord {
  id: string;
  user_id: string;
  image_url: string;
  results: {
    breed: string;
    percentage: number;
  }[];
  description: string | null;
  created_at: string;
}

export interface Breed {
  id: string;
  name: string;
  description: string;
  category: string;
  personality: string[];
  care_needs: string;
  health_issues: string;
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
  identify_record_id: string;
  description: string;
  breed_tags: string[];
  topic_tags: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
}
