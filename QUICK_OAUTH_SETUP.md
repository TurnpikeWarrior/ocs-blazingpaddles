# Quick OAuth Setup Guide

## ⚠️ Error: "provider is not enabled"

If you see this error, you need to enable OAuth providers in Supabase first.

## Quick Steps:

1. **Go to Supabase Dashboard**
   - Open your project at https://supabase.com/dashboard
   - Select your project

2. **Enable Providers**
   - Click **Authentication** in the left sidebar
   - Click **Providers** tab
   - Find the provider you want (Google, GitHub, or Facebook)
   - **Toggle the switch to ON** (this is the most important step!)
   - Click **Save**

3. **Configure Provider Credentials** (Required for each provider)
   - Follow the detailed instructions in `OAUTH_SETUP.md` for each provider
   - You'll need to create OAuth apps with Google/GitHub/Facebook
   - Add the redirect URI: `https://[your-project-ref].supabase.co/auth/v1/callback`

## Finding Your Project Reference

Your project reference is in your Supabase URL:
- Example: `https://aambttcsvypgxsplkedc.supabase.co`
- Project ref: `aambttcsvypgxsplkedc`

## Testing

After enabling a provider:
1. Go to your login page
2. Click the OAuth button for the provider you enabled
3. You should be redirected to the provider's login page

## Note

- You can enable one, two, or all three providers
- Email/password login works without any OAuth setup
- OAuth is optional - you can use just email/password if you prefer


