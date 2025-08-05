export interface Database {
  public: {
    Tables: {
      species: {
        Row: {
          id: string
          common_name_da: string
          common_name_latin: string | null
          scientific_name: string
          type: 'flora' | 'fauna'
          category: string
          native_status: boolean
          description_da: string | null
          created_by_user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          common_name_da: string
          common_name_latin?: string | null
          scientific_name: string
          type: 'flora' | 'fauna'
          category: string
          native_status?: boolean
          description_da?: string | null
          created_by_user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          common_name_da?: string
          common_name_latin?: string | null
          scientific_name?: string
          type?: 'flora' | 'fauna'
          category?: string
          native_status?: boolean
          description_da?: string | null
          created_by_user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      observations: {
        Row: {
          id: string
          species_id: string
          date_observed: string
          location_in_garden: string
          quantity: number
          growth_stage: string | null
          health_status: string
          notes: string | null
          photo_url: string | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          species_id: string
          date_observed: string
          location_in_garden: string
          quantity?: number
          growth_stage?: string | null
          health_status?: string
          notes?: string | null
          photo_url?: string | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          species_id?: string
          date_observed?: string
          location_in_garden?: string
          quantity?: number
          growth_stage?: string | null
          health_status?: string
          notes?: string | null
          photo_url?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      garden_zones: {
        Row: {
          id: string
          zone_name: string
          description: string | null
          conditions: string | null
          created_by_user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          zone_name: string
          description?: string | null
          conditions?: string | null
          created_by_user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          zone_name?: string
          description?: string | null
          conditions?: string | null
          created_by_user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_gardens: {
        Row: {
          id: string
          user_id: string
          garden_name: string
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          garden_name: string
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          garden_name?: string
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}

export type Species = Database['public']['Tables']['species']['Row']
export type SpeciesInsert = Database['public']['Tables']['species']['Insert']
export type SpeciesUpdate = Database['public']['Tables']['species']['Update']

export type Observation = Database['public']['Tables']['observations']['Row']
export type ObservationInsert = Database['public']['Tables']['observations']['Insert']
export type ObservationUpdate = Database['public']['Tables']['observations']['Update']

export type GardenZone = Database['public']['Tables']['garden_zones']['Row']
export type GardenZoneInsert = Database['public']['Tables']['garden_zones']['Insert']
export type GardenZoneUpdate = Database['public']['Tables']['garden_zones']['Update']

export type UserGarden = Database['public']['Tables']['user_gardens']['Row']
export type UserGardenInsert = Database['public']['Tables']['user_gardens']['Insert']
export type UserGardenUpdate = Database['public']['Tables']['user_gardens']['Update']

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']