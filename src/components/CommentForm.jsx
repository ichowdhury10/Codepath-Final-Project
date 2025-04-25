import React, { useState } from 'react'

export default function CommentForm({ post, save }) {
  const [text, setText] = useState('')

  const handle = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    save({ ...post, comments: [...post.comments, text] })
    setText('')
  }

  return (
    <form onSubmit={handle} className="comment-form">
      <h3>Comments</h3>
      {post.comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        post.comments.map((c, i) => (
          <p key={i} className="comment">
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
