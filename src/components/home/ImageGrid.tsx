import { useEffect, useState } from 'react'
import { Image } from '../../types'
import { ImageCard } from './ImageCard'
import { Car } from 'lucide-react'

interface ImageGridProps {
  images: Image[]
  likedImages: string[]
  onLikeToggle: () => void
}

export const ImageGrid = ({ images, likedImages, onLikeToggle }: ImageGridProps) => {
  const [columns, setColumns] = useState(4)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) {
        setColumns(1)
      } else if (width < 1024) {
        setColumns(2)
      } else if (width < 1280) {
        setColumns(3)
      } else {
        setColumns(4)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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

  const distributeImages = () => {
    const cols: Image[][] = Array.from({ length: columns }, () => [])

    images.forEach((image, index) => {
      const columnIndex = index % columns
      cols[columnIndex].push(image)
    })

    return cols
  }

  const columnData = distributeImages()

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex gap-6">
        {columnData.map((columnImages, columnIndex) => (
          <div key={columnIndex} className="flex-1 flex flex-col gap-6">
            {columnImages.map((image, imageIndex) => (
              <ImageCard
                key={image.id}
                image={image}
                isLiked={likedImages.includes(image.id)}
                onLikeToggle={onLikeToggle}
                index={columnIndex * Math.ceil(images.length / columns) + imageIndex}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
