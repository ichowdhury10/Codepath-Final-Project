import React, { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import './CreateCard.css'

export default function CreateCard({ onNewPost }) {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    setLoading(true)
    setError('')

    let imageUrl = ''
    if (file) {
      // 1) Upload to storage
      const path = `public/${Date.now()}_${file.name}`
      const { data, error: upErr } = await supabase.storage
        .from('post_images')
        .upload(path, file)
      if (upErr) {
        setError('Image upload failed')
        setLoading(false)
        return
      }
      // 2) Get public URL
      const { publicURL } = supabase.storage
        .from('post_images')
        .getPublicUrl(data.path)
      imageUrl = publicURL
    }

    // 3) Insert post row
    const { error: insErr } = await supabase.from('posts').insert([
      {
        title,
        content,
        image: imageUrl,
        owner: user.id,
        createdAt: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
      },
    ])
    if (insErr) {
      setError('Could not create post')
    } else {
      // parent can re-fetch or rely on real-time
      onNewPost && onNewPost()
      setTitle('')
      setContent('')
      setFile(null)
    }

    setLoading(false)
  }

  return (
    <div className="create-card">
      <h2>New Post</h2>
      {error && <p className="create-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          rows={3}
          placeholder="Content…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>
          {loading ? 'Posting…' : 'Create Post'}
        </button>
      </form>
    </div>
  )
}
