'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/member');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login(email, password);
    
    if (success) {
      router.push('/member');
    } else {
      setError('Invalid email or password. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      
      <main className="flex-grow bg-[#f5f4f2] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Login Card */}
          <div className="bg-[#faf9f7] border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-8">
              <h1 className="text-4xl font-black uppercase tracking-tight mb-2">
                Member Login
              </h1>
              <p className="text-gray-600">
                Enter your credentials to access your account.
              </p>
            </div>

            {/* Demo Credentials Info */}
            <div className="mb-6 p-4 bg-yellow-100 border-2 border-yellow-400">
              <p className="text-sm font-semibold mb-1">Demo Credentials:</p>
              <p className="text-sm"><strong>Email:</strong> member@blazinpaddles.com</p>
              <p className="text-sm"><strong>Password:</strong> password</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-100 border-2 border-red-500 text-red-700 text-sm font-semibold">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-bold uppercase tracking-wide mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-yellow-400 font-medium"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold uppercase tracking-wide mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-yellow-400 font-medium"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-black text-white font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed border-2 border-black"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-gray-600 hover:text-black font-medium">
                ← Back to Home
              </Link>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Don't have an account? Contact us to become a member.</p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

