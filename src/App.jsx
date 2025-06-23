// src/App.jsx
import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
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
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  const { user, logout } = useAuth()
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('posts')) || []
    setPosts(saved)
  }, [])

  return (
    <Router>
      <header className="top-banner">
        <div className="logo-container">
          <Link to="/">
            <img src={logo} alt="Linkhub Logo" className="logo" />
          </Link>
          <h1>Linkhub</h1>
        </div>

        <nav className="header-nav">
          {user ? (
            <>
              <Link to="/profile">Profile</Link>
              <button onClick={logout} className="logout-btn">
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Log In</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <PostFeed posts={posts} setPosts={setPosts} />
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
    </Router>
  )
}
