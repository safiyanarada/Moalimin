// Types d'authentification
export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  phone?: string;
  date_of_birth?: string;
  level?: string;
  specialization?: string;
  bio?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Types de cours
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor_id: string;
  category: CourseCategory;
  level: string;
  duration_minutes: number;
  max_students: number;
  price: number;
  is_active: boolean;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export type CourseCategory = 
  | 'quran'
  | 'hadith'
  | 'fiqh'
  | 'aqida'
  | 'arabic'
  | 'islamic_history'
  | 'tajwid';

// Types de sessions
export interface Session {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  scheduled_at: string;
  duration_minutes: number;
  meeting_url?: string;
  is_live: boolean;
  created_at: string;
  updated_at: string;
}

// Types d'authentification
export interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
}

// Types de progression
export interface Progress {
  id: string;
  user_id: string;
  course_id: string;
  completion_percentage: number;
  last_accessed_at: string;
  created_at: string;
  updated_at: string;
}

// Types de notification
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
} 