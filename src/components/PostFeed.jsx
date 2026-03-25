import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { supabase } from '../supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import './PostFeed.css'

export default function PostFeed() {
  const { user } = useAuth()

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [showCreate, setShowCreate] = useState(false)

  // Create form state
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setPosts(data || [])
    setLoading(false)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    setSubmitting(true)

    const { error } = await supabase.from('posts').insert({
      title: title.trim(),
      content: content.trim(),
      image_url: imageUrl.trim() || null,
      upvotes: 0,
      downvotes: 0,
      comments: [],
      owner: user.id,
    })

    if (!error) {
      setTitle('')
      setContent('')
      setImageUrl('')
      setShowCreate(false)
      fetchPosts()
    }
    setSubmitting(false)
  }

  const handleVote = async (post, field) => {
    const newVal = post[field] + 1
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, [field]: newVal } : p))
    )
    await supabase
      .from('posts')
      .update({ [field]: newVal })
      .eq('id', post.id)
  }

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post?')) return
    setPosts((prev) => prev.filter((p) => p.id !== postId))
    await supabase.from('posts').delete().eq('id', postId)
  }

  // Filter + sort
  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const displayed = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.created_at) - new Date(b.created_at)
      case 'upvotes':
        return b.upvotes - a.upvotes
      case 'downvotes':
        return b.downvotes - a.downvotes
      default:
        return new Date(b.created_at) - new Date(a.created_at)
    }
  })

  return (
    <div className="feed-container">
      {/* Toolbar */}
      <div className="feed-toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search posts…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="upvotes">Top</option>
          <option value="downvotes">Controversial</option>
        </select>
        <button
          className="btn-new-post"
          onClick={() => setShowCreate((v) => !v)}
        >
          {showCreate ? 'Cancel' : '+ New Post'}
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="create-card">
          <h3>Create a Post</h3>
          <form onSubmit={handleCreate}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              rows={5}
              placeholder="Write your content… (Markdown supported)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <input
              type="url"
              placeholder="Image URL (optional)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            {content && (
              <div className="md-preview">
                <p className="preview-label">Preview</p>
                <div className="preview-box">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={!title.trim() || !content.trim() || submitting}
            >
              {submitting ? 'Posting…' : 'Post'}
            </button>
          </form>
        </div>
      )}

      {/* Feed */}
      {loading ? (
        <div className="feed-state">Loading posts…</div>
      ) : displayed.length === 0 ? (
        <div className="feed-state">
          {searchQuery
            ? 'No posts match your search.'
            : 'No posts yet — be the first to post!'}
        </div>
      ) : (
        <div className="feed-list">
          {displayed.map((post) => (
            <div key={post.id} className="post-card">
              {/* Vote column */}
              <div className="vote-col">
                <button
                  className="vote-btn up"
                  onClick={() => handleVote(post, 'upvotes')}
                  aria-label="Upvote"
                >
                  ▲
                </button>
                <span className="vote-score">
                  {post.upvotes - post.downvotes}
                </span>
                <button
                  className="vote-btn down"
                  onClick={() => handleVote(post, 'downvotes')}
                  aria-label="Downvote"
                >
                  ▼
                </button>
              </div>

              {/* Content */}
              <div className="post-body">
                <Link to={`/post/${post.id}`} className="post-title">
                  {post.title}
                </Link>
                <div className="post-meta">
                  <span>
                    {new Date(post.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="meta-dot">·</span>
                  <span>
                    {(post.comments || []).length} comment
                    {(post.comments || []).length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="post-excerpt">
                  <ReactMarkdown>
                    {post.content.length > 200
                      ? post.content.slice(0, 200) + '…'
                      : post.content}
                  </ReactMarkdown>
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className="tag-row">
                    {post.tags.map((tag, i) => (
                      <span key={i} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {user?.id === post.owner && (
                  <button
                    className="btn-delete-inline"
                    onClick={() => handleDelete(post.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
