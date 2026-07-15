import React, { useState } from 'react'

function Register({ setView }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validations
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms and Conditions.')
      return
    }

    setLoading(true)

    // Simulate delay
    setTimeout(() => {
      // Get users list from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]')

      // Check if user already exists
      const userExists = users.some(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      )

      if (userExists) {
        setError('An account with this email already exists.')
        setLoading(false)
        return
      }

      // Add user
      const newUser = {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: password
      }

      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))

      setSuccess('Account created successfully! Redirecting to login...')
      
      setTimeout(() => {
        setView('login')
      }, 1200)
    }, 800)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Visual Side Banner */}
        <div className="auth-banner">
          <div className="banner-content">
            <span className="banner-badge">Join LuxeStay</span>
            <h2>Begin Your Journey With Us</h2>
            <p>
              Register today to start bookmarking your favorite luxury hotels 
              and receive personalized recommendation alerts.
            </p>
            <div className="banner-footer">
              <span>Fast & secure account registration</span>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="auth-form-side">
          <div className="auth-header">
            <h3>Create Account</h3>
            <p>Fill out the form below to register your profile</p>
          </div>

          {error && <div className="auth-alert error">{error}</div>}
          {success && <div className="auth-alert success">{success}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="reg-name">Full Name</label>
              <input
                id="reg-name"
                type="text"
                value={name}
                placeholder="John Doe"
                disabled={loading}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">Email Address</label>
              <input
                id="reg-email"
                type="email"
                value={email}
                placeholder="john@example.com"
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="reg-password">Password</label>
                <input
                  id="reg-password"
                  type="password"
                  value={password}
                  placeholder="••••••••"
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-confirm">Confirm Password</label>
                <input
                  id="reg-confirm"
                  type="password"
                  value={confirmPassword}
                  placeholder="••••••••"
                  disabled={loading}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  disabled={loading}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span className="checkbox-checkmark"></span>
                <span className="checkbox-text">
                  I agree to the{' '}
                  <button
                    type="button"
                    className="terms-link"
                    onClick={() => alert('Terms of Service: Play nice, search hotels, have fun!')}
                    disabled={loading}
                  >
                    Terms & Conditions
                  </button>
                </span>
              </label>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <span className="spinner-loader">Creating Account...</span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="auth-switch-prompt">
            Already have an account?{' '}
            <button
              type="button"
              className="switch-btn"
              onClick={() => setView('login')}
              disabled={loading}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
