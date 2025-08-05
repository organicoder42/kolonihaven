-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Create profiles table
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id)
);

-- Create user_gardens table
CREATE TABLE user_gardens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  garden_name TEXT NOT NULL,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create garden_zones table
CREATE TABLE garden_zones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  zone_name TEXT NOT NULL,
  description TEXT,
  conditions TEXT, -- JSON string for sun/shade, soil type, moisture
  created_by_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create species table
CREATE TABLE species (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  common_name_da TEXT NOT NULL,
  common_name_latin TEXT,
  scientific_name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('flora', 'fauna')),
  category TEXT NOT NULL, -- træ, busk, blomst, insekt, fugl, etc.
  native_status BOOLEAN DEFAULT false,
  description_da TEXT,
  created_by_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create observations table
CREATE TABLE observations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  species_id UUID REFERENCES species(id) ON DELETE CASCADE NOT NULL,
  date_observed DATE NOT NULL,
  location_in_garden TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  growth_stage TEXT, -- spire, ung, moden, blomstrende, etc.
  health_status TEXT DEFAULT 'good', -- excellent, good, fair, poor, dead
  notes TEXT,
  photo_url TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_gardens ENABLE ROW LEVEL SECURITY;
ALTER TABLE garden_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE species ENABLE ROW LEVEL SECURITY;
ALTER TABLE observations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_gardens (users can see shared gardens)
CREATE POLICY "Users can view shared gardens" ON user_gardens FOR SELECT USING (true);
CREATE POLICY "Users can update own gardens" ON user_gardens FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own gardens" ON user_gardens FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own gardens" ON user_gardens FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for garden_zones (shared between users)
CREATE POLICY "Users can view all zones" ON garden_zones FOR SELECT USING (true);
CREATE POLICY "Users can update own zones" ON garden_zones FOR UPDATE USING (auth.uid() = created_by_user_id);
CREATE POLICY "Users can insert zones" ON garden_zones FOR INSERT WITH CHECK (auth.uid() = created_by_user_id);
CREATE POLICY "Users can delete own zones" ON garden_zones FOR DELETE USING (auth.uid() = created_by_user_id);

-- RLS Policies for species (shared between users)
CREATE POLICY "Users can view all species" ON species FOR SELECT USING (true);
CREATE POLICY "Users can update own species" ON species FOR UPDATE USING (auth.uid() = created_by_user_id);
CREATE POLICY "Users can insert species" ON species FOR INSERT WITH CHECK (auth.uid() = created_by_user_id);
CREATE POLICY "Users can delete own species" ON species FOR DELETE USING (auth.uid() = created_by_user_id);

-- RLS Policies for observations (shared between users)
CREATE POLICY "Users can view all observations" ON observations FOR SELECT USING (true);
CREATE POLICY "Users can update own observations" ON observations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert observations" ON observations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own observations" ON observations FOR DELETE USING (auth.uid() = user_id);

-- Functions to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_user_gardens_updated_at BEFORE UPDATE ON user_gardens FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_garden_zones_updated_at BEFORE UPDATE ON garden_zones FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_species_updated_at BEFORE UPDATE ON species FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_observations_updated_at BEFORE UPDATE ON observations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_species_type ON species(type);
CREATE INDEX idx_species_category ON species(category);
CREATE INDEX idx_species_native_status ON species(native_status);
CREATE INDEX idx_observations_user_id ON observations(user_id);
CREATE INDEX idx_observations_species_id ON observations(species_id);
CREATE INDEX idx_observations_date_observed ON observations(date_observed);
CREATE INDEX idx_garden_zones_created_by_user_id ON garden_zones(created_by_user_id);

-- Insert some sample data (optional)
-- INSERT INTO species (common_name_da, scientific_name, type, category, native_status, created_by_user_id) VALUES
-- ('Almindelig Røn', 'Sorbus aucuparia', 'flora', 'træ', true, '00000000-0000-0000-0000-000000000000'),
-- ('Hvid Kløver', 'Trifolium repens', 'flora', 'blomst', true, '00000000-0000-0000-0000-000000000000'),
-- ('Solsort', 'Turdus merula', 'fauna', 'fugl', true, '00000000-0000-0000-0000-000000000000');