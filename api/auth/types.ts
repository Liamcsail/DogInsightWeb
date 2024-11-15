// /app/api/auth/types.ts

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  name?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  message?: string;
  user?: UserProfile;
  session?: any; // Supabase session type
}
