import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './AuthForm.css'

const DEMO_EMAIL    = import.meta.env.VITE_DEMO_EMAIL    || 'demo@linkhub.app'
const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD || 'demo1234'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await login(email, password)
    if (error) {
      setError(error.message)
    } else {
      navigate('/')
    }
    setLoading(false)
  }

  const handleDemo = async () => {
    setError('')
    setDemoLoading(true)
    const { error } = await login(DEMO_EMAIL, DEMO_PASSWORD)
    if (error) {
      setError('Demo account unavailable. Please sign up to explore.')
    } else {
      navigate('/')
    }
    setDemoLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome back</h2>
        <p className="auth-subtitle">Log in to your Linkhub account</p>

        {error && <div className="auth-error">{error}</div>}

        {/* Demo banner */}
        <div className="demo-banner">
          <div className="demo-banner-text">
            <span className="demo-badge">Demo</span>
            Just browsing? Jump straight in.
          </div>
          <button
            className="btn-demo"
            onClick={handleDemo}
            disabled={demoLoading}
          >
            {demoLoading ? 'Loading…' : 'Try Demo →'}
          </button>
        </div>

        <div className="auth-divider"><span>or sign in with your account</span></div>

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </form>

        <p className="auth-switch">
          Don&apos;t have an account?{' '}
          <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  )
}
