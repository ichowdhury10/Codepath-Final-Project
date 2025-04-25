import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function PostFeed({ posts }) {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('createdAt') // or 'upvotes'

  // filter + sort
  let filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )
  filtered.sort((a, b) => {
    if (sortBy === 'upvotes') return b.upvotes - a.upvotes
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  return (
    <div>
      {/* search + sort */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search by title…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="createdAt">Newest</option>
          <option value="upvotes">Most Upvoted</option>
        </select>
      </div>

      {/* feed */}
      {filtered.length === 0 && <p>No posts found.</p>}
      <div className="space-y-4">
        {filtered.map((post) => (
          <div key={post.id} className="card">
            <small>{new Date(post.createdAt).toLocaleString()}</small>
            <Link to={`/post/${post.id}`} className="post-link">
              <h3>{post.title}</h3>
            </Link>
            <p>👍 {post.upvotes}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
