import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Layout } from './components/Layout'
import { AuthPage } from './components/auth/AuthPage'
import { Hjem } from './pages/Hjem'
import { Arter } from './pages/Arter'

const queryClient = new QueryClient()

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nature-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-nature-600"></div>
      </div>
    )
  }

  if (!user) {
    return <AuthPage />
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Hjem />} />
        <Route path="/arter" element={<Arter />} />
        <Route path="/observationer" element={<div>Observationer page - Coming soon</div>} />
        <Route path="/zoner" element={<div>Zoner page - Coming soon</div>} />
        <Route path="/indsigter" element={<div>Indsigter page - Coming soon</div>} />
      </Routes>
    </Layout>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
