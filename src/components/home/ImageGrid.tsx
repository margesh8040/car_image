import { Image } from '../../types'
import { ImageCard } from './ImageCard'
import { Car } from 'lucide-react'

interface ImageGridProps {
  images: Image[]
  likedImages: string[]
  onLikeToggle: () => void
}

export const ImageGrid = ({ images, likedImages, onLikeToggle }: ImageGridProps) => {
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center mb-4">
          <Car className="w-10 h-10 text-[var(--color-text-secondary)]" />
        </div>
        <p className="text-[var(--color-text)] text-lg font-medium mb-2">No cars found</p>
        <p className="text-[var(--color-text-secondary)] text-sm">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image, index) => (
          <ImageCard
            key={image.id}
            image={image}
            isLiked={likedImages.includes(image.id)}
            onLikeToggle={onLikeToggle}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}
