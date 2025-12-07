'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  isAuthenticated?: boolean;
  userCredits?: number;
  isAdmin?: boolean;
  onLogout?: () => void;
}

export default function Navbar({ isAuthenticated = false, userCredits = 0, isAdmin = false, onLogout }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav className="bg-[#faf9f7] border-b-2 border-black">
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
                  href={isAdmin ? "/admin?create=true" : "/member"}
                  className={`font-semibold text-sm uppercase tracking-wide transition-colors ${
                    (isAdmin ? pathname === '/admin' : pathname === '/member')
                      ? 'text-black'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {isAdmin ? "Create New Class" : "Reserve A Court"}
                </Link>
                <Link
                  href="/my-sessions"
                  className={`font-semibold text-sm uppercase tracking-wide transition-colors ${
                    pathname === '/my-sessions'
                      ? 'text-black'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {isAdmin ? "My Classes" : "My Sessions"}
                </Link>
                <div className="flex items-center space-x-4">
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className={`px-3 py-1 bg-yellow-400 border-2 border-black font-bold text-sm uppercase tracking-wide transition-colors ${
                        pathname === '/admin'
                          ? 'bg-yellow-500'
                          : 'hover:bg-yellow-500'
                      }`}
                    >
                      ADMIN
                    </Link>
                  )}
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

