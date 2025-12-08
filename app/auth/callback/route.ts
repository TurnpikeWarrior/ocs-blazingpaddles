import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorDescription || error)}`, request.url)
    );
  }

  if (code) {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          flowType: 'pkce',
        },
      });

      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        console.error('Error exchanging code for session:', exchangeError);
        return NextResponse.redirect(
          new URL(`/login?error=${encodeURIComponent(exchangeError.message)}`, request.url)
        );
      }

      if (data.session) {
        // Successfully authenticated, redirect to member page
        return NextResponse.redirect(new URL('/member', request.url));
      }
    } catch (err: any) {
      console.error('Error in OAuth callback:', err);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(err.message || 'Authentication failed')}`, request.url)
      );
    }
  }

  // If no code, redirect to login with error
  return NextResponse.redirect(
    new URL('/login?error=No authorization code received', request.url)
  );
}

