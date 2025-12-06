'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  isAuthenticated?: boolean;
  userCredits?: number;
  onLogout?: () => void;
}

export default function Navbar({ isAuthenticated = false, userCredits = 0, onLogout }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b-2 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Image 
              src="/pickleball-logo.svg" 
              alt="Blazin' Paddles Logo" 
              width={40} 
              height={40}
              className="w-10 h-10"
            />
            <div className="text-2xl font-bold text-black tracking-tight">
              Blazin' Paddles
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  href="/member"
                  className={`font-semibold text-sm uppercase tracking-wide transition-colors ${
                    pathname === '/member'
                      ? 'text-black'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Reserve A Court
                </Link>
                <Link
                  href="/my-sessions"
                  className={`font-semibold text-sm uppercase tracking-wide transition-colors ${
                    pathname === '/my-sessions'
                      ? 'text-black'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  My Sessions
                </Link>
                <div className="flex items-center space-x-4">
                  <div className="px-3 py-1 bg-yellow-400 border-2 border-black font-bold text-sm">
                    {userCredits} Credits
                  </div>
                  <button
                    onClick={onLogout}
                    className="px-4 py-2 bg-black text-white font-semibold text-sm uppercase tracking-wide hover:bg-gray-800 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2 bg-black text-white font-semibold text-sm uppercase tracking-wide hover:bg-gray-800 transition-colors"
              >
                Member Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

