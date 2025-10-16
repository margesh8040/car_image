import { useEffect, useState } from 'react'
import { UploadForm } from '../components/dashboard/UploadForm'
import { MyUploads } from '../components/dashboard/MyUploads'
import { UserStats } from '../components/dashboard/UserStats'
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
    <div className="min-h-screen bg-[#0F1419]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <UploadForm onUploadSuccess={loadUserImages} />

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-[#00D9FF] animate-spin" />
              </div>
            ) : (
              <MyUploads images={images} onDelete={loadUserImages} />
            )}
          </div>

          <div className="lg:col-span-1">
            <UserStats />
          </div>
        </div>
      </div>
    </div>
  )
}
