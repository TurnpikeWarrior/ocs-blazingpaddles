# OAuth Login Setup Guide

This application supports both email/password and OAuth authentication via Supabase Auth. Follow these steps to configure OAuth providers.

## ⚠️ Important: Enable OAuth Providers First

**You must enable OAuth providers in your Supabase dashboard before they will work.** If you see an error like "provider is not enabled", follow the steps below.

## 1. Configure OAuth Providers in Supabase

### Google OAuth Setup

1. **In Supabase Dashboard:**
   - Go to your Supabase project dashboard
   - Navigate to **Authentication** → **Providers**
   - Find **Google** in the list
   - Toggle the switch to **Enable** it
   - Click **Save**

2. **In Google Cloud Console:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project (or select an existing one)
   - Navigate to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth client ID**
   - Choose **Web application** as the application type
   - Add authorized redirect URI: `https://[your-project-ref].supabase.co/auth/v1/callback`
     - Replace `[your-project-ref]` with your actual Supabase project reference (found in your Supabase URL)
   - Copy the **Client ID** and **Client Secret**
   - Go back to Supabase and paste them into the Google provider settings
   - Click **Save**

### GitHub OAuth Setup

1. **In Supabase Dashboard:**
   - Go to **Authentication** → **Providers**
   - Find **GitHub** in the list
   - Toggle the switch to **Enable** it
   - Click **Save**

2. **In GitHub:**
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Click **New OAuth App**
   - Fill in:
     - **Application name**: Blazin' Paddles (or your app name)
     - **Homepage URL**: Your website URL (e.g., `http://localhost:3000` for dev)
     - **Authorization callback URL**: `https://[your-project-ref].supabase.co/auth/v1/callback`
       - Replace `[your-project-ref]` with your actual Supabase project reference
   - Click **Register application**
   - Copy the **Client ID**
   - Click **Generate a new client secret** and copy it
   - Go back to Supabase and paste the Client ID and Client Secret
   - Click **Save**

### Facebook OAuth Setup

1. **In Supabase Dashboard:**
   - Go to **Authentication** → **Providers**
   - Find **Facebook** in the list
   - Toggle the switch to **Enable** it
   - Click **Save**

2. **In Facebook Developers:**
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Click **My Apps** → **Create App**
   - Choose **Consumer** or **Business** app type
   - Fill in app details and create the app
   - Go to **Settings** → **Basic** and note your **App ID** and **App Secret**
   - Add **Facebook Login** product to your app
   - Go to **Facebook Login** → **Settings**
   - Add Valid OAuth Redirect URIs: `https://[your-project-ref].supabase.co/auth/v1/callback`
     - Replace `[your-project-ref]` with your actual Supabase project reference
   - Go back to Supabase and paste the App ID and App Secret
   - Click **Save**

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

- The application supports both email/password and OAuth authentication
- Email/password login works without any OAuth setup
- OAuth providers must be enabled in Supabase before they will work
- User sessions are managed automatically by Supabase for OAuth users
- The `users` table stores additional profile information (credits, role) separate from Supabase Auth

