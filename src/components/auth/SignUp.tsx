import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signUp } from '../../lib/supabaseQueries'
import { Eye, EyeOff, Loader2, Check } from 'lucide-react'

export const SignUp = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string
    email?: string
    password?: string
    confirmPassword?: string
  }>({})
  const [passwordStrength, setPasswordStrength] = useState(0)

  useEffect(() => {
    if (formData.password) {
      let strength = 0
      if (formData.password.length >= 8) strength++
      if (/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password)) strength++
      if (/[0-9]/.test(formData.password)) strength++
      if (/[^a-zA-Z0-9]/.test(formData.password)) strength++
      setPasswordStrength(strength)
    } else {
      setPasswordStrength(0)
    }
  }, [formData.password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    const errors: typeof fieldErrors = {}

    if (!formData.username || formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters'
    }

    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setLoading(true)

    try {
      await signUp(formData.email, formData.password, formData.username)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up')
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

  const getStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-600'
    if (passwordStrength <= 1) return 'bg-red-500'
    if (passwordStrength === 2) return 'bg-yellow-500'
    if (passwordStrength === 3) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getStrengthText = () => {
    if (passwordStrength === 0) return ''
    if (passwordStrength <= 1) return 'Weak'
    if (passwordStrength === 2) return 'Fair'
    if (passwordStrength === 3) return 'Good'
    return 'Strong'
  }

  return (
    <div className="min-h-screen bg-[#0F1419] flex items-center justify-center px-4">
      <div className="w-full max-w-[420px]">
        <div className="bg-[#1A212B] rounded-2xl p-6 min-h-[520px]">
          <h1 className="text-2xl font-bold text-white mb-6">Create Account</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 animate-shake">
                <p className="text-red-500 text-xs">✗ {error}</p>
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full h-12 px-4 bg-[#0F1419] border rounded-lg focus:outline-none text-white transition-all duration-300 ${
                  fieldErrors.username
                    ? 'border-red-500'
                    : 'border-gray-700 focus:border-[#00D9FF] focus:shadow-[0_0_12px_rgba(0,217,255,0.3)]'
                }`}
                placeholder="Choose unique username"
              />
              {fieldErrors.username && (
                <p className="text-red-500 text-xs mt-1">✗ {fieldErrors.username}</p>
              )}
            </div>

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
              {formData.password && (
                <>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          level <= passwordStrength ? getStrengthColor() : 'bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                  {passwordStrength > 0 && (
                    <p className={`text-xs mt-1 ${passwordStrength >= 3 ? 'text-green-500' : 'text-yellow-500'}`}>
                      {getStrengthText()}
                    </p>
                  )}
                </>
              )}
              <p className="text-gray-500 text-xs mt-1">Min 8 characters required</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full h-12 px-4 pr-12 bg-[#0F1419] border rounded-lg focus:outline-none text-white transition-all duration-300 ${
                    fieldErrors.confirmPassword
                      ? 'border-red-500'
                      : formData.confirmPassword && formData.password === formData.confirmPassword
                      ? 'border-green-500'
                      : 'border-gray-700 focus:border-[#00D9FF] focus:shadow-[0_0_12px_rgba(0,217,255,0.3)]'
                  }`}
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">✗ {fieldErrors.confirmPassword}</p>
              )}
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
                  <Check size={12} /> Passwords match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#FF6B35] text-white rounded-lg font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have account?{' '}
            <Link to="/signin" className="text-gray-400 hover:text-[#FF6B35] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
