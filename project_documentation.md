# LYNK - PWA Social App

LYNK is a progressive web app (PWA) and mobile application designed to connect university students through social profiles, club activities, and real-time chat. The application leverages a dual-stack architecture to maximize reliability and performance.

## Technology Stack
- **Frontend Framework:** Expo (React Native) with Expo Router for navigation.
- **UI Design:** Custom styling using `StyleSheet`, built with a premium aesthetic targeting deep user engagement. Icons by Phosphor Icons.
- **Authentication:** Firebase Authentication (Handles secure user registration, login, and sessions).
- **Database & Storage:** Supabase (Handles user profiles, profile imagery storage, club details, and real-time group chat).
- **Deployment & PWA:** Configured via `app.json` for web export (`web.output: static`, `web.bundler: metro`), allowing the app to run perfectly in the browser and be installed as a PWA.

## Architecture

### 1. Dual-Stack System
LYNK employs **Firebase** for handling all authentication aspects due to its robust and easy-to-implement SDK. However, all core data functionality (such as profiles, groups, and real-time messaging) has been migrated to **Supabase** (PostgreSQL) to take advantage of its powerful relational queries and integrated real-time websocket features.

### 2. Core Features
- **User Authentication:** Email/Password authentication.
- **Profile Management:** Users complete their profile (name, bio, photo) upon first sign-in. Photos are uploaded to Supabase Storage and linked to the `profiles` table.
- **Dating / Discover Tab:** A tinder-like swiping interface powered by `react-native-deck-swiper`, fetching active profiles from Supabase.
- **Clubs & Groups:** 
  - View all active clubs.
  - Create new clubs.
  - View club details, member count, and join clubs.
  - Participate in real-time group chats specific to each club, powered by Supabase realtime subscriptions.

## Database Schema (Supabase)

The core tables in Supabase include:

1. **`profiles`**
   - `id` (UUID, primary key, matches Firebase UID)
   - `display_name` (Text)
   - `bio` (Text)
   - `photo_url` (Text)
   - `created_at` (Timestamp)

2. **`clubs`**
   - `id` (UUID, primary key)
   - `name` (Text)
   - `description` (Text)
   - `category` (Text)
   - `owner_id` (UUID, foreign key to profiles)
   - `member_count` (Integer)
   - `created_at` (Timestamp)

3. **`club_members`**
   - `id` (UUID, primary key)
   - `club_id` (UUID, foreign key to clubs)
   - `user_id` (UUID, foreign key to profiles)
   - `joined_at` (Timestamp)

4. **`club_messages`**
   - `id` (UUID, primary key)
   - `club_id` (UUID, foreign key to clubs)
   - `user_id` (UUID, foreign key to profiles)
   - `content` (Text)
   - `created_at` (Timestamp)

*Row Level Security (RLS) is enabled on all tables to ensure users can only modify their own data while allowing authenticated users to read public profiles and club information.*

## Setup & Running Locally

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env.local` file in the root with your Firebase and Supabase credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```
   *Note: Firebase configuration is stored in `firebaseConfig.ts`.*

3. **Run the App:**
   ```bash
   npx expo start
   ```
   Press `w` to open in the web browser (PWA environment).

## PWA Capabilities
The app is fully configured to run as a Progressive Web App. 
- It includes a `manifest.json` generation via Expo.
- It can be installed directly from the browser on desktop and mobile.
- To build the PWA for production deployment, run:
  ```bash
  npx expo export
  ```
  The output in the `dist` folder can be deployed to Vercel, Netlify, or any static hosting provider.
