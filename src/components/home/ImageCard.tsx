import { useState, useEffect } from 'react'
import { Heart, Download, User } from 'lucide-react'
import { toggleLike, incrementDownloadCount } from '../../lib/supabaseQueries'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { QualitySelector } from '../common/QualitySelector'

interface ImageCardProps {
  image: {
    id: string
    storage_url: string
    image_name: string
    description: string | null
    category: string
    download_count: number
    like_count: number
    isLikedByUser: boolean
    created_at: string
    hashtags?: string[]
    profiles?: {
      username: string
    }
  }
  onLikeUpdate?: () => void
}

export const ImageCard = ({ image, onLikeUpdate }: ImageCardProps) => {
  const { user } = useAuth()
  const { showToast } = useToast()

  const [isLiked, setIsLiked] = useState(image.isLikedByUser)
  const [likeCount, setLikeCount] = useState(image.like_count)
  const [isLiking, setIsLiking] = useState(false)
  const [showQualitySelector, setShowQualitySelector] = useState(false)

  useEffect(() => {
    setIsLiked(image.isLikedByUser)
    setLikeCount(image.like_count)
  }, [image.isLikedByUser, image.like_count])

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!user) {
      showToast('Please sign in to like images', 'info')
      return
    }

    if (isLiking) return

    const previousLiked = isLiked
    const previousCount = likeCount

    setIsLiked(!isLiked)
    setLikeCount(prev => (isLiked ? prev - 1 : prev + 1))
    setIsLiking(true)

    try {
      const result = await toggleLike(user.id, image.id)

      setIsLiked(result.isLiked)
      setLikeCount(result.newCount)

      showToast(result.isLiked ? 'Liked!' : 'Removed like', 'success')

      if (onLikeUpdate) {
        onLikeUpdate()
      }
    } catch (error) {
      setIsLiked(previousLiked)
      setLikeCount(previousCount)
      showToast('Failed to update like. Please try again.', 'error')
      console.error('Like error:', error)
    } finally {
      setIsLiking(false)
    }
  }

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowQualitySelector(true)
  }

  const handleDownload = async () => {
    try {
      await incrementDownloadCount(image.id)
    } catch (error) {
      console.error('Download count error:', error)
    }
  }

  return (
    <>
      <div className="group relative bg-[#1a1a1a] rounded-2xl overflow-hidden border border-gray-800 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:scale-[1.02]">
        <div className="relative aspect-video overflow-hidden bg-gray-900">
          <img
            src={image.storage_url}
            alt={image.image_name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />

          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-indigo-600/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
              {image.category}
            </span>
          </div>

          {image.description && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white text-sm line-clamp-2">{image.description}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="mb-3">
            <h3 className="font-semibold text-white text-lg mb-1 line-clamp-1 group-hover:text-indigo-400 transition-colors">
              {image.image_name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <User className="w-4 h-4" />
              <span>
                by <span className="text-indigo-400">{image.profiles?.username || 'Unknown'}</span>
              </span>
            </div>
          </div>

          {image.hashtags && image.hashtags.length > 0 && (
            <div className="flex items-center gap-1.5 mb-3 flex-wrap">
              {image.hashtags.slice(0, 3).map((tag, idx) => (
                <span key={idx} className="text-xs text-gray-500">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-gray-800">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                {image.download_count}
              </span>
              <span className="flex items-center gap-1">
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-pink-500 text-pink-500' : ''}`} />
                {likeCount}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                disabled={isLiking}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isLiked
                    ? 'bg-pink-500 text-white hover:bg-pink-600 scale-110'
                    : 'bg-gray-800 text-gray-400 hover:bg-pink-500 hover:text-white hover:scale-110'
                } disabled:opacity-50 disabled:cursor-not-allowed active:scale-95`}
                title={isLiked ? 'Unlike' : 'Like'}
              >
                <Heart className={`w-4 h-4 transition-all ${isLiked ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={handleDownloadClick}
                className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 hover:scale-110 active:scale-95"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {isLiking && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-pink-500/10 animate-pulse" />
          </div>
        )}
      </div>

      {showQualitySelector && (
        <QualitySelector
          imageUrl={image.storage_url}
          imageName={image.image_name}
          onClose={() => setShowQualitySelector(false)}
          onDownload={handleDownload}
        />
      )}
    </>
  )
}
