import { useEffect, useState } from 'react'
import { SearchBar } from '../components/home/SearchBar'
import { ImageGrid } from '../components/home/ImageGrid'
import { getAllImages, getUserLikes, searchImages } from '../lib/supabaseQueries'
import { Image } from '../types'
import { useAuth } from '../hooks/useAuth'
import { Loader2, Sparkles } from 'lucide-react'

const DUMMY_IMAGES: Image[] = [
  {
    id: '1',
    user_id: 'dummy',
    storage_url: 'https://images.pexels.com/photos/3764984/pexels-photo-3764984.jpeg?auto=compress&cs=tinysrgb&w=1920',
    image_name: 'Ferrari F8 Tributo',
    description: 'Stunning red Ferrari F8 with sleek aerodynamic design',
    category: 'Sports Car',
    hashtags: ['ferrari', 'supercar', 'luxury'],
    download_count: 234,
    like_count: 89,
    created_at: '2024-10-10T10:00:00Z',
    updated_at: '2024-10-10T10:00:00Z',
    profiles: { username: 'CarEnthusiast' },
  },
  {
    id: '2',
    user_id: 'dummy',
    storage_url: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=1920',
    image_name: 'Range Rover Sport',
    description: 'Luxury SUV in urban setting with modern design',
    category: 'SUV',
    hashtags: ['rangerover', 'luxury', 'suv'],
    download_count: 156,
    like_count: 67,
    created_at: '2024-10-09T14:30:00Z',
    updated_at: '2024-10-09T14:30:00Z',
    profiles: { username: 'LuxuryAuto' },
  },
  {
    id: '3',
    user_id: 'dummy',
    storage_url: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1920',
    image_name: 'Tesla Model S',
    description: 'Electric innovation meets elegant design',
    category: 'Electric',
    hashtags: ['tesla', 'electric', 'future'],
    download_count: 312,
    like_count: 145,
    created_at: '2024-10-08T09:15:00Z',
    updated_at: '2024-10-08T09:15:00Z',
    profiles: { username: 'EVFanatic' },
  },
  {
    id: '4',
    user_id: 'dummy',
    storage_url: 'https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg?auto=compress&cs=tinysrgb&w=1920',
    image_name: 'Porsche 911 GT3',
    description: 'Track-focused precision engineering at its finest',
    category: 'Sports Car',
    hashtags: ['porsche', 'gt3', 'racing'],
    download_count: 289,
    like_count: 134,
    created_at: '2024-10-07T16:45:00Z',
    updated_at: '2024-10-07T16:45:00Z',
    profiles: { username: 'TrackDay' },
  },
  {
    id: '5',
    user_id: 'dummy',
    storage_url: 'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=1920',
    image_name: 'BMW M4 Competition',
    description: 'German engineering with aggressive styling',
    category: 'Coupe',
    hashtags: ['bmw', 'm4', 'performance'],
    download_count: 198,
    like_count: 92,
    created_at: '2024-10-06T11:20:00Z',
    updated_at: '2024-10-06T11:20:00Z',
    profiles: { username: 'BimmerLife' },
  },
  {
    id: '6',
    user_id: 'dummy',
    storage_url: 'https://images.pexels.com/photos/2365572/pexels-photo-2365572.jpeg?auto=compress&cs=tinysrgb&w=1920',
    image_name: 'Mercedes-Benz S-Class',
    description: 'The pinnacle of automotive luxury and comfort',
    category: 'Luxury',
    hashtags: ['mercedes', 'luxury', 'sclass'],
    download_count: 167,
    like_count: 78,
    created_at: '2024-10-05T13:00:00Z',
    updated_at: '2024-10-05T13:00:00Z',
    profiles: { username: 'LuxuryRides' },
  },
  {
    id: '7',
    user_id: 'dummy',
    storage_url: 'https://images.pexels.com/photos/1638459/pexels-photo-1638459.jpeg?auto=compress&cs=tinysrgb&w=1920',
    image_name: 'Ford Mustang Classic',
    description: 'American muscle car icon from the golden era',
    category: 'Classic',
    hashtags: ['mustang', 'classic', 'muscle'],
    download_count: 245,
    like_count: 118,
    created_at: '2024-10-04T08:30:00Z',
    updated_at: '2024-10-04T08:30:00Z',
    profiles: { username: 'ClassicCars' },
  },
  {
    id: '8',
    user_id: 'dummy',
    storage_url: 'https://images.pexels.com/photos/3874337/pexels-photo-3874337.jpeg?auto=compress&cs=tinysrgb&w=1920',
    image_name: 'Lamborghini Aventador',
    description: 'Italian supercar with breathtaking presence',
    category: 'Sports Car',
    hashtags: ['lamborghini', 'supercar', 'exotic'],
    download_count: 421,
    like_count: 187,
    created_at: '2024-10-03T15:45:00Z',
    updated_at: '2024-10-03T15:45:00Z',
    profiles: { username: 'ExoticSpots' },
  },
]

export const Home = () => {
  const { user } = useAuth()
  const [images, setImages] = useState<Image[]>([])
  const [likedImages, setLikedImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadImages()
  }, [user])

  const loadImages = async () => {
    try {
      setLoading(true)
      const data = await getAllImages()
      const allImages = data && data.length > 0 ? data : DUMMY_IMAGES
      setImages(allImages)

      if (user) {
        const likes = await getUserLikes(user.id)
        setLikedImages(likes)
      }
    } catch (error) {
      console.error('Failed to load images:', error)
      setImages(DUMMY_IMAGES)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query: string, category: string) => {
    try {
      setLoading(true)
      const data = await searchImages(query, category)
      setImages(data || [])
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLikeToggle = async () => {
    if (user) {
      const likes = await getUserLikes(user.id)
      setLikedImages(likes)
    }
    await loadImages()
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary-light)] rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">Explore Premium Car Photography</span>
          </div>
          <h1 className="text-display text-[var(--color-text)] mb-4">
            Discover Amazing <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-highlight)]">Cars</span>
          </h1>
          <p className="text-body text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Browse and download stunning car images from our community of automotive enthusiasts
          </p>
        </div>

        <div className="mb-12">
          <SearchBar onSearch={handleSearch} />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[var(--color-accent)] animate-spin mb-4" />
            <p className="text-[var(--color-text-secondary)]">Loading stunning cars...</p>
          </div>
        ) : (
          <ImageGrid images={images} likedImages={likedImages} onLikeToggle={handleLikeToggle} />
        )}
      </div>
    </div>
  )
}
