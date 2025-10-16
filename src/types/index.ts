export interface Profile {
  id: string
  username: string
  email: string
  created_at: string
  updated_at: string
}

export interface Image {
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
  profiles?: {
    username: string
  }
}

export interface Like {
  id: string
  user_id: string
  image_id: string
  created_at: string
}

export type CarCategory =
  | 'Sports Car'
  | 'SUV'
  | 'Sedan'
  | 'Hatchback'
  | 'Coupe'
  | 'Convertible'
  | 'Classic'
  | 'Electric'
  | 'Luxury'
  | 'Off-Road'

export type DownloadQuality =
  | 'original'
  | 'high'
  | 'medium'
  | 'low'

export const CAR_CATEGORIES: CarCategory[] = [
  'Sports Car',
  'SUV',
  'Sedan',
  'Hatchback',
  'Coupe',
  'Convertible',
  'Classic',
  'Electric',
  'Luxury',
  'Off-Road',
]

export const DOWNLOAD_QUALITIES: { value: DownloadQuality; label: string; dimensions: string }[] = [
  { value: 'original', label: 'Original', dimensions: 'Full Quality' },
  { value: 'high', label: 'High', dimensions: '1920x1080' },
  { value: 'medium', label: 'Medium', dimensions: '1280x720' },
  { value: 'low', label: 'Low', dimensions: '640x480' },
]
