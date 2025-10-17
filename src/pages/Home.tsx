import { useEffect, useState } from 'react'
import { SearchBar } from '../components/home/SearchBar'
import { getImagesWithLikeStatus } from '../lib/supabaseQueries'
import { useAuth } from '../hooks/useAuth'
import { ImageCard } from '../components/home/ImageCard'
import { LoadingSpinner } from '../components/common/LoadingSpinner'

export const Home = () => {
  const { user } = useAuth()
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadImages = async () => {
    setLoading(true)
    try {
      const results = await getImagesWithLikeStatus(user?.id ?? null)
      setImages(results)
    } catch (error) {
      console.error('Error loading images:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadImages()
  }, [user])

  const handleSearch = async (query: string, category: string) => {
    setLoading(true)
    try {
      const results = await getImagesWithLikeStatus(user?.id ?? null)

      let filtered = results

      if (query) {
        filtered = filtered.filter(
          (img: any) =>
            img.image_name.toLowerCase().includes(query.toLowerCase()) ||
            img.description?.toLowerCase().includes(query.toLowerCase())
        )
      }

      if (category && category !== 'all') {
        filtered = filtered.filter((img: any) => img.category === category)
      }

      setImages(filtered)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Discover Amazing Cars</h1>
          <p className="text-gray-400">
            Browse and download high-quality car images from our community
          </p>
        </div>

        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="large" />
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No images yet. Be the first to upload!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <ImageCard key={image.id} image={image} onLikeUpdate={loadImages} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
