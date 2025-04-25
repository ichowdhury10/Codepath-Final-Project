import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import CommentForm from './CommentForm'

export default function PostPage({ posts, savePosts }) {
  const { id } = useParams()
  const nav = useNavigate()

  const [post, setPost] = useState(null)
  const [isEditing, setEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState('')
  const [draftContent, setDraftContent] = useState('')

  // grab the post on mount / posts change
  useEffect(() => {
    const found = posts.find((p) => p.id === +id)
    if (!found) return nav('/')
    setPost(found)
    setDraftTitle(found.title)
    setDraftContent(found.content)
  }, [id, posts, nav])

  if (!post) return null

  // persist updates
  const apply = (updated) => {
    const next = posts.map((p) => (p.id === post.id ? updated : p))
    savePosts(next)
    setPost(updated)
  }

  const upvote = () => apply({ ...post, upvotes: post.upvotes + 1 })

  const del = () => {
    const next = posts.filter((p) => p.id !== post.id)
    savePosts(next)
    nav('/')
  }

  const saveEdit = () => {
    apply({ ...post, title: draftTitle, content: draftContent })
    setEditing(false)
  }

  return (
    <div className="post-page">
      <button onClick={() => nav('/')} className="back-btn">
        ← Back
      </button>

      {isEditing ? (
        <div className="edit-form">
          <input
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
          />
          <textarea
            rows="5"
            value={draftContent}
            onChange={(e) => setDraftContent(e.target.value)}
          />
          <button onClick={saveEdit}>Save Changes</button>
        </div>
      ) : (
        <>
          <h1>{post.title}</h1>
          {post.image && <img src={post.image} alt="" className="post-image" />}
          <p>{post.content}</p>
          <small>{new Date(post.createdAt).toLocaleString()}</small>

          <div className="actions">
            <button onClick={upvote} className="btn-upvote">
              👍 {post.upvotes}
            </button>
            <button onClick={() => setEditing(true)} className="btn-edit">
              ✏️ Edit
            </button>
            <button onClick={del} className="btn-danger">
              🗑️ Delete
            </button>
          </div>
        </>
      )}

      <CommentForm post={post} save={apply} />
    </div>
  )
}
