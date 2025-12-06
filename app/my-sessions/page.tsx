'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { Booking } from '../types';

export default function MySessionsPage() {
  const { user, bookings, isAuthenticated, logout, removeBooking } = useAuth();
  const router = useRouter();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string>('');

  // Protect route
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showInfoModal) {
          setShowInfoModal(false);
        } else if (showCancelModal) {
          handleCloseCancelModal();
        }
      }
    };

    if (showCancelModal || showInfoModal) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showCancelModal, showInfoModal]);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleCancelClick = (booking: Booking) => {
    setBookingToCancel(booking);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    if (bookingToCancel) {
      removeBooking(bookingToCancel.id);
      setShowCancelModal(false);
      setBookingToCancel(null);
    }
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setBookingToCancel(null);
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

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'numeric', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    // Ensure time is in HH:MM format
    // Handles both "8 AM" and "8:00 AM" formats
    const match = timeString.match(/(\d+)(?::(\d+))?\s*(AM|PM)/i);
    if (!match) return timeString;
    
    const hour = match[1];
    const minutes = match[2] || '00';
    const period = match[3].toUpperCase();
    
    return `${hour}:${minutes} ${period}`;
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
      
      <main className="flex-grow bg-[#f5f4f2] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2">
              My Sessions
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              View and manage your court reservations and class bookings.
            </p>
            
            {/* Credits Info */}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-gray-700">Credits Available:</span>
                <div className="px-4 py-2 bg-yellow-400 border-2 border-black text-lg font-black">
                  {user.credits} {user.credits === 1 ? 'Credit' : 'Credits'}
                </div>
              </div>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setInfoMessage('Credit purchase feature coming soon!');
                  setShowInfoModal(true);
                }}
                className="px-6 py-2 bg-black text-white font-bold text-sm uppercase tracking-wide hover:bg-gray-800 transition-colors border-2 border-black"
              >
                Buy More Credits
              </a>
            </div>
          </div>

          {/* No Bookings State */}
          {bookings.length === 0 && (
            <div className="bg-[#faf9f7] border-4 border-black p-12 text-center">
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
                    className="bg-[#faf9f7] border-4 border-black p-6 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{getBookingIcon(booking.type)}</div>
                      <div className="flex flex-col gap-2 items-stretch">
                        <div className="px-4 py-2 bg-yellow-400 border-2 border-black text-xs font-bold uppercase text-center">
                          {booking.creditCost} {booking.creditCost === 1 ? 'Credit' : 'Credits'}
                        </div>
                        <button
                          onClick={() => handleCancelClick(booking)}
                          className="px-4 py-2 bg-red-500 text-black font-bold text-xs uppercase tracking-wide hover:bg-red-600 transition-colors border-2 border-black text-center whitespace-nowrap"
                        >
                          Cancel Reservation
                        </button>
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
                          <span className="font-semibold">{formatTime(booking.time)}</span>
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
              
              <div className="bg-[#faf9f7] border-4 border-black overflow-hidden">
                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-black text-white">
                        <th className="px-6 py-4 text-left text-sm font-black uppercase tracking-wide border-r-2 border-gray-700">
                          Court/Class
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-black uppercase tracking-wide border-r-2 border-gray-700">
                          Court #
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-black uppercase tracking-wide border-r-2 border-gray-700">
                          Date
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-black uppercase tracking-wide border-r-2 border-gray-700">
                          Time
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-black uppercase tracking-wide">
                          Credit
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pastBookings.map((booking, index) => (
                        <tr 
                          key={booking.id}
                          className={`${
                            index % 2 === 0 ? 'bg-[#faf9f7]' : 'bg-[#f5f4f2]'
                          } border-t-2 border-gray-300 hover:bg-gray-100 transition-colors`}
                        >
                          <td className="px-6 py-4 font-bold text-gray-700">
                            {booking.name}
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-700 text-center">
                            {booking.courtNumber ? `#${booking.courtNumber}` : '—'}
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-700 text-center">
                            {formatDateShort(booking.date)}
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-700 text-center">
                            {formatTime(booking.time)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-block px-3 py-1 bg-gray-200 border-2 border-gray-400 text-xs font-bold uppercase text-gray-600">
                              {booking.creditCost}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
                className="px-8 py-4 bg-[#faf9f7] text-black font-bold uppercase tracking-wide hover:bg-gray-100 transition-colors border-2 border-black"
              >
                Print Schedule
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && bookingToCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#faf9f7] border-4 border-black max-w-lg w-full">
            {/* Modal Header */}
            <div className="bg-red-500 border-b-4 border-black p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tight text-black">
                    Cancel Reservation
                  </h2>
                </div>
                <button
                  onClick={handleCloseCancelModal}
                  className="text-3xl font-bold hover:opacity-70 text-black"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Confirmation Message */}
              <div className="bg-red-50 border-4 border-red-500 p-6">
                <h3 className="font-black uppercase text-xl mb-4 text-red-900">
                  Are you sure?
                </h3>
                <p className="text-base mb-4 text-red-900">
                  You are about to cancel <span className="font-bold">"{bookingToCancel.name}"</span>
                </p>
                <div className="bg-[#faf9f7] border-2 border-red-300 p-4 space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">Date:</span>{' '}
                    {new Date(bookingToCancel.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p>
                    <span className="font-semibold">Time:</span> {formatTime(bookingToCancel.time)}
                  </p>
                  {bookingToCancel.courtNumber && (
                    <p>
                      <span className="font-semibold">Court:</span> #{bookingToCancel.courtNumber}
                    </p>
                  )}
                  <p className="pt-2 border-t-2 border-red-200">
                    <span className="font-semibold">Refund Amount:</span>{' '}
                    <span className="text-lg font-bold text-green-600">
                      {bookingToCancel.creditCost} {bookingToCancel.creditCost === 1 ? 'Credit' : 'Credits'}
                    </span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleCloseCancelModal}
                  className="flex-1 py-4 bg-[#faf9f7] text-black font-bold text-lg uppercase tracking-wide hover:bg-gray-100 transition-colors border-2 border-black"
                >
                  No, Keep It
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="flex-1 py-4 bg-red-500 text-black font-bold text-lg uppercase tracking-wide hover:bg-red-600 transition-colors border-4 border-black"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#faf9f7] border-4 border-black max-w-md w-full">
            {/* Modal Header */}
            <div className="bg-yellow-400 border-b-4 border-black p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tight text-black">
                    Information
                  </h2>
                </div>
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="text-3xl font-bold hover:opacity-70 text-black"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div className="bg-yellow-50 border-2 border-yellow-300 p-4">
                <p className="text-base text-gray-900 font-semibold">
                  {infoMessage}
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setShowInfoModal(false)}
                className="w-full py-4 bg-black text-white font-bold text-lg uppercase tracking-wide hover:bg-gray-800 transition-colors border-2 border-black"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

