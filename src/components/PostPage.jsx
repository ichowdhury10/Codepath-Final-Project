import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './PostPage.css'

export default function PostPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [posts, setPosts] = useState([])
  const [post, setPost] = useState(null)

  const [isEditing, setIsEditing] = useState(false)
  const [titleEdit, setTitleEdit] = useState('')
  const [contentEdit, setContentEdit] = useState('')
  const [newComment, setNewComment] = useState('')
  const [tags, setTags] = useState([])

  // load & find
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('posts')) || []
    setPosts(saved)
    const found = saved.find((p) => String(p.id) === id)
    if (!found) return navigate('/')
    setPost(found)
  }, [id, navigate])

  const persist = (updated) => {
    localStorage.setItem('posts', JSON.stringify(updated))
    setPosts(updated)
    setPost(updated.find((p) => p.id === post.id))
  }

  const handleVote = (field) =>
    persist(
      posts.map((p) => (p.id === post.id ? { ...p, [field]: p[field] + 1 } : p))
    )

  const handleSave = () => {
    const updated = posts.map((p) =>
      p.id === post.id ? { ...p, title: titleEdit, content: contentEdit } : p
    )
    persist(updated)
    setIsEditing(false)
  }

  const handleDelete = () => {
    const updated = posts.filter((p) => p.id !== post.id)
    localStorage.setItem('posts', JSON.stringify(updated))
    navigate('/')
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return
    const updated = posts.map((p) =>
      p.id === post.id
        ? { ...p, comments: [...(p.comments || []), newComment.trim()] }
        : p
    )
    persist(updated)
    setNewComment('')
  }

  // fetch AI tags once
  useEffect(() => {
    if (!post) return
    fetch('http://localhost:3000/tag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: post.content }),
    })
      .then((r) => r.json())
      .then((d) => d.tags && setTags(d.tags))
      .catch(() => {
        /* ignore */
      })
  }, [post])

  if (!post) return <div className="loading">Loading…</div>

  return (
    <div className="postpage-container">
      {/* back button OUTSIDE the card */}
      <button onClick={() => navigate('/')} className="back-btn">
        ← Back
      </button>

      <div className="postpage-card">
        {isEditing ? (
          <>
            <input
              className="edit-title"
              value={titleEdit}
              onChange={(e) => setTitleEdit(e.target.value)}
            />
            <textarea
              className="edit-content"
              rows={5}
              value={contentEdit}
              onChange={(e) => setContentEdit(e.target.value)}
            />
            <button onClick={handleSave} className="btn-save">
              Save
            </button>
          </>
        ) : (
          <>
            <h1>{post.title}</h1>
            <p className="post-date">
              {new Date(post.createdAt).toLocaleString()}
            </p>
            {post.image && (
              <img src={post.image} alt="" className="post-image" />
            )}
            <p className="post-content">{post.content}</p>

            <div className="tag-list">
              {tags.map((t, i) => (
                <span key={i} className="tag">
                  {t}
                </span>
              ))}
            </div>

            <div className="vote-row">
              <button
                onClick={() => handleVote('upvotes')}
                className="btn-upvote"
              >
                👍 {post.upvotes}
              </button>
              <button
                onClick={() => handleVote('downvotes')}
                className="btn-downvote"
              >
                👎 {post.downvotes}
              </button>
            </div>

            <div className="action-row">
              <button
                onClick={() => {
                  setTitleEdit(post.title)
                  setContentEdit(post.content)
                  setIsEditing(true)
                }}
                className="btn-edit"
              >
                Edit
              </button>
              <button onClick={handleDelete} className="btn-delete">
                Delete
              </button>
            </div>
          </>
        )}

        {/* single, light divider */}
        <hr className="divider" />

        <div className="comments-section">
          <h3>Comments</h3>
          {post.comments.map((c, i) => (
            <p key={i} className="comment">
              {c}
            </p>
          ))}

          <textarea
            rows={2}
            placeholder="Add a comment…"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleAddComment} className="btn-comment">
            Add Comment
          </button>
        </div>
      </div>
    </div>
  )
}
