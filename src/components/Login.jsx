import React, { useState } from 'react'

function Login({ setView, onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Basic Validation
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)

    // Simulate network delay for realistic feel
    setTimeout(() => {
      // Get users list from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      
      // Seed a default demo user if no users exist yet
      const demoUser = {
        name: 'Demo Guest',
        email: 'demo@luxestay.com',
        password: 'password123'
      }
      
      const allUsers = [...users]
      if (!allUsers.find(u => u.email === demoUser.email)) {
        allUsers.push(demoUser)
        localStorage.setItem('users', JSON.stringify(allUsers))
      }

      // Check user
      const foundUser = allUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      )

      if (foundUser) {
        setSuccess('Login successful! Redirecting...')
        setTimeout(() => {
          onLoginSuccess(foundUser, rememberMe)
          setView('home')
        }, 1000)
      } else {
        setError('Invalid email or password. Hint: demo@luxestay.com / password123')
        setLoading(false)
      }
    }, 800)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Visual Side Banner */}
        <div className="auth-banner">
          <div className="banner-content">
            <span className="banner-badge">LuxeStay Elite</span>
            <h2>Your Key to Premium Stays</h2>
            <p>
              Unlock access to verified premium hotels, exclusive member-only pricing, 
              and priority support for all bookings.
            </p>
            <div className="banner-footer">
              <span>Over 10,000+ happy travelers</span>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="auth-form-side">
          <div className="auth-header">
            <h3>Welcome Back</h3>
            <p>Please enter your details to sign in to your account</p>
          </div>

          {error && <div className="auth-alert error">{error}</div>}
          {success && <div className="auth-alert success">{success}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                value={email}
                placeholder="you@example.com"
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                value={password}
                placeholder="••••••••"
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  disabled={loading}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkbox-checkmark"></span>
                <span className="checkbox-text">Remember me</span>
              </label>
              <button
                type="button"
                className="forgot-link"
                onClick={() => alert('Forgot password? Try typing password123')}
                disabled={loading}
              >
                Forgot Password?
              </button>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <span className="spinner-loader">Signing In...</span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="auth-switch-prompt">
            Don't have an account?{' '}
            <button
              type="button"
              className="switch-btn"
              onClick={() => setView('register')}
              disabled={loading}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
