import React, { useState } from 'react'

export default function PostForm({ onAddPost }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim())
      return alert('Title and content are required.')

    onAddPost({
      id: Date.now(),
      title,
      content,
      image: image.trim() || null,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      comments: [],
    })

    setTitle('')
    setContent('')
    setImage('')
  }

  return (
    <form onSubmit={handleSubmit} className="create-post-container">
      <h2>Create a New Post</h2>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        rows="4"
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <input
        type="url"
        placeholder="Image URL (optional)"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <button type="submit">Create Post</button>
    </form>
  )
}
