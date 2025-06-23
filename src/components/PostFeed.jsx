// src/components/PostFeed.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import './PostFeed.css'

export default function PostFeed({ posts, setPosts }) {
  // Form state
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  // Search & sort
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  // Comments per-post
  const [commentsState, setCommentsState] = useState({})

  // Load saved posts on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('posts')) || []
    setPosts(saved)
  }, [setPosts])

  // Persist helper
  const persist = (updated) => {
    setPosts(updated)
    localStorage.setItem('posts', JSON.stringify(updated))
  }

  // Create a new post
  const handleCreate = (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    const newPost = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      comments: [],
    }
    persist([newPost, ...posts])
    setTitle('')
    setContent('')
  }

  // Vote helper
  const updateVotes = (postId, field) => {
    const updated = posts.map((p) =>
      p.id === postId ? { ...p, [field]: p[field] + 1 } : p
    )
    persist(updated)
  }

  // Delete a post
  const handleDelete = (postId) => {
    const updated = posts.filter((p) => p.id !== postId)
    persist(updated)
  }

  // Add comment
  const handleAddComment = (postId) => {
    const text = (commentsState[postId] || '').trim()
    if (!text) return
    const updated = posts.map((p) =>
      p.id === postId ? { ...p, comments: [...p.comments, text] } : p
    )
    persist(updated)
    setCommentsState((cs) => ({ ...cs, [postId]: '' }))
  }

  // Filter & sort posts
  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const displayed = [...filtered].sort((a, b) => {
    const da = new Date(a.createdAt),
      db = new Date(b.createdAt)
    switch (sortBy) {
      case 'oldest':
        return da - db
      case 'upvotes':
        return b.upvotes - a.upvotes
      case 'downvotes':
        return b.downvotes - a.downvotes
      case 'newest':
      default:
        return db - da
    }
  })

  return (
    <div className="postfeed-container">
      {/* Create‐post card */}
      <div className="create-card">
        <h2>Create a New Post</h2>
        <form onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            rows={4}
            placeholder="Write your content here (Markdown supported)…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {/* Live Markdown preview */}
          <div className="md-preview">
            <h4>Preview</h4>
            <div className="preview-box">
              <ReactMarkdown>
                {content || '*Nothing to preview…*'}
              </ReactMarkdown>
            </div>
          </div>
          <button type="submit" disabled={!title.trim() || !content.trim()}>
            Create Post
          </button>
        </form>
      </div>

      {/* Search + Sort */}
      <div className="search-sort">
        <input
          type="text"
          placeholder="🔍 Search posts by title…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="upvotes">Most upvotes</option>
          <option value="downvotes">Most downvotes</option>
        </select>
      </div>

      {/* Feed */}
      <h2>Your Feed</h2>
      <div className="feed-list">
        {displayed.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <Link to={`/post/${post.id}`} className="post-title">
                {post.title}
              </Link>
              <span className="post-date">
                {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>

            {/* Excerpt */}
            <div className="post-content">
              <ReactMarkdown>
                {post.content.length > 200
                  ? post.content.slice(0, 200) + '…'
                  : post.content}
              </ReactMarkdown>
            </div>

            {/* Votes */}
            <div className="vote-buttons">
              <button
                onClick={() => updateVotes(post.id, 'upvotes')}
                className="btn-upvote"
              >
                👍 {post.upvotes}
              </button>
              <button
                onClick={() => updateVotes(post.id, 'downvotes')}
                className="btn-downvote"
              >
                👎 {post.downvotes}
              </button>
            </div>

            {/* Delete */}
            <button
              onClick={() => handleDelete(post.id)}
              className="btn-delete"
            >
              Delete
            </button>

            {/* Comments */}
            <div className="comments-section">
              <h4>Comments</h4>
              {post.comments.map((c, i) => (
                <p key={i} className="comment">
                  {c}
                </p>
              ))}
              <textarea
                rows={2}
                placeholder="Add a comment…"
                value={commentsState[post.id] || ''}
                onChange={(e) =>
                  setCommentsState((cs) => ({
                    ...cs,
                    [post.id]: e.target.value,
                  }))
                }
              />
              <button
                onClick={() => handleAddComment(post.id)}
                className="btn-comment"
              >
                Add Comment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
