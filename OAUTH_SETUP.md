# OAuth Login Setup Guide

This application now uses OAuth authentication via Supabase Auth. Follow these steps to configure OAuth providers.

## 1. Configure OAuth Providers in Supabase

### Google OAuth Setup

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Enable **Google** provider
4. You'll need to:
   - Create a project in [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
   - Copy the Client ID and Client Secret to Supabase

### GitHub OAuth Setup

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **GitHub** provider
3. You'll need to:
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Create a new OAuth App
   - Set Authorization callback URL: `https://your-project.supabase.co/auth/v1/callback`
   - Copy the Client ID and Client Secret to Supabase

### Facebook OAuth Setup

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Facebook** provider
3. You'll need to:
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a new app
   - Add Facebook Login product
   - Set Valid OAuth Redirect URIs: `https://your-project.supabase.co/auth/v1/callback`
   - Copy the App ID and App Secret to Supabase

## 2. Update Redirect URLs

Make sure your Supabase project has the correct redirect URLs configured:

1. Go to **Authentication** → **URL Configuration**
2. Add your site URL (e.g., `http://localhost:3000` for development)
3. Add redirect URL: `http://localhost:3000/auth/callback` (for development)
4. For production, add your production URLs

## 3. Database Schema Update

The application automatically creates user profiles in the `users` table when a user signs in for the first time. Make sure your `users` table has the following structure:

```sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,  -- This will be the Supabase Auth user ID
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  credits INTEGER DEFAULT 10,  -- Default credits for new users
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 4. How It Works

1. User clicks "Continue with Google/GitHub/Facebook" on the login page
2. They are redirected to the OAuth provider's login page
3. After authentication, they are redirected back to `/auth/callback`
4. The callback route exchanges the code for a session
5. The AuthContext syncs the Supabase Auth user to the `users` table
6. User is redirected to `/member` page

## 5. First-Time User Experience

When a user signs in for the first time:
- A profile is automatically created in the `users` table
- They receive 10 default credits
- Their role is set to 'member' by default
- Their name is extracted from OAuth provider metadata

## 6. Testing

1. Start your development server: `npm run dev`
2. Navigate to `/login`
3. Click one of the OAuth buttons
4. Complete the OAuth flow
5. You should be redirected to `/member` after successful authentication

## Notes

- The application no longer uses email/password authentication
- All authentication is handled through Supabase Auth
- User sessions are managed automatically by Supabase
- The `users` table stores additional profile information (credits, role) separate from Supabase Auth

