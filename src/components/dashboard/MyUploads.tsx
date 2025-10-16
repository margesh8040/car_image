import { useState } from 'react'
import { Trash2, Download, Heart } from 'lucide-react'
import { Image } from '../../types'
import { deleteImage } from '../../lib/supabaseQueries'

interface MyUploadsProps {
  images: Image[]
  onDelete: () => void
}

export const MyUploads = ({ images, onDelete }: MyUploadsProps) => {
  const [deleting, setDeleting] = useState<string | null>(null)

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
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-12">
        <div className="text-center">
          <p className="text-gray-400 text-lg">You haven't uploaded any images yet.</p>
          <p className="text-gray-500 text-sm mt-2">Upload your first car image to get started!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">My Uploads</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div
            key={image.id}
            className="group bg-[#0a0a0a] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors"
          >
            <div className="relative aspect-video overflow-hidden bg-gray-900">
              <img
                src={image.storage_url}
                alt={image.image_name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4">
              <h3 className="text-white font-semibold truncate mb-1">{image.image_name}</h3>
              {image.description && (
                <p className="text-gray-400 text-sm line-clamp-2 mb-3">{image.description}</p>
              )}

              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-medium rounded">
                  {image.category}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{image.like_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
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
    </div>
  )
}
