import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../supabaseClient'
import './Profile.css'

export default function Profile() {
  const { user, logout } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select('id, title, created_at, upvotes, downvotes, comments')
        .eq('owner', user.id)
        .order('created_at', { ascending: false })
      setPosts(data || [])
      setLoading(false)
    }
    fetchPosts()
  }, [user.id])

  const initials = user.email.charAt(0).toUpperCase()
  const totalUpvotes = posts.reduce((sum, p) => sum + (p.upvotes || 0), 0)
  const totalComments = posts.reduce(
    (sum, p) => sum + (p.comments?.length || 0),
    0
  )
  const memberSince = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="prof-wrapper">
      {/* Header card */}
      <div className="prof-header">
        <div className="prof-avatar">{initials}</div>
        <div className="prof-info">
          <div className="prof-email">{user.email}</div>
          <div className="prof-joined">Member since {memberSince}</div>
        </div>
        <button onClick={logout} className="prof-btn-logout">
          Log Out
        </button>
      </div>

      {/* Stats */}
      <div className="prof-stats">
        <div className="stat-card">
          <div className="stat-value">{posts.length}</div>
          <div className="stat-label">Posts</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalUpvotes}</div>
          <div className="stat-label">Upvotes</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalComments}</div>
          <div className="stat-label">Comments</div>
        </div>
      </div>

      {/* Post list */}
      <div className="prof-posts">
        <h3>Your Posts</h3>
        {loading ? (
          <p className="prof-empty">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="prof-empty">
            You haven&apos;t posted yet.{' '}
            <Link to="/" className="prof-link">
              Be the first!
            </Link>
          </p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="prof-post-row">
              <div className="prof-post-info">
                <Link to={`/post/${post.id}`} className="prof-post-title">
                  {post.title}
                </Link>
                <div className="prof-post-meta">
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                  {' · '}
                  {post.comments?.length || 0} comment
                  {(post.comments?.length || 0) !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="prof-post-score">▲ {post.upvotes || 0}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
