import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Car, Search, Menu, X, LayoutDashboard, LogOut } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { signOut } from '../../lib/supabaseQueries'
import { Button } from './Button'

export const Navbar = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Search:', searchQuery)
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-[var(--color-primary)] border-b border-[var(--color-primary-light)] backdrop-blur-lg bg-opacity-95">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            <Link
              to="/"
              className="flex items-center gap-3 group"
              aria-label="CarHub Home"
            >
              <div className="bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-highlight)] p-2.5 rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Car className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold text-[var(--color-text)] tracking-tight hidden sm:block">
                CarHub
              </span>
            </Link>

            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center flex-1 max-w-md mx-8"
            >
              <div className="relative w-full">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]"
                  strokeWidth={2}
                />
                <input
                  type="text"
                  placeholder="Search cars, makes, models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[var(--color-primary-light)] border border-transparent rounded-xl text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-highlight)] focus:ring-2 focus:ring-[var(--color-highlight)]/20 transition-all duration-300"
                  aria-label="Search cars"
                />
              </div>
            </form>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-primary-light)] transition-all duration-300"
                    aria-label="Dashboard"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-primary-light)] transition-all duration-300"
                    aria-label="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-highlight)] flex items-center justify-center text-white font-semibold text-sm shadow-lg cursor-pointer hover:scale-110 transition-transform duration-300">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                </>
              ) : (
                <>
                  <Link to="/signin" className="hidden md:block">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="primary">Sign Up</Button>
                  </Link>
                </>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden btn-icon text-[var(--color-text)]"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[72px] z-40 bg-[var(--color-primary)] border-b border-[var(--color-primary-light)] animate-in slide-in-from-top duration-300">
          <div className="max-w-[1440px] mx-auto px-4 py-6 space-y-4">
            <form onSubmit={handleSearch} className="md:hidden">
              <div className="relative w-full">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]"
                  strokeWidth={2}
                />
                <input
                  type="text"
                  placeholder="Search cars, makes, models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[var(--color-primary-light)] border border-transparent rounded-xl text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-highlight)] focus:ring-2 focus:ring-[var(--color-highlight)]/20 transition-all duration-300"
                  aria-label="Search cars"
                />
              </div>
            </form>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--color-text)] hover:bg-[var(--color-primary-light)] transition-all duration-300"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="font-medium">Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    handleSignOut()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--color-text)] hover:bg-[var(--color-primary-light)] transition-all duration-300"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full"
                >
                  <Button variant="ghost" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full"
                >
                  <Button variant="primary" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
