import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../services/supabase'
import { Species, Observation } from '../types/database.types'
import da from '../locales/da.json'

export const Hjem: React.FC = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalSpecies: 0,
    totalObservations: 0,
    recentObservations: [] as (Observation & { species: Species })[]
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchDashboardData = async () => {
    if (!user) return

    try {
      // Fetch total species count
      const { count: speciesCount } = await supabase
        .from('species')
        .select('*', { count: 'exact', head: true })

      // Fetch total observations count
      const { count: observationsCount } = await supabase
        .from('observations')
        .select('*', { count: 'exact', head: true })

      // Fetch recent observations with species data
      const { data: recentObservations } = await supabase
        .from('observations')
        .select(`
          *,
          species (*)
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      setStats({
        totalSpecies: speciesCount || 0,
        totalObservations: observationsCount || 0,
        recentObservations: recentObservations || []
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nature-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">{da.dashboard.title}</h1>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">🌿</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {da.dashboard.totalSpecies}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalSpecies}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">👁️</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {da.observations.title}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalObservations}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">🦋</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Biodiversitet
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalSpecies > 0 ? 'God' : 'Start registrering'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent observations */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            {da.dashboard.recentObservations}
          </h3>
          {stats.recentObservations.length === 0 ? (
            <p className="text-gray-500">Ingen observationer endnu.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentObservations.map((observation) => (
                <div key={observation.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {observation.species?.common_name_da}
                    </p>
                    <p className="text-sm text-gray-500">
                      {observation.location_in_garden} • {new Date(observation.date_observed).toLocaleDateString('da-DK')}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {observation.quantity} stk
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}