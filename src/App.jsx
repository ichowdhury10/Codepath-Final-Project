import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import logo from './assets/LinkhubLogo.png'
import PostFeed from './components/PostFeed'
import PostPage from './components/PostPage'
import PostForm from './components/PostForm'

import './App.css'

export default function App() {
  const [posts, setPosts] = useState([])

  // load from localStorage once
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('posts') || '[]')
    setPosts(saved)
  }, [])

  // helper to add or update the posts array + persist
  const savePosts = (next) => {
    setPosts(next)
    localStorage.setItem('posts', JSON.stringify(next))
  }

  // add a new post from the home form
  const handleAddPost = (newPost) => {
    savePosts([newPost, ...posts])
  }

  return (
    <Router>
      <header className="top-banner">
        <img
          src={logo}
          alt="Linkhub Logo"
          className="logo"
          onClick={() => (window.location.href = '/')}
        />
        <h1>Linkhub</h1>
      </header>

      <div className="container">
        <Routes>
          {/* Home: create + feed */}
          <Route
            path="/"
            element={
              <>
                <PostForm onAddPost={handleAddPost} />
                <PostFeed posts={posts} />
              </>
            }
          />

          {/* Detail page: all interactions */}
          <Route
            path="/post/:id"
            element={<PostPage posts={posts} savePosts={savePosts} />}
          />
        </Routes>
      </div>
    </Router>
  )
}
