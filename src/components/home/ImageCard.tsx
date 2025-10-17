import { useState } from 'react'
import { Heart, Download, MoreVertical, Loader2 } from 'lucide-react'
import { Image } from '../../types'
import { useAuth } from '../../hooks/useAuth'
import { toggleLike, incrementDownloadCount } from '../../lib/supabaseQueries'
import { QualitySelector } from '../common/QualitySelector'

interface ImageCardProps {
  image: Image
  isLiked: boolean
  onLikeToggle: () => void
  index: number
}

const CATEGORY_COLORS: Record<string, string> = {
  'Sports Car': 'bg-red-500/20 text-red-400 border-red-500/30',
  'SUV': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Sedan': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Hatchback': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Coupe': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Convertible': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'Classic': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Electric': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'Luxury': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'Off-Road': 'bg-lime-500/20 text-lime-400 border-lime-500/30',
}

export const ImageCard = ({ image, isLiked, onLikeToggle, index }: ImageCardProps) => {
  const { user } = useAuth()
  const [liked, setLiked] = useState(isLiked)
  const [likeCount, setLikeCount] = useState(image.like_count)
  const [showQualitySelector, setShowQualitySelector] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

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
    setIsDownloading(true)
    setShowQualitySelector(true)
  }

  const handleDownload = async () => {
    try {
      await incrementDownloadCount(image.id)
    } catch (error) {
      console.error('Download count error:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const categoryColor = CATEGORY_COLORS[image.category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'

  return (
    <>
      <div
        className="group bg-[var(--color-primary-light)] rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
        style={{
          animationDelay: `${index * 50}ms`,
          animationFillMode: 'both',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `0 20px 25px -5px rgba(255, 107, 53, 0.2), 0 10px 10px -5px rgba(0, 217, 255, 0.15)`
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div className="relative overflow-hidden bg-[var(--color-primary)]">
          <img
            src={image.storage_url}
            alt={image.image_name}
            loading="lazy"
            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute bottom-3 left-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg">
              <Download className="w-3.5 h-3.5 text-[var(--color-text)]" />
              <span className="text-sm font-medium text-[var(--color-text)]">{image.download_count}</span>
            </div>
          </div>

          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1.5 text-xs font-semibold rounded-lg border backdrop-blur-sm ${categoryColor}`}>
              {image.category}
            </span>
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleLike}
              disabled={!user || isLiking}
              className={`p-2.5 rounded-xl backdrop-blur-md transition-all duration-300 ${
                liked
                  ? 'bg-[var(--color-accent)] text-white shadow-lg'
                  : 'bg-black/60 text-[var(--color-text)] hover:bg-black/80'
              } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label={liked ? 'Unlike' : 'Like'}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleDownloadClick}
              disabled={isDownloading}
              className="p-2.5 rounded-xl bg-black/60 text-[var(--color-text)] backdrop-blur-md hover:bg-black/80 transition-all duration-300 disabled:opacity-50"
              aria-label="Download"
            >
              {isDownloading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
            </button>

            <button
              className="p-2.5 rounded-xl bg-black/60 text-[var(--color-text)] backdrop-blur-md hover:bg-black/80 transition-all duration-300"
              aria-label="More options"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-[var(--color-text)] font-semibold text-lg mb-1 truncate">
            {image.image_name}
          </h3>
          {image.description && (
            <p className="text-[var(--color-text-secondary)] text-sm mb-3 line-clamp-2">
              {image.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-[var(--color-primary)]/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-highlight)] flex items-center justify-center text-white text-xs font-bold">
                {(image.profiles?.username || 'U').charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-[var(--color-text-secondary)] font-medium">
                {image.profiles?.username || 'Unknown'}
              </span>
            </div>

            <div className="flex items-center gap-1 text-[var(--color-text-secondary)]">
              <Heart className={`w-4 h-4 ${liked ? 'fill-current text-[var(--color-accent)]' : ''}`} />
              <span className="text-sm font-medium">{likeCount}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 text-xs text-[var(--color-text-secondary)]">
            <span>{new Date(image.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            {image.hashtags && image.hashtags.length > 0 && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {image.hashtags.slice(0, 2).map((tag, idx) => (
                    <span key={idx} className="text-[var(--color-text-secondary)]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {showQualitySelector && (
        <QualitySelector
          imageUrl={image.storage_url}
          imageName={image.image_name}
          onClose={() => {
            setShowQualitySelector(false)
            setIsDownloading(false)
          }}
          onDownload={handleDownload}
        />
      )}
    </>
  )
}
