# Lynk App Documentation & Architecture

## Overview
Lynk is a dual-purpose social connection platform designed for young adults, students, and professionals seeking meaningful relationships, whether platonic or romantic. It serves two user types: "Friends" mode and "Dating" mode.

## Project Structure
The application is built using React Native, Expo (with Expo Router), Firebase, and Supabase.

```
LYNK/
├── app/                      # Application routes (Expo Router)
│   ├── (tabs)/               # Bottom tab navigation (Discover, Clubs, Matches, Profile)
│   ├── clubs/                # Club-specific screens (Chat, Create, Details)
│   ├── index.tsx             # Entry point / Splash
│   ├── login.tsx             # Authentication & Investor Mode entry
│   └── profile-setup.tsx     # Onboarding & Profile creation
├── assets/                   # Static assets (fonts, images)
├── components/               # Reusable UI components
├── constants/                # App-wide constants (colors, layout)
├── hooks/                    # Custom React hooks
├── styles/                   # Centralized stylesheets
├── supabase/                 # Supabase configuration & migrations
│   └── migrations/           # SQL scripts for database schema
└── utils/                    # Utility functions
    ├── lynkData.ts           # Data access layer (handles Investor Mode separation)
    ├── lynkTypes.ts          # TypeScript type definitions
    ├── lynkPrototypeData.ts  # Demo/mock data for investors
    └── supabaseUtils.ts      # Supabase data mutators
```

## Architecture & Technology Stack
- **Frontend Framework**: Expo (React Native) utilizing Expo Router for file-based routing.
- **Authentication**: Firebase Authentication. It uses Email/Password and OTP flows. AsyncStorage is used to persist authentication sessions across restarts.
- **Database & Storage**: Supabase (PostgreSQL). We moved from Firebase Firestore to Supabase to leverage advanced relational schemas, PostGIS for location-based matching, and Row Level Security (RLS).
- **Investor Demo Mode**: A specialized environment flag (`lynk.isInvestorMode` in AsyncStorage) allows investors to bypass login and view high-fidelity mock data, separating them from the live production database.
- **PWA Capabilities**: Expo provides a web output that is Progressive Web App (PWA) compatible, meaning the application can be accessed via the browser and downloaded to the user's home screen.

## Security & Best Practices
1. **Row Level Security (RLS)**: Supabase RLS is strictly enabled across all tables (`profiles`, `clubs`, `messages`, etc.). Users can only query, insert, and update their own authorized data.
2. **Data Validation**: 
   - Age restrictions are enforced at the database level (`check (date_of_birth <= (current_date - interval '18 years'))` for dating intent).
   - Messages and uploads are bounded to prevent abuse (e.g., maximum 5MB image size, maximum message length).
3. **Environment Variables**: Sensitive keys (Supabase URL, Anon Key, Firebase Config) are stored in `.env.local` and are safely isolated.

## Recent Architectural Evolutions
- **Universities to Occupations**: Upgraded the `university` field to `occupation` to open the platform beyond students.
- **Group Memberships & Chat**: Extended the clubs schema to include robust `club_members` and `club_messages` tables with role-based moderation.
- **Investor Isolation**: Deeply partitioned real data from static mock data to keep production clean.
