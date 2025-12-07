'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WeeklyCalendar from '../components/WeeklyCalendar';
import { useAuth } from '../context/AuthContext';
import { CREDIT_COSTS } from '../utils/mockData';
import { Booking, Class } from '../types';

export default function MemberPage() {
  const { user, isAuthenticated, isAdmin, logout, addBooking, removeBooking, bookings, classes } = useAuth();
  const router = useRouter();
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [courtNumber, setCourtNumber] = useState<number>(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  // Protect route
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Handle ESC key to close modals
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showErrorModal) {
          setShowErrorModal(false);
        } else if (showClassModal) {
          setShowClassModal(false);
          setSelectedClass(null);
        } else if (showDetailsModal) {
          setShowDetailsModal(false);
          setSelectedBooking(null);
          setShowCancelConfirmation(false);
        } else if (showBookingModal) {
          setShowBookingModal(false);
        }
      }
    };

    if (showBookingModal || showDetailsModal || showErrorModal || showClassModal) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showBookingModal, showDetailsModal, showErrorModal, showClassModal]);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleTimeSlotClick = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setShowBookingModal(true);
  };

  const handleUserBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
    setShowCancelConfirmation(false);
  };

  const handleClassClick = (classItem: Class) => {
    setSelectedClass(classItem);
    setShowClassModal(true);
  };

  const handleJoinClass = () => {
    if (!selectedClass) return;

    const creditCost = CREDIT_COSTS.class;

    if (user.credits < creditCost) {
      setErrorMessage(`Insufficient credits. You need ${creditCost} credit to join this class.`);
      setShowErrorModal(true);
      setShowClassModal(false);
      return;
    }

    if (selectedClass.enrolledCount >= selectedClass.maxCapacity) {
      setErrorMessage('This class is full. Please select another class.');
      setShowErrorModal(true);
      setShowClassModal(false);
      return;
    }

    // Check if user is already enrolled
    const alreadyEnrolled = bookings.some(
      b => b.type === 'class' && b.classId === selectedClass.id
    );

    if (alreadyEnrolled) {
      setErrorMessage('You are already enrolled in this class.');
      setShowErrorModal(true);
      setShowClassModal(false);
      return;
    }

    // Create booking
    addBooking({
      date: selectedClass.date,
      time: selectedClass.time,
      type: 'class',
      name: selectedClass.name,
      creditCost: creditCost,
      classId: selectedClass.id,
    });

    // Show success message
    setShowSuccess(true);
    setShowClassModal(false);
    setSelectedClass(null);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancelBookingClick = () => {
    setShowCancelConfirmation(true);
  };

  const handleConfirmCancellation = () => {
    if (!selectedBooking) return;

    removeBooking(selectedBooking.id);
    setShowDetailsModal(false);
    setShowCancelConfirmation(false);
    setSelectedBooking(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancelConfirmation = () => {
    setShowCancelConfirmation(false);
  };

  // Helper function to format date in local timezone as YYYY-MM-DD
  const formatDateLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      setErrorMessage('Please select a date and time.');
      setShowErrorModal(true);
      return;
    }

    const creditCost = CREDIT_COSTS.court;

    if (user.credits < creditCost) {
      setErrorMessage(`Insufficient credits. You need ${creditCost} credits for this booking.`);
      setShowErrorModal(true);
      return;
    }

    // Create booking
    const bookingName = `Court ${courtNumber}`;

    addBooking({
      date: formatDateLocal(selectedDate),
      time: selectedTime,
      type: 'court',
      name: bookingName,
      creditCost,
      courtNumber: courtNumber,
    });

    // Show success message
    setShowSuccess(true);
    setShowBookingModal(false);
    setTimeout(() => setShowSuccess(false), 3000);

    // Reset form
    setSelectedTime(null);
    setSelectedDate(null);
    setCourtNumber(1);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (time: string) => {
    return time;
  };

  return (
    <>
      <Navbar 
        isAuthenticated={isAuthenticated} 
        userCredits={user.credits}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />
      
      <main className="flex-grow bg-[#f5f4f2] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2">
              Welcome back, {user.name}!
            </h1>
            <p className="text-xl text-gray-600">
              Select a date and time from the calendar below to book your court.
            </p>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="mb-6 p-4 bg-green-100 border-4 border-green-500 text-green-800 font-bold text-center animate-pulse">
              ✓ {selectedBooking ? 'Booking cancelled! Credits have been refunded.' : 'Booking confirmed! Check "My Sessions" to view your reservations.'}
            </div>
          )}

          {/* Weekly Calendar */}
          <WeeklyCalendar 
            onTimeSlotClick={handleTimeSlotClick}
            onUserBookingClick={handleUserBookingClick}
            onClassClick={handleClassClick}
            userBookings={bookings}
            classes={classes}
          />
        </div>
      </main>

      {/* Booking Modal */}
      {showBookingModal && selectedDate && selectedTime && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#faf9f7] border-4 border-black max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-yellow-400 border-b-4 border-black p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tight mb-2">
                    Book Your Session
                  </h2>
                  <p className="font-bold">
                    {formatDate(selectedDate)} at {formatTime(selectedTime)}
                  </p>
                </div>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-3xl font-bold hover:opacity-70"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Booking Type Info */}
              <div>
                <label className="block text-sm font-bold uppercase tracking-wide mb-3">
                  Booking Type
                </label>
                <div className="bg-gray-50 border-2 border-gray-300 p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">Court</span>
                    <span className="text-sm text-gray-600">(3 credits)</span>
                  </div>
                </div>
              </div>

              {/* Court Number */}
              <div>
                <label className="block text-sm font-bold uppercase tracking-wide mb-3">
                  Court Number
                </label>
                <select
                  value={courtNumber}
                  onChange={(e) => setCourtNumber(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-yellow-400 font-semibold"
                >
                  <option value={1}>Court 1</option>
                  <option value={2}>Court 2</option>
                  <option value={3}>Court 3</option>
                  <option value={4}>Court 4</option>
                </select>
              </div>

              {/* Booking Summary */}
              <div className="bg-gray-50 border-2 border-gray-300 p-4">
                <h3 className="font-bold uppercase text-sm mb-2">Booking Summary</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-semibold">Date:</span> {formatDate(selectedDate)}</p>
                  <p><span className="font-semibold">Time:</span> {formatTime(selectedTime)}</p>
                  <p><span className="font-semibold">Type:</span> Court {courtNumber}</p>
                  <p><span className="font-semibold">Cost:</span> {CREDIT_COSTS.court} Credits</p>
                  <p><span className="font-semibold">Your Credits:</span> {user.credits}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-4 bg-white text-black font-bold text-lg uppercase tracking-wide hover:bg-gray-100 transition-colors border-2 border-black"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBooking}
                  className="flex-1 py-4 bg-yellow-400 text-black font-bold text-lg uppercase tracking-wide hover:bg-yellow-300 transition-colors border-4 border-black"
                >
                  Confirm ({CREDIT_COSTS.court} Credits)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#faf9f7] border-4 border-black max-w-lg w-full">
            {/* Modal Header */}
            <div className={`border-b-4 border-black p-6 ${showCancelConfirmation ? 'bg-red-500' : 'bg-yellow-400'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className={`text-3xl font-black uppercase tracking-tight mb-2 ${showCancelConfirmation ? 'text-white' : ''}`}>
                    {showCancelConfirmation ? 'Confirm Cancellation' : 'Your Reservation'}
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedBooking(null);
                    setShowCancelConfirmation(false);
                  }}
                  className={`text-3xl font-bold hover:opacity-70 ${showCancelConfirmation ? 'text-white' : ''}`}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {!showCancelConfirmation ? (
                <>
                  {/* Booking Details */}
                  <div className="bg-gray-50 border-2 border-gray-300 p-4">
                    <h3 className="font-bold uppercase text-sm mb-3">Reservation Details</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-semibold">Booking:</span>{' '}
                        <span className="text-lg font-bold">{selectedBooking.name}</span>
                      </p>
                      <p>
                        <span className="font-semibold">Date:</span>{' '}
                        {new Date(selectedBooking.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p>
                        <span className="font-semibold">Time:</span> {selectedBooking.time}
                      </p>
                      <p>
                        <span className="font-semibold">Type:</span>{' '}
                        <span className="capitalize">{selectedBooking.type.replace('-', ' ')}</span>
                      </p>
                      <p>
                        <span className="font-semibold">Credit Cost:</span> {selectedBooking.creditCost} {selectedBooking.creditCost === 1 ? 'Credit' : 'Credits'}
                      </p>
                    </div>
                  </div>

                  {/* Warning Message */}
                  <div className="bg-red-50 border-2 border-red-300 p-4">
                    <p className="text-sm text-red-800">
                      <span className="font-bold">⚠️ Cancellation Policy:</span> If you cancel this reservation, 
                      {selectedBooking.creditCost} {selectedBooking.creditCost === 1 ? 'credit' : 'credits'} will be refunded to your account.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setShowDetailsModal(false);
                        setSelectedBooking(null);
                      }}
                      className="flex-1 py-4 bg-white text-black font-bold text-lg uppercase tracking-wide hover:bg-gray-100 transition-colors border-2 border-black"
                    >
                      Close
                    </button>
                    <button
                      onClick={handleCancelBookingClick}
                      className="flex-1 py-4 bg-red-500 text-white font-bold text-lg uppercase tracking-wide hover:bg-red-600 transition-colors border-4 border-black"
                    >
                      Cancel Booking
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Cancellation Confirmation */}
                  <div className="bg-red-50 border-4 border-red-500 p-6">
                    <h3 className="font-black uppercase text-xl mb-4 text-red-900">
                      Are you sure?
                    </h3>
                    <p className="text-base mb-4 text-red-900">
                      You are about to cancel <span className="font-bold">"{selectedBooking.name}"</span>
                    </p>
                    <div className="bg-[#faf9f7] border-2 border-red-300 p-4 space-y-2 text-sm">
                      <p>
                        <span className="font-semibold">Date:</span>{' '}
                        {new Date(selectedBooking.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p>
                        <span className="font-semibold">Time:</span> {selectedBooking.time}
                      </p>
                      <p className="pt-2 border-t-2 border-red-200">
                        <span className="font-semibold">Refund Amount:</span>{' '}
                        <span className="text-lg font-bold text-green-600">
                          {selectedBooking.creditCost} {selectedBooking.creditCost === 1 ? 'Credit' : 'Credits'}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Confirmation Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={handleCancelConfirmation}
                      className="flex-1 py-4 bg-white text-black font-bold text-lg uppercase tracking-wide hover:bg-gray-100 transition-colors border-2 border-black"
                    >
                      No, Keep It
                    </button>
                    <button
                      onClick={handleConfirmCancellation}
                      className="flex-1 py-4 bg-red-500 text-white font-bold text-lg uppercase tracking-wide hover:bg-red-600 transition-colors border-4 border-black"
                    >
                      Yes, Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#faf9f7] border-4 border-black max-w-md w-full">
            {/* Modal Header */}
            <div className="bg-red-500 border-b-4 border-black p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tight text-black">
                    Error
                  </h2>
                </div>
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="text-3xl font-bold hover:opacity-70 text-black"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div className="bg-red-50 border-2 border-red-300 p-4">
                <p className="text-base text-red-900 font-semibold">
                  {errorMessage}
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setShowErrorModal(false)}
                className="w-full py-4 bg-black text-white font-bold text-lg uppercase tracking-wide hover:bg-gray-800 transition-colors border-2 border-black"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Class Modal */}
      {showClassModal && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#faf9f7] border-4 border-black max-w-lg w-full">
            {/* Modal Header */}
            <div className="bg-blue-500 border-b-4 border-black p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tight mb-2 text-white">
                    Join Class
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setShowClassModal(false);
                    setSelectedClass(null);
                  }}
                  className="text-3xl font-bold hover:opacity-70 text-white"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Class Details */}
              <div className="bg-gray-50 border-2 border-gray-300 p-4">
                <h3 className="font-bold uppercase text-sm mb-3">Class Details</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">Class:</span>{' '}
                    <span className="text-lg font-bold">{selectedClass.name}</span>
                  </p>
                  <p>
                    <span className="font-semibold">Date:</span>{' '}
                    {new Date(selectedClass.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p>
                    <span className="font-semibold">Time:</span> {formatTime(selectedClass.time)}
                  </p>
                  <p>
                    <span className="font-semibold">Enrollment:</span>{' '}
                    <span className="font-bold">
                      {selectedClass.enrolledCount} / {selectedClass.maxCapacity} students
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Credit Cost:</span> {selectedClass.creditCost} Credit
                  </p>
                </div>
              </div>

              {/* Availability Warning */}
              {selectedClass.enrolledCount >= selectedClass.maxCapacity ? (
                <div className="bg-red-50 border-2 border-red-300 p-4">
                  <p className="text-sm text-red-800 font-semibold">
                    ⚠️ This class is full. No more spots available.
                  </p>
                </div>
              ) : (
                <div className="bg-green-50 border-2 border-green-300 p-4">
                  <p className="text-sm text-green-800 font-semibold">
                    ✓ {selectedClass.maxCapacity - selectedClass.enrolledCount} spots available
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowClassModal(false);
                    setSelectedClass(null);
                  }}
                  className="flex-1 py-4 bg-[#faf9f7] text-black font-bold text-lg uppercase tracking-wide hover:bg-gray-100 transition-colors border-2 border-black"
                >
                  Cancel
                </button>
                <button
                  onClick={handleJoinClass}
                  disabled={selectedClass.enrolledCount >= selectedClass.maxCapacity}
                  className="flex-1 py-4 bg-blue-500 text-white font-bold text-lg uppercase tracking-wide hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed border-4 border-black"
                >
                  Join Class ({CREDIT_COSTS.class} Credit)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

