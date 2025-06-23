// src/components/PostFeed.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { supabase } from '../supabaseClient'
import './PostFeed.css'

export default function PostFeed() {
  const [posts, setPosts] = useState([])
  const [searchQuery, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  // fetch initial posts
  useEffect(() => {
    const load = async () => {
      let { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('createdAt', { ascending: false })
      if (error) console.error(error)
      else setPosts(data)
    }
    load()
  }, [])

  // subscribe to realtime INSERTS & UPDATES
  useEffect(() => {
    const subscription = supabase
      .from('posts')
      .on('INSERT', (payload) => {
        setPosts((ps) => [payload.new, ...ps])
      })
      .on('UPDATE', (payload) => {
        setPosts((ps) =>
          ps.map((p) => (p.id === payload.new.id ? payload.new : p))
        )
      })
      .subscribe()

    return () => {
      supabase.removeSubscription(subscription)
    }
  }, [])

  // helpers
  const persistUpdate = async (id, changes) => {
    const { error } = await supabase.from('posts').update(changes).eq('id', id)
    if (error) console.error(error)
    // real-time listener will update state for us
  }

  const handleUpvote = (id) =>
    persistUpdate(id, { upvotes: supabase.literal('upvotes + 1') })
  const handleDownvote = (id) =>
    persistUpdate(id, { downvotes: supabase.literal('downvotes + 1') })

  const handleDelete = async (id) => {
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) console.error(error)
    // real-time listener will remove it for us
  }

  // filter & sort
  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const displayed = [...filtered].sort((a, b) => {
    const da = new Date(a.createdAt),
      db = new Date(b.createdAt)
    switch (sortBy) {
      case 'oldest':
        return da - db
      case 'upvotes':
        return b.upvotes - a.upvotes
      case 'downvotes':
        return b.downvotes - a.downvotes
      case 'newest':
      default:
        return db - da
    }
  })

  return (
    <div className="postfeed-container">
      {/* search + sort */}
      <div className="search-sort">
        <input
          type="text"
          placeholder="🔍 Search posts by title…"
          value={searchQuery}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="upvotes">Top upvoted</option>
          <option value="downvotes">Top downvoted</option>
        </select>
      </div>

      {/* feed */}
      <h2>Your Feed</h2>
      <div className="feed-list">
        {displayed.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <Link to={`/post/${post.id}`} className="post-title">
                {post.title}
              </Link>
              <span className="post-date">
                {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="post-content">
              <ReactMarkdown>
                {post.content.length > 200
                  ? post.content.slice(0, 200) + '…'
                  : post.content}
              </ReactMarkdown>
            </div>

            <div className="vote-buttons">
              <button
                onClick={() => handleUpvote(post.id)}
                className="btn-upvote"
              >
                👍 {post.upvotes}
              </button>
              <button
                onClick={() => handleDownvote(post.id)}
                className="btn-downvote"
              >
                👎 {post.downvotes}
              </button>
            </div>

            <button
              onClick={() => handleDelete(post.id)}
              className="btn-delete"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
