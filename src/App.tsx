import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from './components/common/Navbar'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Home } from './pages/Home'
import { Dashboard } from './pages/Dashboard'
import { SignUpPage } from './pages/SignUpPage'
import { SignInPage } from './pages/SignInPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--color-bg)]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
