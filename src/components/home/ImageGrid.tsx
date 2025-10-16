import { Image } from '../../types'
import { ImageCard } from './ImageCard'

interface ImageGridProps {
  images: Image[]
  likedImages: string[]
  onLikeToggle: () => void
}

export const ImageGrid = ({ images, likedImages, onLikeToggle }: ImageGridProps) => {
  if (images.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-lg">No images found. Try adjusting your search.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          isLiked={likedImages.includes(image.id)}
          onLikeToggle={onLikeToggle}
        />
      ))}
    </div>
  )
}
