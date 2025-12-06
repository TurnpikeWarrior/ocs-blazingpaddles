'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function MySessionsPage() {
  const { user, bookings, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  // Protect route
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getBookingIcon = (type: string) => {
    switch (type) {
      case 'court':
        return '🏓';
      case 'class':
        return '👨‍🏫';
      case 'open-play':
        return '🎉';
      default:
        return '📅';
    }
  };

  const getBookingTypeLabel = (type: string) => {
    switch (type) {
      case 'court':
        return 'Court Reservation';
      case 'class':
        return 'Class';
      case 'open-play':
        return 'Open Play';
      default:
        return 'Booking';
    }
  };

  // Sort bookings by date
  const sortedBookings = [...bookings].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Separate upcoming and past bookings
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingBookings = sortedBookings.filter(
    (booking) => new Date(booking.date) >= today
  );
  
  const pastBookings = sortedBookings.filter(
    (booking) => new Date(booking.date) < today
  );

  return (
    <>
      <Navbar 
        isAuthenticated={isAuthenticated} 
        userCredits={user.credits}
        onLogout={handleLogout}
      />
      
      <main className="flex-grow bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2">
              My Sessions
            </h1>
            <p className="text-xl text-gray-600">
              View and manage your court reservations and class bookings.
            </p>
          </div>

          {/* No Bookings State */}
          {bookings.length === 0 && (
            <div className="bg-white border-4 border-black p-12 text-center">
              <div className="text-6xl mb-4">📅</div>
              <h2 className="text-2xl font-bold mb-3 uppercase tracking-wide">
                No Sessions Yet
              </h2>
              <p className="text-gray-600 mb-6">
                You haven't made any bookings yet. Start by reserving a court or joining a class!
              </p>
              <Link
                href="/member"
                className="inline-block px-8 py-4 bg-black text-white font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors"
              >
                Book Now
              </Link>
            </div>
          )}

          {/* Upcoming Sessions */}
          {upcomingBookings.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-yellow-400 border-2 border-black" />
                Upcoming Sessions
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white border-4 border-black p-6 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{getBookingIcon(booking.type)}</div>
                      <div className="px-3 py-1 bg-yellow-400 border-2 border-black text-xs font-bold uppercase">
                        {booking.creditCost} {booking.creditCost === 1 ? 'Credit' : 'Credits'}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-black uppercase tracking-tight">
                        {booking.name}
                      </h3>
                      
                      <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        {getBookingTypeLabel(booking.type)}
                      </div>

                      <div className="pt-3 border-t-2 border-gray-200 space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-bold">Date:</span>
                          <span className="font-semibold">{formatDate(booking.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-bold">Time:</span>
                          <span className="font-semibold">{booking.time}</span>
                        </div>
                        {booking.courtNumber && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-bold">Court:</span>
                            <span className="font-semibold">#{booking.courtNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past Sessions */}
          {pastBookings.length > 0 && (
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-gray-400 border-2 border-black" />
                Past Sessions
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white border-2 border-gray-300 p-6 opacity-75"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl grayscale">{getBookingIcon(booking.type)}</div>
                      <div className="px-3 py-1 bg-gray-200 border-2 border-gray-400 text-xs font-bold uppercase text-gray-600">
                        {booking.creditCost} {booking.creditCost === 1 ? 'Credit' : 'Credits'}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-black uppercase tracking-tight text-gray-700">
                        {booking.name}
                      </h3>
                      
                      <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        {getBookingTypeLabel(booking.type)}
                      </div>

                      <div className="pt-3 border-t-2 border-gray-200 space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="font-bold">Date:</span>
                          <span className="font-semibold">{formatDate(booking.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="font-bold">Time:</span>
                          <span className="font-semibold">{booking.time}</span>
                        </div>
                        {booking.courtNumber && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="font-bold">Court:</span>
                            <span className="font-semibold">#{booking.courtNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {bookings.length > 0 && (
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/member"
                className="px-8 py-4 bg-black text-white font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors text-center border-2 border-black"
              >
                Book Another Session
              </Link>
              <button
                onClick={() => window.print()}
                className="px-8 py-4 bg-white text-black font-bold uppercase tracking-wide hover:bg-gray-100 transition-colors border-2 border-black"
              >
                Print Schedule
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

