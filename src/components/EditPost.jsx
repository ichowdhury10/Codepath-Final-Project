// src/components/EditPost.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function EditPost() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    const posts = JSON.parse(localStorage.getItem('posts')) || []
    const foundPost = posts.find((post) => post.id === parseInt(id))
    if (foundPost) {
      setPost(foundPost)
      setTitle(foundPost.title)
      setContent(foundPost.content)
    }
  }, [id])

  const handleSave = () => {
    const posts = JSON.parse(localStorage.getItem('posts')) || []
    const updatedPosts = posts.map((post) =>
      post.id === parseInt(id) ? { ...post, title, content } : post
    )
    localStorage.setItem('posts', JSON.stringify(updatedPosts))
    navigate('/') // Redirect to the feed page
  }

  if (!post) return <div>Post not found!</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSave()
        }}
        className="space-y-4"
      >
        <div className="mb-4">
          <label htmlFor="title" className="block font-medium">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block font-medium">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border rounded-md shadow-sm"
            rows="5"
          />
        </div>
        <button
          type="submit"
          className="btn btn-success w-full py-3 text-white font-bold rounded-md shadow-lg"
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}

export default EditPost
