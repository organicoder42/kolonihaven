# Kolonihaven App - Setup Guide

## Oversigt
Dette er en React-baseret web app til at tracke flora og fauna i din have med multi-bruger support og dansk brugergrænseflade.

## Tech Stack
- React 18 med TypeScript
- Supabase (PostgreSQL database, authentication, storage)
- Tailwind CSS for styling
- React Router for navigation
- React Query for data fetching
- Chart.js for data visualization

## Hurtig Start

### 1. Installer Dependencies
```bash
npm install
```

### 2. Supabase Setup

1. Gå til [supabase.com](https://supabase.com) og opret en ny konto
2. Opret et nyt projekt
3. I Project Settings → API, find din:
   - Project URL
   - Anon/public key

### 3. Miljøvariabler
1. Kopier `.env.example` til `.env`
2. Udfyld din Supabase credentials:
```bash
REACT_APP_SUPABASE_URL=din_supabase_url
REACT_APP_SUPABASE_ANON_KEY=din_supabase_anon_key
```

### 4. Database Setup
1. I Supabase dashboard, gå til SQL Editor
2. Kopier og kør indholdet af `database-schema.sql`
3. Dette opretter alle nødvendige tabeller med Row Level Security policies

### 5. Start Udviklingsserver
```bash
npm start
```

Appen vil køre på `http://localhost:3000`

## Database Schema

### Tabeller:
- **profiles** - Brugerprofiler (navn, avatar)
- **user_gardens** - Haver tilknyttet brugere
- **garden_zones** - Zoner i haven (sol/skygge, jordtype)
- **species** - Arter kataloget (flora/fauna)
- **observations** - Observationer med dato, placering, mængde

### Row Level Security (RLS)
Alle tabeller har RLS aktiveret:
- Brugere kan kun redigere deres egne profiler og haver
- Arter og observationer deles mellem alle brugere
- Kun ejeren kan slette/redigere deres egne data

## Funktioner

### Autentificering
- Email/password login og registrering
- Beskyttede ruter
- Automatisk profiloprettelse

### Artskatelog
- Tilføj arter med dansk og latinsk navn
- Kategorisering (træer, buske, blomster, fugle, etc.)
- Markering som hjemmehørende/ikke-hjemmehørende

### Observationer
- Log observationer med dato og placering
- Upload fotos (kræver Supabase Storage setup)
- Notater og sundhedsstatus

### Dashboard
- Oversigt over total arter og observationer
- Seneste observationer
- Biodiversitetsmetrikker

### Multi-bruger Support
- Delt have mellem brugere
- Filtrer efter bruger ("Mine" vs "Alle" observationer)
- Brugerprofiler med navne

## Næste Skridt

### Tilføj Foto Upload (Valgfrit)
1. I Supabase dashboard, gå til Storage
2. Opret en bucket kaldet 'observation-photos'
3. Sæt bucket policies for public læsning og authenticated upload

### Udvid Funktionalitet
- Implementer andre sider (Arter, Observationer, Zoner, Indsigter)
- Tilføj charts og datavisualisering
- Integrer med eksterne APIs (iNaturalist, GBIF)
- Tilføj push notifikationer

## Fejlfinding

### Almindelige Problemer
1. **Supabase Connection Error**: Tjek at miljøvariabler er sat korrekt
2. **RLS Errors**: Sørg for at database schema er kørt korrekt
3. **Build Errors**: Sørg for at alle dependencies er installeret

### Development Commands
```bash
npm start      # Start development server
npm run build  # Build for production
npm test       # Run tests
```

## Bidrag
Dette er et personligt projekt, men du er velkommen til at forke og tilpasse til dine egne behov.

## Licens
MIT License