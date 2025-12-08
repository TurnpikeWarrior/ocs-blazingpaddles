'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabaseClient } from '@/app/lib/supabase-client';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        // Handle OAuth errors
        if (errorParam) {
          console.error('OAuth error:', errorParam, errorDescription);
          router.push(`/login?error=${encodeURIComponent(errorDescription || errorParam)}`);
          return;
        }

        if (code) {
          // Exchange code for session
          const { data, error: exchangeError } = await supabaseClient.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            console.error('Error exchanging code for session:', exchangeError);
            router.push(`/login?error=${encodeURIComponent(exchangeError.message)}`);
            return;
          }

          if (data.session) {
            // Successfully authenticated, redirect to member page
            router.push('/member');
            return;
          }
        }

        // If no code, redirect to login with error
        router.push('/login?error=No authorization code received');
      } catch (err: any) {
        console.error('Error in OAuth callback:', err);
        setError(err.message || 'Authentication failed');
        router.push(`/login?error=${encodeURIComponent(err.message || 'Authentication failed')}`);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-[#f5f4f2] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-black mb-4"></div>
        <p className="text-lg font-bold">Completing sign in...</p>
        {error && (
          <p className="mt-4 text-red-600 text-sm">{error}</p>
        )}
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f5f4f2] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-black mb-4"></div>
          <p className="text-lg font-bold">Loading...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
