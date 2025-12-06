'use client';

import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to member page
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/member');
    }
  }, [isAuthenticated, router]);

  return (
    <>
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-200 border-b-4 border-black overflow-hidden">
          {/* Decorative halftone overlay */}
          <div className="absolute inset-0 halftone-bg pointer-events-none" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-black text-black mb-6 leading-tight tracking-tight">
                Welcome to<br />
                Blazin' Paddles
              </h1>
              
              <p className="text-xl md:text-2xl text-black font-medium mb-8 leading-relaxed">
                Experience the thrill of pickleball at our premier facility. 
                Book courts, join expert-led classes, and connect with our vibrant community.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/login"
                  className="px-8 py-4 bg-black text-white text-lg font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors text-center border-2 border-black"
                >
                  Member Login
                </Link>
                <a
                  href="#how-it-works"
                  className="px-8 py-4 bg-white text-black text-lg font-bold uppercase tracking-wide hover:bg-gray-100 transition-colors text-center border-2 border-black"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-4 uppercase tracking-tight">
              How It Works
            </h2>
            <p className="text-center text-gray-600 text-lg mb-16 max-w-2xl mx-auto">
              Getting started is simple. Follow these easy steps to book your court time.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="border-4 border-black p-8 bg-white hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                <div className="w-16 h-16 bg-yellow-400 border-2 border-black flex items-center justify-center mb-6">
                  <span className="text-3xl font-black">1</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 uppercase tracking-wide">
                  Login
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Sign in to your member account to access our booking system and view your credits.
                </p>
              </div>

              {/* Step 2 */}
              <div className="border-4 border-black p-8 bg-white hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                <div className="w-16 h-16 bg-yellow-400 border-2 border-black flex items-center justify-center mb-6">
                  <span className="text-3xl font-black">2</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 uppercase tracking-wide">
                  Choose
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Select your preferred date and time from our calendar. View available courts and classes.
                </p>
              </div>

              {/* Step 3 */}
              <div className="border-4 border-black p-8 bg-white hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                <div className="w-16 h-16 bg-yellow-400 border-2 border-black flex items-center justify-center mb-6">
                  <span className="text-3xl font-black">3</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 uppercase tracking-wide">
                  Play
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Confirm your booking with credits and show up ready to play. It's that easy!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50 border-y-2 border-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-16 uppercase tracking-tight">
              What We Offer
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Court Reservations */}
              <div className="bg-white border-2 border-black p-8">
                <div className="text-4xl mb-4">🏓</div>
                <h3 className="text-2xl font-bold mb-3 uppercase tracking-wide">
                  Court Reservations
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Reserve your preferred court time with ease. Just 3 credits per hour.
                </p>
                <div className="text-sm font-bold text-yellow-600 uppercase">
                  3 Credits
                </div>
              </div>

              {/* Classes */}
              <div className="bg-white border-2 border-black p-8">
                <div className="text-4xl mb-4">👨‍🏫</div>
                <h3 className="text-2xl font-bold mb-3 uppercase tracking-wide">
                  Expert Classes
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Learn from certified instructors in group classes for all skill levels.
                </p>
                <div className="text-sm font-bold text-yellow-600 uppercase">
                  1 Credit
                </div>
              </div>

              {/* Open Play */}
              <div className="bg-white border-2 border-black p-8">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold mb-3 uppercase tracking-wide">
                  Open Play
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Join community play sessions and meet fellow pickleball enthusiasts.
                </p>
                <div className="text-sm font-bold text-yellow-600 uppercase">
                  1 Credit
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tight">
              Ready to Play?
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Log in to your member account and start booking your court time today.
            </p>
            <Link
              href="/login"
              className="inline-block px-10 py-4 bg-yellow-400 text-black text-lg font-bold uppercase tracking-wide hover:bg-yellow-300 transition-colors border-2 border-yellow-400"
            >
              Get Started
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
