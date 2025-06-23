// src/components/PostPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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

  // Load the post
  useEffect(() => {
    const loadPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()
      if (error || !data) {
        console.error(error)
        return navigate('/')
      }
      setPost(data)
    }
    loadPost()
  }, [id, navigate])

  // Helper to update local state
  const refresh = (updated) => setPost(updated)

  // Up/down vote
  const handleVote = async (field) => {
    const { data, error } = await supabase
      .from('posts')
      .update({ [field]: post[field] + 1 })
      .eq('id', post.id)
      .single()
    if (error) console.error(error)
    else refresh(data)
  }

  // Save edits
  const handleSave = async () => {
    const { data, error } = await supabase
      .from('posts')
      .update({ title: titleEdit, content: contentEdit })
      .eq('id', post.id)
      .single()
    if (error) console.error(error)
    else {
      refresh(data)
      setIsEditing(false)
    }
  }

  // Delete post
  const handleDelete = async () => {
    const { error } = await supabase.from('posts').delete().eq('id', post.id)
    if (error) console.error(error)
    else navigate('/')
  }

  // Add comment (still client‐side array update)
  const handleAddComment = async () => {
    if (!newComment.trim()) return
    const updatedComments = [...(post.comments || []), newComment.trim()]
    const { data, error } = await supabase
      .from('posts')
      .update({ comments: updatedComments })
      .eq('id', post.id)
      .single()
    if (error) console.error(error)
    else {
      refresh(data)
      setNewComment('')
    }
  }

  if (!post) return <div className="loading">Loading…</div>

  return (
    <div className="postpage-container">
      <button onClick={() => navigate('/')} className="back-btn">
        ← Back to Feed
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
              Save Changes
            </button>
          </>
        ) : (
          <>
            <h1>{post.title}</h1>
            <p className="post-date">
              {new Date(post.created_at).toLocaleString()}
            </p>
            {post.image_url && (
              <img src={post.image_url} alt="" className="post-image" />
            )}
            <p className="post-content">{post.content}</p>

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

            {/* Only show Edit/Delete if current user is the owner */}
            {user?.id === post.owner && (
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
            )}
          </>
        )}

        <hr />

        <div className="comments-section">
          <h3>Comments</h3>
          {(post.comments || []).map((c, i) => (
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
