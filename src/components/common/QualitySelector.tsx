import { useState } from 'react'
import { Download, X } from 'lucide-react'
import { DOWNLOAD_QUALITIES, DownloadQuality } from '../../types'

interface QualitySelectorProps {
  imageUrl: string
  imageName: string
  onClose: () => void
  onDownload: () => void
}

export const QualitySelector = ({ imageUrl, imageName, onClose, onDownload }: QualitySelectorProps) => {
  const [selectedQuality, setSelectedQuality] = useState<DownloadQuality>('original')
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    onDownload()

    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()

      let processedBlob = blob

      if (selectedQuality !== 'original') {
        processedBlob = await resizeImage(blob, selectedQuality)
      }

      const url = window.URL.createObjectURL(processedBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${imageName}_${selectedQuality}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      setTimeout(() => {
        onClose()
      }, 500)
    } catch (error) {
      console.error('Download error:', error)
    } finally {
      setDownloading(false)
    }
  }

  const resizeImage = async (blob: Blob, quality: DownloadQuality): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!

      img.onload = () => {
        let width = img.width
        let height = img.height

        switch (quality) {
          case 'high':
            width = 1920
            height = 1080
            break
          case 'medium':
            width = 1280
            height = 720
            break
          case 'low':
            width = 640
            height = 480
            break
        }

        const aspectRatio = img.width / img.height
        if (width / height > aspectRatio) {
          width = height * aspectRatio
        } else {
          height = width / aspectRatio
        }

        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob((resizedBlob) => {
          resolve(resizedBlob || blob)
        }, 'image/jpeg', 0.9)
      }

      img.src = URL.createObjectURL(blob)
    })
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Select Quality</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {DOWNLOAD_QUALITIES.map((quality) => (
            <button
              key={quality.value}
              onClick={() => setSelectedQuality(quality.value)}
              className={`w-full p-4 rounded-lg border transition-all text-left ${
                selectedQuality === quality.value
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : 'border-gray-700 hover:border-gray-600 bg-[#0a0a0a]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{quality.label}</p>
                  <p className="text-gray-400 text-sm">{quality.dimensions}</p>
                </div>
                {selectedQuality === quality.value && (
                  <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          {downloading ? 'Downloading...' : 'Download'}
        </button>
      </div>
    </div>
  )
}
