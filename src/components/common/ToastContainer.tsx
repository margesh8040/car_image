import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import { useToast } from '../../hooks/useToast'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

export const ToastContainer = () => {
  const [toasts, setToasts] = useState<Toast[]>([])
  const { subscribe } = useToast()

  useEffect(() => {
    const unsubscribe = subscribe((toast) => {
      if (toast) {
        setToasts(prev => [...prev, toast])
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== toast.id))
        }, 3000)
      }
    })

    return unsubscribe
  }, [subscribe])

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />
      case 'error':
        return <XCircle className="w-5 h-5" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />
      default:
        return <Info className="w-5 h-5" />
    }
  }

  const getColors = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/50 text-green-400'
      case 'error':
        return 'bg-red-500/10 border-red-500/50 text-red-400'
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400'
      default:
        return 'bg-blue-500/10 border-blue-500/50 text-blue-400'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm shadow-lg animate-slide-in min-w-[300px] max-w-[400px] ${getColors(
            toast.type
          )}`}
        >
          {getIcon(toast.type)}
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
