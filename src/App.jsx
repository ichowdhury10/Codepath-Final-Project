import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  NavLink,
  Link,
} from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import logo from './assets/LinkhubLogo.png'
import PostFeed from './components/PostFeed'
import PostPage from './components/PostPage'
import Profile from './components/Profile'
import Login from './components/Login'
import SignUp from './components/SignUp'
import './App.css'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="page-loading">Loading…</div>
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  const { user, logout } = useAuth()

  return (
    <Router>
      <header className="app-header">
        <div className="header-inner">
          <Link to="/" className="header-brand">
            <img src={logo} alt="Linkhub" className="header-logo" />
            <span>Linkhub</span>
          </Link>

          <nav className="header-nav">
            {user ? (
              <>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    isActive ? 'nav-link active' : 'nav-link'
                  }
                >
                  Profile
                </NavLink>
                <button onClick={logout} className="btn-header-logout">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? 'nav-link active' : 'nav-link'
                  }
                >
                  Log In
                </NavLink>
                <Link to="/signup" className="btn-header-signup">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <PostFeed />
              </PrivateRoute>
            }
          />
          <Route
            path="/post/:id"
            element={
              <PrivateRoute>
                <PostPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </Router>
  )
}
