import { useState } from 'react'
import { Upload, X, AlertCircle } from 'lucide-react'
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
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    setFile(selectedFile)
    setError('')

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
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

    try {
      const hashtags = formData.hashtags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      await uploadImage(user.id, file, {
        image_name: formData.image_name,
        description: formData.description || undefined,
        category: formData.category,
        hashtags: hashtags.length > 0 ? hashtags : undefined,
      })

      setSuccess(true)
      setFile(null)
      setPreview(null)
      setFormData({
        image_name: '',
        description: '',
        category: '',
        hashtags: '',
      })

      setTimeout(() => {
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
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Upload New Image</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
            <p className="text-green-400 text-sm">Image uploaded successfully!</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Image File</label>
          {!preview ? (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors bg-[#0a0a0a]">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                <p className="mb-2 text-sm text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB)</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          ) : (
            <div className="relative">
              <img src={preview} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
              <button
                type="button"
                onClick={handleRemoveFile}
                className="absolute top-2 right-2 p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="image_name" className="block text-sm font-medium text-gray-300 mb-2">
            Image Name *
          </label>
          <input
            type="text"
            id="image_name"
            name="image_name"
            value={formData.image_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 text-white transition-colors"
            placeholder="e.g., Red Ferrari 458"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 text-white transition-colors"
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
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 text-white transition-colors resize-none"
            placeholder="Tell us about this car..."
          />
        </div>

        <div>
          <label htmlFor="hashtags" className="block text-sm font-medium text-gray-300 mb-2">
            Hashtags
          </label>
          <input
            type="text"
            id="hashtags"
            name="hashtags"
            value={formData.hashtags}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 text-white transition-colors"
            placeholder="ferrari, red, supercar (comma separated)"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !file}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Upload className="w-5 h-5" />
          {loading ? 'Uploading...' : 'Upload Image'}
        </button>
      </form>
    </div>
  )
}
