import { useEffect, useState } from 'react'
import { SearchBar } from '../components/home/SearchBar'
import { ImageGrid } from '../components/home/ImageGrid'
import { getAllImages, getUserLikes, searchImages } from '../lib/supabaseQueries'
import { Image } from '../types'
import { useAuth } from '../hooks/useAuth'
import { Loader2 } from 'lucide-react'

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
      setImages(data || [])

      if (user) {
        const likes = await getUserLikes(user.id)
        setLikedImages(likes)
      }
    } catch (error) {
      console.error('Failed to load images:', error)
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
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Discover Amazing Cars</h1>
          <p className="text-gray-400">Browse and download high-quality car images from our community</p>
        </div>

        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          </div>
        ) : (
          <ImageGrid images={images} likedImages={likedImages} onLikeToggle={handleLikeToggle} />
        )}
      </div>
    </div>
  )
}
