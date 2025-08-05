import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import da from '../../locales/da.json'

interface SignupFormProps {
  onToggleMode: () => void
}

export const SignupForm: React.FC<SignupFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    console.log('Starting signup process...', { email, fullName })

    if (password !== confirmPassword) {
      setError('Kodeordene matcher ikke')
      setLoading(false)
      return
    }

    try {
      const { error } = await signUp(email, password, fullName)

      if (error) {
        console.error('Signup error:', error)
        setError(error.message)
      } else {
        console.log('Signup successful!')
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('Der opstod en uventet fejl')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-nature-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {da.auth.signupTitle}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="fullName" className="sr-only">
                {da.auth.fullName}
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-nature-500 focus:border-nature-500 focus:z-10 sm:text-sm"
                placeholder={da.auth.fullName}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                {da.auth.email}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-nature-500 focus:border-nature-500 focus:z-10 sm:text-sm"
                placeholder={da.auth.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                {da.auth.password}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-nature-500 focus:border-nature-500 focus:z-10 sm:text-sm"
                placeholder={da.auth.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                {da.auth.confirmPassword}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-nature-500 focus:border-nature-500 focus:z-10 sm:text-sm"
                placeholder={da.auth.confirmPassword}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-nature-600 hover:bg-nature-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nature-500 disabled:opacity-50"
            >
              {loading ? da.common.loading : da.auth.signup}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={onToggleMode}
              className="font-medium text-nature-600 hover:text-nature-500"
            >
              {da.auth.alreadyHaveAccount} {da.auth.login}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}