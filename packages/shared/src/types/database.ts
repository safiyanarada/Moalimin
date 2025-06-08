export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          first_name: string
          last_name: string
          avatar_url: string | null
          phone: string | null
          date_of_birth: string | null
          level: string | null
          specialization: string | null
          bio: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          first_name: string
          last_name: string
          avatar_url?: string | null
          phone?: string | null
          date_of_birth?: string | null
          level?: string | null
          specialization?: string | null
          bio?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          first_name?: string
          last_name?: string
          avatar_url?: string | null
          phone?: string | null
          date_of_birth?: string | null
          level?: string | null
          specialization?: string | null
          bio?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string
          instructor_id: string
          category: string
          level: string
          duration_minutes: number
          max_students: number
          price: number
          is_active: boolean
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          instructor_id: string
          category: string
          level: string
          duration_minutes: number
          max_students: number
          price: number
          is_active?: boolean
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          instructor_id?: string
          category?: string
          level?: string
          duration_minutes?: number
          max_students?: number
          price?: number
          is_active?: boolean
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'student' | 'teacher' | 'admin'
    }
  }
} 