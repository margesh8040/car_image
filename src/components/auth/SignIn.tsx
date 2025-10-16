import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signIn } from '../../lib/supabaseQueries'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export const SignIn = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    const errors: { email?: string; password?: string } = {}

    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setLoading(true)

    try {
      await signIn(formData.email, formData.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  return (
    <div className="min-h-screen bg-[#0F1419] flex items-center justify-center px-4">
      <div className="w-full max-w-[420px]">
        <div className="bg-[#1A212B] rounded-2xl p-6 min-h-[380px]">
          <h1 className="text-2xl font-bold text-white mb-6">Sign In</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 animate-shake">
                <p className="text-red-500 text-xs">✗ {error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full h-12 px-4 bg-[#0F1419] border rounded-lg focus:outline-none text-white transition-all duration-300 ${
                  fieldErrors.email
                    ? 'border-red-500'
                    : 'border-gray-700 focus:border-[#00D9FF] focus:shadow-[0_0_12px_rgba(0,217,255,0.3)]'
                }`}
                placeholder="Enter your email"
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-xs mt-1">✗ {fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full h-12 px-4 pr-12 bg-[#0F1419] border rounded-lg focus:outline-none text-white transition-all duration-300 ${
                    fieldErrors.password
                      ? 'border-red-500'
                      : 'border-gray-700 focus:border-[#00D9FF] focus:shadow-[0_0_12px_rgba(0,217,255,0.3)]'
                  }`}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-red-500 text-xs mt-1">✗ {fieldErrors.password}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">Min 8 characters required</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#FF6B35] text-white rounded-lg font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Don't have account?{' '}
            <Link to="/signup" className="text-gray-400 hover:text-[#FF6B35] transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
