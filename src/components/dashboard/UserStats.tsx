import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { getUserImages, getProfile } from '../../lib/supabaseQueries'
import { User, Upload, Download, Heart } from 'lucide-react'

export const UserStats = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    username: '',
    email: '',
    uploadCount: 0,
    totalDownloads: 0,
    totalLikes: 0,
  })

  useEffect(() => {
    if (user) {
      loadUserStats()
    }
  }, [user])

  const loadUserStats = async () => {
    if (!user) return

    try {
      const profile = await getProfile(user.id)
      const images = await getUserImages(user.id)

      const totalDownloads = images?.reduce((sum, img) => sum + img.download_count, 0) || 0
      const totalLikes = images?.reduce((sum, img) => sum + img.like_count, 0) || 0

      setStats({
        username: profile?.username || 'User',
        email: profile?.email || user.email || '',
        uploadCount: images?.length || 0,
        totalDownloads,
        totalLikes,
      })
    } catch (error) {
      console.error('Failed to load user stats:', error)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  return (
    <div className="bg-[#1A212B] rounded-2xl p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B35] to-[#00D9FF] rounded-full flex items-center justify-center">
          <User className="w-10 h-10 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">{stats.username}</h3>
          <p className="text-sm text-gray-400">@{stats.username.toLowerCase().replace(/\s+/g, '')}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Upload className="w-4 h-4 text-[#FF6B35]" />
            <p className="text-2xl font-bold text-[#FF6B35]">{formatNumber(stats.uploadCount)}</p>
          </div>
          <p className="text-xs text-gray-400">Uploads</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Download className="w-4 h-4 text-[#00D9FF]" />
            <p className="text-2xl font-bold text-[#00D9FF]">{formatNumber(stats.totalDownloads)}</p>
          </div>
          <p className="text-xs text-gray-400">Downloads</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Heart className="w-4 h-4 text-red-500" />
            <p className="text-2xl font-bold text-red-500">{formatNumber(stats.totalLikes)}</p>
          </div>
          <p className="text-xs text-gray-400">Likes</p>
        </div>
      </div>
    </div>
  )
}
