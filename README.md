# CarShare - Car Image Sharing Platform

A modern, feature-rich platform for car enthusiasts to share, discover, and download high-quality car images. Built with React, TypeScript, and Supabase.

## Features

- **User Authentication**: Secure sign up and sign in with email/password
- **Image Upload**: Upload car images with metadata (name, description, category, hashtags)
- **Browse Gallery**: Discover amazing car images from the community
- **Search & Filter**: Find specific cars by name, description, or category
- **Like System**: Show appreciation for your favorite images
- **Download Options**: Download images in multiple quality settings (Original, High, Medium, Low)
- **User Dashboard**: Manage your uploaded images with detailed statistics
- **Responsive Design**: Beautiful UI that works on all devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router v6
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works great!)

### Step 1: Clone and Install

```bash
npm install
```

### Step 2: Set Up Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Wait for the database to be provisioned

### Step 3: Run Database Migrations

1. In your Supabase project, go to **SQL Editor**
2. Copy and paste the contents of `supabase-setup.sql`
3. Click **Run** to execute the migration

### Step 4: Set Up Storage

1. Go to **Storage** in your Supabase dashboard
2. Click **New Bucket**
3. Name it `car-images`
4. Make it **Public**
5. Set file size limit to **5MB**
6. Go to **SQL Editor** again
7. Copy and paste the contents of `supabase-storage-setup.sql`
8. Click **Run** to set up storage policies

### Step 5: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. In your Supabase project, go to **Settings** → **API**
3. Copy the following values to `.env.local`:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

Your `.env.local` should look like:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 6: Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see your app!

## Project Structure

```
src/
├── lib/
│   ├── supabase.ts          # Supabase client initialization
│   └── supabaseQueries.ts   # All database queries
├── components/
│   ├── auth/                # Authentication components
│   ├── home/                # Home page components
│   ├── dashboard/           # Dashboard components
│   └── common/              # Shared components
├── pages/                   # Page components
├── hooks/                   # Custom React hooks
└── types/                   # TypeScript type definitions
```

## Database Schema

### Tables

1. **profiles**: User profiles extending Supabase auth.users
   - Automatically created on signup
   - Stores username and email

2. **images**: Car image metadata
   - Links to storage and user
   - Includes category, hashtags, likes, downloads

3. **likes**: User likes for images
   - Many-to-many relationship
   - Unique constraint on user-image pairs

### Security

- **Row Level Security (RLS)** enabled on all tables
- Public viewing for images and profiles
- Authenticated users can upload and manage their own content
- Automatic triggers for profile creation and like counting

## Key Features Explained

### Authentication

- Uses Supabase Auth for secure email/password authentication
- Automatic profile creation on signup via database trigger
- Protected routes require authentication

### Image Upload

- File size limit: 5MB
- Supported formats: JPG, PNG, JPEG
- Images stored in Supabase Storage
- Metadata saved to database with public URL reference

### Search & Filter

- Real-time search across image names and descriptions
- Category filtering with 10 car categories
- Optimized queries with database indexes

### Like System

- Authenticated users can like/unlike images
- Real-time like count updates via database trigger
- Optimistic UI updates for smooth UX

### Download System

- Quality selector modal with 4 options
- Client-side image resizing using Canvas API
- Automatic download count tracking

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Check TypeScript types

## Environment Variables

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Deployment

### Build

```bash
npm run build
```

The `dist` folder contains your production-ready app.

### Deploy to Vercel, Netlify, or any static hosting

1. Build your app: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables in your hosting platform
4. Enjoy!

## Troubleshooting

### "Missing Supabase environment variables"

Make sure you've created `.env.local` and added your Supabase credentials.

### Images not uploading

1. Check that the `car-images` bucket exists and is public
2. Verify storage policies are applied (run `supabase-storage-setup.sql`)
3. Check browser console for detailed error messages

### Authentication not working

1. Verify Supabase project URL and keys are correct
2. Check that `supabase-setup.sql` has been executed
3. Ensure profile trigger is created

## License

MIT

## Support

For issues and questions, please check the troubleshooting section or contact support.
