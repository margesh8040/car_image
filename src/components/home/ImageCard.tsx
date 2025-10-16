import { useState } from 'react'
import { Heart, Download, User } from 'lucide-react'
import { Image } from '../../types'
import { useAuth } from '../../hooks/useAuth'
import { toggleLike, incrementDownloadCount } from '../../lib/supabaseQueries'
import { QualitySelector } from '../common/QualitySelector'

interface ImageCardProps {
  image: Image
  isLiked: boolean
  onLikeToggle: () => void
}

export const ImageCard = ({ image, isLiked, onLikeToggle }: ImageCardProps) => {
  const { user } = useAuth()
  const [liked, setLiked] = useState(isLiked)
  const [likeCount, setLikeCount] = useState(image.like_count)
  const [showQualitySelector, setShowQualitySelector] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  const handleLike = async () => {
    if (!user) return
    if (isLiking) return

    setIsLiking(true)
    const previousLiked = liked
    const previousCount = likeCount

    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)

    try {
      await toggleLike(user.id, image.id)
      onLikeToggle()
    } catch (error) {
      setLiked(previousLiked)
      setLikeCount(previousCount)
      console.error('Like error:', error)
    } finally {
      setIsLiking(false)
    }
  }

  const handleDownloadClick = () => {
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
      <div className="group bg-[#1a1a1a] border border-gray-800 rounded-2xl overflow-hidden hover:scale-[1.03] hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300">
        <div className="relative aspect-video overflow-hidden bg-gray-900">
          <img
            src={image.storage_url}
            alt={image.image_name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-lg truncate">{image.image_name}</h3>
              {image.description && (
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">{image.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-medium rounded-full">
              {image.category}
            </span>
            {image.hashtags && image.hashtags.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap">
                {image.hashtags.slice(0, 2).map((tag, idx) => (
                  <span key={idx} className="text-gray-500 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-800">
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{image.profiles?.username || 'Unknown'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                disabled={!user || isLiking}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                  liked
                    ? 'bg-pink-500/20 text-pink-400'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                <span className="text-sm font-medium">{likeCount}</span>
              </button>

              <button
                onClick={handleDownloadClick}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">{image.download_count}</span>
              </button>
            </div>
          </div>
        </div>
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
