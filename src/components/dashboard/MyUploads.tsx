import { useState, useEffect } from 'react'
import { Trash2, Download, Heart } from 'lucide-react'
import { Image } from '../../types'
import { deleteImage } from '../../lib/supabaseQueries'

interface MyUploadsProps {
  images: Image[]
  onDelete: () => void
}

export const MyUploads = ({ images, onDelete }: MyUploadsProps) => {
  const [deleting, setDeleting] = useState<string | null>(null)
  const [columns, setColumns] = useState(2)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 768) {
        setColumns(1)
      } else {
        setColumns(2)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleDelete = async (imageId: string, storageUrl: string) => {
    if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      return
    }

    setDeleting(imageId)

    try {
      await deleteImage(imageId, storageUrl)
      onDelete()
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete image. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  if (images.length === 0) {
    return (
      <div className="bg-[#1A212B] rounded-2xl p-12">
        <div className="text-center">
          <p className="text-gray-400 text-lg">You haven't uploaded any images yet.</p>
          <p className="text-gray-500 text-sm mt-2">Upload your first car image to get started!</p>
        </div>
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
    <div className="bg-[#1A212B] rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">My Uploads</h2>

      <div className="flex gap-6">
        {columnData.map((columnImages, columnIndex) => (
          <div key={columnIndex} className="flex-1 flex flex-col gap-6">
            {columnImages.map((image) => (
              <div
                key={image.id}
                className="group bg-[#0F1419] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="relative overflow-hidden bg-gray-900">
                  <img
                    src={image.storage_url}
                    alt={image.image_name}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-white font-semibold truncate mb-1">{image.image_name}</h3>
                  {image.description && (
                    <p className="text-gray-400 text-sm line-clamp-2 mb-3">{image.description}</p>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-[#FF6B35]/20 text-[#FF6B35] text-xs font-medium rounded">
                      {image.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span>{image.like_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4 text-[#00D9FF]" />
                        <span>{image.download_count}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(image.id, image.storage_url)}
                      disabled={deleting === image.id}
                      className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
