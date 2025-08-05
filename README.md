# 🌱 Kolonihaven - Garden Flora & Fauna Tracker

En React web app til at tracke flora og fauna i din have med multi-bruger support og dansk brugergrænseflade.

## ✨ Funktioner

- **🔐 Multi-bruger autentificering** - Sikker login/registrering med Supabase Auth
- **🌿 Artskatalog** - Registrer og administrer arter med danske og videnskabelige navne
- **👁️ Observationslog** - Log daglige observationer med dato, placering og fotos
- **📊 Dashboard** - Oversigt over biodiversitet og seneste aktivitet
- **🌍 Havezoner** - Organiser din have i forskellige zoner med forskellige forhold
- **📈 Indsigter** - Biodiversitetsanalyse og forslag til forbedringer
- **🇩🇰 Dansk interface** - Komplet dansk brugergrænseflade

## 🚀 Hurtig Start

### Forudsætninger
- Node.js 16+ og npm
- Supabase konto

### Installation

1. **Installer dependencies**
   ```bash
   npm install
   ```

2. **Opsæt Supabase**
   - Opret projekt på [supabase.com](https://supabase.com)
   - Kør SQL schema fra `database-schema.sql` i SQL Editor
   - Kopier Project URL og anon key

3. **Miljøvariabler**
   ```bash
   cp .env.example .env
   # Udfyld med dine Supabase credentials
   ```

4. **Start udviklingsserver**
   ```bash
   npm start
   ```

Se `SETUP.md` for detaljeret opsætningsguide.

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State**: React Query
- **Charts**: Chart.js

## 📱 Mobile-first Design

Appen er designet mobile-first for optimal brug i haven på telefon eller tablet.

## 🗃️ Database Schema

- **profiles** - Brugerprofiler
- **species** - Artskataloget (delt mellem brugere)
- **observations** - Observationer med bruger-tilknytning
- **garden_zones** - Havezoner
- **user_gardens** - Haver (til fremtidig multi-have support)

## 🔒 Sikkerhed

- Row Level Security (RLS) på alle tabeller
- Brugere kan kun redigere deres egne data
- Arter og observationer deles læsevenligt mellem brugere

## 🚧 Udviklingsstatus

**Implementeret:**
- ✅ Autentificering og brugerstyring
- ✅ Dashboard med grundlæggende statistikker
- ✅ Artskatalog visning med søgning og filtrering
- ✅ Responsive design med dansk UI

**Kommende funktioner:**
- 📝 CRUD operationer for arter
- 🔍 Observation logging system
- 📊 Charts og datavisualisering
- 📷 Foto upload til observationer
- 🗺️ Interaktivt havekort
- 🌐 Integration med eksterne APIs (iNaturalist, GBIF)

## Available Scripts

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm test`
Launches the test runner in interactive watch mode.

## 📄 Licens

MIT License - fri til personlig brug og tilpasning.

## 🤝 Bidrag

Dette er et personligt projekt, men du er velkommen til at forke og tilpasse til dine egne behov.

---

**Happy gardening! 🌸🦋**
