import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../services/supabase'
import { Profile } from '../types/database.types'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...')
        const { data: { session }, error } = await supabase.auth.getSession()
        console.log('Initial session:', session, 'error:', error)
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          console.log('User found, fetching profile...')
          // Set a timeout for profile fetching to prevent hanging
          const profilePromise = fetchProfile(session.user.id)
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
          )
          
          try {
            await Promise.race([profilePromise, timeoutPromise])
          } catch (error) {
            console.error('Profile fetch failed or timed out:', error)
            // Continue without profile
          }
        } else {
          console.log('No user session found')
        }
        
        console.log('Auth initialization complete')
        setLoading(false)
      } catch (error) {
        console.error('Error initializing auth:', error)
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id)
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Add timeout for profile fetching in auth state change too
          const profilePromise = fetchProfile(session.user.id)
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
          )
          
          try {
            await Promise.race([profilePromise, timeoutPromise])
          } catch (error) {
            console.error('Profile fetch failed or timed out:', error)
          }
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId)
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        console.log('Profile not found, creating new profile...')
        
        const { data: userData } = await supabase.auth.getUser()
        const fullName = userData.user?.user_metadata?.full_name || 'New User'
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              user_id: userId,
              full_name: fullName,
            }
          ])
          .select()
          .single()

        if (createError) {
          console.error('Error creating profile:', createError)
          setProfile(null)
          return
        }

        console.log('Profile created successfully:', newProfile)
        setProfile(newProfile)
        return
      }

      if (error) {
        console.error('Error fetching profile:', error)
        setProfile(null)
        return
      }

      console.log('Profile fetched successfully:', data)
      setProfile(data)
    } catch (error) {
      console.error('Error in fetchProfile:', error)
      setProfile(null)
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log('Calling Supabase signUp...', { email, fullName })
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      })

      console.log('Supabase signUp response:', { data, error })

      if (error) return { error }

      // Don't create profile here - let the auth state change handler do it
      // or create it after the user is properly authenticated
      console.log('User registration successful, profile will be created on login')

      return { error: null }
    } catch (error) {
      console.error('SignUp catch error:', error)
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)

      if (!error) {
        setProfile(prev => prev ? { ...prev, ...updates } : null)
      }

      return { error }
    } catch (error) {
      return { error }
    }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}