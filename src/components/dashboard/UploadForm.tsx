import { useState, useRef, DragEvent } from 'react'
import { Cloud, X, AlertCircle, Loader2, Check } from 'lucide-react'
import { uploadImage } from '../../lib/supabaseQueries'
import { useAuth } from '../../hooks/useAuth'
import { CAR_CATEGORIES, CarCategory } from '../../types'

interface UploadFormProps {
  onUploadSuccess: () => void
}

export const UploadForm = ({ onUploadSuccess }: UploadFormProps) => {
  const { user } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    image_name: '',
    description: '',
    category: '' as CarCategory | '',
    hashtags: '',
  })
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateAndSetFile = (selectedFile: File) => {
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return false
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please select a valid image file (.jpg, .png, .webp)')
      return false
    }

    setFile(selectedFile)
    setError('')

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
    return true
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      validateAndSetFile(selectedFile)
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      validateAndSetFile(droppedFile)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveFile = () => {
    setFile(null)
    setPreview(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !file) return

    if (!formData.image_name.trim()) {
      setError('Please enter an image name')
      return
    }

    if (!formData.category) {
      setError('Please select a category')
      return
    }

    setLoading(true)
    setError('')
    setUploadProgress(0)

    try {
      const hashtags = formData.hashtags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      await uploadImage(user.id, file, {
        image_name: formData.image_name,
        description: formData.description || undefined,
        category: formData.category,
        hashtags: hashtags.length > 0 ? hashtags : undefined,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)
      setSuccess(true)

      setTimeout(() => {
        setFile(null)
        setPreview(null)
        setFormData({
          image_name: '',
          description: '',
          category: '',
          hashtags: '',
        })
        setUploadProgress(0)
        setSuccess(false)
        onUploadSuccess()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#1A212B] rounded-2xl p-6 animate-fade-in">
      <h2 className="text-3xl font-bold text-white mb-2">Upload Car Images</h2>
      <p className="text-gray-400 text-base mb-8">Share your collection with the community</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 animate-shake">
            <p className="text-red-500 text-xs flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500 rounded-lg p-3 animate-fade-in">
            <p className="text-green-500 text-xs flex items-center gap-2">
              <Check size={16} />
              Image uploaded successfully!
            </p>
          </div>
        )}

        {!preview ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            className={`min-h-[240px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
              isDragOver
                ? 'border-[#00D9FF] bg-[#1A212B] border-solid'
                : 'border-[#00D9FF] bg-[#1A212B]/50 hover:bg-[#1A212B] hover:border-solid'
            }`}
          >
            <Cloud className="w-16 h-16 text-[#00D9FF] mb-4 animate-bounce" />
            <p className="text-lg text-gray-300 mb-1">Drag & drop images</p>
            <p className="text-lg text-gray-400 mb-4">or click to browse</p>
            <p className="text-sm text-gray-500">.jpg, .png, .webp</p>
            <p className="text-sm text-gray-500">Max 5MB</p>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="relative inline-block">
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={handleRemoveFile}
                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full hover:bg-red-600 transition-colors flex items-center justify-center"
              >
                <X size={16} className="text-white" />
              </button>
            </div>

            <div>
              <label htmlFor="image_name" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Image Name *
              </label>
              <input
                type="text"
                id="image_name"
                name="image_name"
                value={formData.image_name}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 bg-[#0F1419] border border-gray-700 rounded-lg focus:outline-none focus:border-[#00D9FF] focus:shadow-[0_0_12px_rgba(0,217,255,0.3)] text-white transition-all duration-300"
                placeholder="Enter image title"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 bg-[#0F1419] border border-gray-700 rounded-lg focus:outline-none focus:border-[#00D9FF] focus:shadow-[0_0_12px_rgba(0,217,255,0.3)] text-white transition-all duration-300 cursor-pointer"
              >
                <option value="">Select a category</option>
                {CAR_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-[#0F1419] border border-gray-700 rounded-lg focus:outline-none focus:border-[#00D9FF] focus:shadow-[0_0_12px_rgba(0,217,255,0.3)] text-white transition-all duration-300 resize-none"
                placeholder="Tell us about this car..."
              />
            </div>

            <div>
              <label htmlFor="hashtags" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Hashtags
              </label>
              <input
                type="text"
                id="hashtags"
                name="hashtags"
                value={formData.hashtags}
                onChange={handleChange}
                className="w-full h-12 px-4 bg-[#0F1419] border border-gray-700 rounded-lg focus:outline-none focus:border-[#00D9FF] focus:shadow-[0_0_12px_rgba(0,217,255,0.3)] text-white transition-all duration-300"
                placeholder="ferrari, red, supercar (comma separated)"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !file}
              className="w-full h-12 bg-[#FF6B35] text-white rounded-lg font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload Image'
              )}
            </button>

            {loading && (
              <div className="space-y-2">
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      uploadProgress === 100 ? 'bg-green-500' : 'bg-[#00D9FF]'
                    }`}
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-400 text-center">{uploadProgress}%</p>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  )
}
