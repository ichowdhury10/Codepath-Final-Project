import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import './Profile.css'

export default function Profile() {
  const { user, logout } = useAuth()

  if (!user) {
    return <p>You need to log in to see your profile.</p>
  }

  return (
    <div className="profile-card">
      <h2>Welcome, {user.email}</h2>
      <button onClick={logout} className="btn-logout">
        Log Out
      </button>
    </div>
  )
}
