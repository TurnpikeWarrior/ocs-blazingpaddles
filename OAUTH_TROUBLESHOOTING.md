# OAuth Login Troubleshooting Guide

## Issue: "Signing in..." gets stuck / OAuth login doesn't complete

If clicking on OAuth buttons (Google/GitHub/Facebook) causes the page to get stuck on "Signing in..." without completing, follow these steps:

## Step 1: Check Redirect URL Configuration

The most common issue is incorrect redirect URL configuration in Supabase.

1. **Go to Supabase Dashboard**
   - Navigate to **Authentication** → **URL Configuration**

2. **Add Redirect URLs**
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add these:
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/**` (wildcard for all routes)
   
   For production, add:
   - Your production site URL
   - `https://yourdomain.com/auth/callback`

3. **Save the changes**

## Step 2: Verify OAuth Provider Settings

For each OAuth provider (Google/GitHub/Facebook):

1. **In Supabase Dashboard**
   - Go to **Authentication** → **Providers**
   - Make sure the provider is **Enabled** (toggle is ON)
   - Verify Client ID and Client Secret are filled in

2. **In Provider Dashboard** (Google/GitHub/Facebook)
   - Check that the redirect URI matches exactly:
     - `https://[your-project-ref].supabase.co/auth/v1/callback`
   - Replace `[your-project-ref]` with your actual Supabase project reference
   - Example: `https://aambttcsvypgxsplkedc.supabase.co/auth/v1/callback`

## Step 3: Check Browser Console

1. Open browser Developer Tools (F12)
2. Go to **Console** tab
3. Click the OAuth button again
4. Look for any error messages
5. Common errors:
   - `redirect_uri_mismatch` - Redirect URL doesn't match
   - `invalid_client` - Client ID/Secret is wrong
   - `access_denied` - User denied permission

## Step 4: Verify Environment Variables

Make sure your `.env.local` file has:
```
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
```

## Step 5: Test the Flow

1. Clear browser cache and cookies
2. Restart your development server: `npm run dev`
3. Try OAuth login again
4. Watch the browser console for errors

## Step 6: Check Network Tab

1. Open Developer Tools → **Network** tab
2. Click OAuth button
3. Look for:
   - Request to Supabase auth endpoint
   - Redirect to OAuth provider
   - Callback request to `/auth/callback`
   - Any failed requests (red status codes)

## Common Issues and Solutions

### Issue: Redirect loop
**Solution**: Check that redirect URLs are correctly configured in both Supabase and the OAuth provider.

### Issue: "Provider not enabled" error
**Solution**: Enable the provider in Supabase Dashboard → Authentication → Providers.

### Issue: Stuck on "Signing in..."
**Solution**: 
- Check browser console for errors
- Verify redirect URL is in Supabase URL Configuration
- Make sure the callback route is accessible

### Issue: OAuth provider shows error
**Solution**: 
- Verify redirect URI in provider settings matches Supabase callback URL
- Check that Client ID and Secret are correct
- Ensure OAuth app is not in development mode restrictions (for Google)

## Still Having Issues?

1. **Check Supabase Logs**
   - Go to Supabase Dashboard → Logs
   - Look for authentication errors

2. **Test with Different Provider**
   - Try a different OAuth provider to isolate the issue
   - If one works but another doesn't, the issue is with that specific provider's configuration

3. **Use Email/Password Login**
   - Email/password login works without OAuth setup
   - You can use it while troubleshooting OAuth

## Quick Checklist

- [ ] OAuth provider is enabled in Supabase
- [ ] Client ID and Secret are configured
- [ ] Redirect URL is added in Supabase URL Configuration
- [ ] Redirect URI in provider matches Supabase callback URL
- [ ] Environment variables are set correctly
- [ ] Browser console shows no errors
- [ ] Network tab shows successful requests

