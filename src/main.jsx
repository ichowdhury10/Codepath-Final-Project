// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { AuthProvider } from './contexts/AuthContext'

const root = ReactDOM.createRoot(document.getElementById('app'))
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)
