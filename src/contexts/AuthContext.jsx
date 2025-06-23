import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

// 1) Create context
const AuthContext = createContext(null)

// 2) Export a hook for consuming it
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an <AuthProvider>')
  }
  return ctx
}

// 3) Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // initial session fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // subscribe to changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signup = (email, password) => supabase.auth.signUp({ email, password })

  const login = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const logout = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
