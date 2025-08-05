import React, { useState } from 'react'
import { supabase } from '../../services/supabase'
import { Species } from '../../types/database.types'
import { useAuth } from '../../contexts/AuthContext'
import da from '../../locales/da.json'

interface SpeciesFormProps {
  species?: Species
  onSave: () => void
  onCancel: () => void
}

export const SpeciesForm: React.FC<SpeciesFormProps> = ({ species, onSave, onCancel }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    common_name_da: species?.common_name_da || '',
    scientific_name: species?.scientific_name || '',
    type: species?.type || 'flora' as const,
    category: species?.category || '',
    description_da: species?.description_da || '',
    native_status: species?.native_status || false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError('Du skal være logget ind for at gemme arter')
      return
    }
    
    setLoading(true)
    setError('')

    try {
      if (species) {
        const { error } = await supabase
          .from('species')
          .update(formData)
          .eq('id', species.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('species')
          .insert([{
            ...formData,
            created_by_user_id: user.id
          }])

        if (error) throw error
      }

      onSave()
    } catch (err: any) {
      console.error('Error saving species:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getAvailableCategories = () => {
    if (formData.type === 'flora') {
      return ['tree', 'shrub', 'flower', 'grass', 'herb', 'moss', 'fern']
    } else {
      return ['bird', 'mammal', 'insect', 'spider', 'reptile', 'amphibian']
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">
          {species ? da.species.editSpecies : da.species.addNew}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {da.species.commonNameDa} *
            </label>
            <input
              type="text"
              value={formData.common_name_da}
              onChange={(e) => setFormData({ ...formData, common_name_da: e.target.value })}
              required
              placeholder="F.eks. Rødkløver"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-nature-500 focus:border-nature-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {da.species.scientificName} *
            </label>
            <input
              type="text"
              value={formData.scientific_name}
              onChange={(e) => setFormData({ ...formData, scientific_name: e.target.value })}
              required
              placeholder="F.eks. Trifolium pratense"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-nature-500 focus:border-nature-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {da.species.type} *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ 
                ...formData, 
                type: e.target.value as 'flora' | 'fauna',
                category: '' // Reset category when type changes
              })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-nature-500 focus:border-nature-500"
            >
              <option value="flora">{da.species.flora}</option>
              <option value="fauna">{da.species.fauna}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {da.species.category}
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-nature-500 focus:border-nature-500"
            >
              <option value="">Vælg kategori...</option>
              {getAvailableCategories().map((cat) => (
                <option key={cat} value={cat}>
                  {da.species.categories[cat as keyof typeof da.species.categories]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="native_status"
              checked={formData.native_status}
              onChange={(e) => setFormData({ ...formData, native_status: e.target.checked })}
              className="h-4 w-4 text-nature-600 focus:ring-nature-500 border-gray-300 rounded"
            />
            <label htmlFor="native_status" className="ml-2 block text-sm text-gray-900">
              {da.species.nativeStatus}
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {da.species.description}
            </label>
            <textarea
              value={formData.description_da}
              onChange={(e) => setFormData({ ...formData, description_da: e.target.value })}
              rows={3}
              placeholder="Beskrivelse af arten..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-nature-500 focus:border-nature-500"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-nature-600 hover:bg-nature-700 disabled:opacity-50 text-white py-2 px-4 rounded-md text-sm font-medium"
            >
              {loading ? da.common.loading : da.common.save}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md text-sm font-medium"
            >
              {da.common.cancel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}