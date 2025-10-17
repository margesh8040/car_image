import { useState, useCallback } from 'react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
}

let toastListeners: ((toast: Toast | null) => void)[] = []

export const useToast = () => {
  const [currentToast, setCurrentToast] = useState<Toast | null>(null)

  const subscribe = useCallback((listener: (toast: Toast | null) => void) => {
    toastListeners.push(listener)
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener)
    }
  }, [])

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const toast: Toast = {
      id: Date.now().toString(),
      message,
      type,
    }

    toastListeners.forEach(listener => listener(toast))

    setTimeout(() => {
      toastListeners.forEach(listener => listener(null))
    }, 3000)
  }, [])

  return { showToast, currentToast, subscribe }
}
