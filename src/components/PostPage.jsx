import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { supabase } from '../supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import './PostPage.css'

export default function PostPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [post, setPost] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [titleEdit, setTitleEdit] = useState('')
  const [contentEdit, setContentEdit] = useState('')
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()
      if (error || !data) return navigate('/')
      setPost(data)
    }
    load()
  }, [id, navigate])

  const handleVote = async (field) => {
    const newVal = post[field] + 1
    setPost((p) => ({ ...p, [field]: newVal }))
    await supabase.from('posts').update({ [field]: newVal }).eq('id', post.id)
  }

  const handleSave = async () => {
    const { data, error } = await supabase
      .from('posts')
      .update({ title: titleEdit, content: contentEdit })
      .eq('id', post.id)
      .select()
      .single()
    if (!error) {
      setPost(data)
      setIsEditing(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return
    await supabase.from('posts').delete().eq('id', post.id)
    navigate('/')
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    setSubmittingComment(true)
    const updatedComments = [...(post.comments || []), newComment.trim()]
    const { data, error } = await supabase
      .from('posts')
      .update({ comments: updatedComments })
      .eq('id', post.id)
      .select()
      .single()
    if (!error) {
      setPost(data)
      setNewComment('')
    }
    setSubmittingComment(false)
  }

  if (!post) return <div className="pp-loading">Loading…</div>

  const isOwner = user?.id === post.owner

  return (
    <div className="pp-wrapper">
      <Link to="/" className="pp-back">← Back to feed</Link>

      <div className="pp-card">
        {isEditing ? (
          <>
            <input
              className="pp-edit-title"
              value={titleEdit}
              onChange={(e) => setTitleEdit(e.target.value)}
            />
            <textarea
              className="pp-edit-content"
              rows={10}
              value={contentEdit}
              onChange={(e) => setContentEdit(e.target.value)}
            />
            <div className="pp-edit-actions">
              <button onClick={handleSave} className="pp-btn-save">
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="pp-btn-cancel"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="pp-title">{post.title}</h1>
            <p className="pp-meta">
              {new Date(post.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>

            {post.image_url && (
              <img src={post.image_url} alt="" className="pp-image" />
            )}

            <div className="pp-content">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="pp-tags">
                {post.tags.map((tag, i) => (
                  <span key={i} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="pp-vote-row">
              <button
                className="pp-vote-btn up"
                onClick={() => handleVote('upvotes')}
              >
                ▲ {post.upvotes}
              </button>
              <button
                className="pp-vote-btn down"
                onClick={() => handleVote('downvotes')}
              >
                ▼ {post.downvotes}
              </button>
            </div>

            {isOwner && (
              <div className="pp-owner-actions">
                <button
                  className="pp-btn-edit"
                  onClick={() => {
                    setTitleEdit(post.title)
                    setContentEdit(post.content)
                    setIsEditing(true)
                  }}
                >
                  Edit
                </button>
                <button className="pp-btn-delete" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Comments */}
      <div className="pp-comments">
        <h3>
          {(post.comments || []).length} Comment
          {(post.comments || []).length !== 1 ? 's' : ''}
        </h3>

        {(post.comments || []).length === 0 && (
          <p className="pp-no-comments">
            No comments yet — start the conversation.
          </p>
        )}

        {(post.comments || []).map((c, i) => (
          <div key={i} className="pp-comment">
            {c}
          </div>
        ))}

        <div className="pp-comment-form">
          <textarea
            rows={3}
            placeholder="Write a comment…"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            className="pp-btn-comment"
            onClick={handleAddComment}
            disabled={!newComment.trim() || submittingComment}
          >
            {submittingComment ? 'Posting…' : 'Post Comment'}
          </button>
        </div>
      </div>
    </div>
  )
}
