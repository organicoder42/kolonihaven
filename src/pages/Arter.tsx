import React, { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import { Species } from '../types/database.types'
import { SpeciesForm } from '../components/species/SpeciesForm'
import da from '../locales/da.json'

export const Arter: React.FC = () => {
  const [species, setSpecies] = useState<Species[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSpecies, setEditingSpecies] = useState<Species | null>(null)
  const [filter, setFilter] = useState<'all' | 'flora' | 'fauna'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchSpecies()
  }, [])

  const fetchSpecies = async () => {
    try {
      const { data, error } = await supabase
        .from('species')
        .select('*')
        .order('common_name_da')

      if (error) throw error
      setSpecies(data || [])
    } catch (error) {
      console.error('Error fetching species:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (species: Species) => {
    setEditingSpecies(species)
    setShowForm(true)
  }

  const handleDelete = async (speciesId: string) => {
    if (!window.confirm('Er du sikker på, at du vil slette denne art?')) return

    try {
      const { error } = await supabase
        .from('species')
        .delete()
        .eq('id', speciesId)

      if (error) throw error
      fetchSpecies()
    } catch (error) {
      console.error('Error deleting species:', error)
    }
  }

  const handleFormSave = () => {
    setShowForm(false)
    setEditingSpecies(null)
    fetchSpecies()
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingSpecies(null)
  }

  const filteredSpecies = species.filter(s => {
    const matchesFilter = filter === 'all' || s.type === filter
    const matchesSearch = s.common_name_da.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.scientific_name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nature-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{da.species.title}</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-nature-600 hover:bg-nature-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          {da.species.addNew}
        </button>
      </div>

      {/* Search and filter */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <input
          type="text"
          placeholder={da.common.search + '...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-nature-500 focus:border-nature-500"
        />
        
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'all' 
                ? 'bg-nature-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Alle
          </button>
          <button
            onClick={() => setFilter('flora')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'flora' 
                ? 'bg-nature-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {da.species.flora}
          </button>
          <button
            onClick={() => setFilter('fauna')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'fauna' 
                ? 'bg-nature-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {da.species.fauna}
          </button>
        </div>
      </div>

      {/* Species grid */}
      {filteredSpecies.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {searchTerm ? 'Ingen arter matcher din søgning.' : 'Ingen arter endnu. Tilføj den første!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpecies.map((species) => (
            <div key={species.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {species.common_name_da}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    species.type === 'flora' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {species.type === 'flora' ? da.species.flora : da.species.fauna}
                  </span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(species)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {da.common.edit}
                    </button>
                    <button
                      onClick={() => handleDelete(species.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      {da.common.delete}
                    </button>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 italic mb-2">
                {species.scientific_name}
              </p>
              
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-gray-500">{da.species.category}:</span>
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {species.category}
                </span>
              </div>
              
              {species.native_status && (
                <div className="flex items-center space-x-1">
                  <span className="text-green-600">🌿</span>
                  <span className="text-sm text-green-600 font-medium">
                    {da.species.nativeStatus}
                  </span>
                </div>
              )}
              
              {species.description_da && (
                <p className="text-sm text-gray-600 mt-2">
                  {species.description_da}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Species Form Modal */}
      {showForm && (
        <SpeciesForm
          species={editingSpecies || undefined}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  )
}