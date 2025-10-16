import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          email: string
        }
        Update: {
          username?: string
        }
      }
      images: {
        Row: {
          id: string
          user_id: string
          storage_url: string
          image_name: string
          description: string | null
          category: string
          hashtags: string[]
          download_count: number
          like_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          storage_url: string
          image_name: string
          description?: string
          category: string
          hashtags?: string[]
        }
        Update: {
          image_name?: string
          description?: string
          category?: string
          hashtags?: string[]
          download_count?: number
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string
          image_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          image_id: string
        }
      }
    }
  }
}
