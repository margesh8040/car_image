import { useEffect, useState } from 'react'
import { UploadForm } from '../components/dashboard/UploadForm'
import { MyUploads } from '../components/dashboard/MyUploads'
import { getUserImages } from '../lib/supabaseQueries'
import { useAuth } from '../hooks/useAuth'
import { Image } from '../types'
import { Loader2 } from 'lucide-react'

export const Dashboard = () => {
  const { user } = useAuth()
  const [images, setImages] = useState<Image[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadUserImages()
    }
  }, [user])

  const loadUserImages = async () => {
    if (!user) return

    try {
      setLoading(true)
      const data = await getUserImages(user.id)
      setImages(data || [])
    } catch (error) {
      console.error('Failed to load images:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Manage your car image uploads</p>
        </div>

        <div className="space-y-8">
          <UploadForm onUploadSuccess={loadUserImages} />

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
            </div>
          ) : (
            <MyUploads images={images} onDelete={loadUserImages} />
          )}
        </div>
      </div>
    </div>
  )
}
