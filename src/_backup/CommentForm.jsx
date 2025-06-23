import React, { useState } from 'react'

export default function CommentForm({ post, save }) {
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    save({ ...post, comments: [...post.comments, text] })
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <h3>Comments</h3>
      {post.comments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        post.comments.map((c, i) => (
          <p key={i} className="comment-item">
            {c}
          </p>
        ))
      )}
      <textarea
        rows="3"
        placeholder="Add a comment"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">Comment</button>
    </form>
  )
}
