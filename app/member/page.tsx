'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Calendar from '../components/Calendar';
import { useAuth } from '../context/AuthContext';
import { generateTimeSlots, CREDIT_COSTS, AVAILABLE_CLASSES } from '../utils/mockData';
import { BookingType } from '../types';

export default function MemberPage() {
  const { user, isAuthenticated, logout, addBooking } = useAuth();
  const router = useRouter();
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingType, setBookingType] = useState<BookingType>('court');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [courtNumber, setCourtNumber] = useState<number>(1);
  const [timeSlots, setTimeSlots] = useState(generateTimeSlots());
  const [showSuccess, setShowSuccess] = useState(false);

  // Protect route
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Regenerate time slots when date changes
  useEffect(() => {
    setTimeSlots(generateTimeSlots());
    setSelectedTime(null);
  }, [selectedDate]);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select a date and time.');
      return;
    }

    const creditCost = CREDIT_COSTS[bookingType];

    if (user.credits < creditCost) {
      alert(`Insufficient credits. You need ${creditCost} credits for this booking.`);
      return;
    }

    if (bookingType === 'class' && !selectedClass) {
      alert('Please select a class.');
      return;
    }

    // Create booking
    const bookingName = bookingType === 'court' 
      ? `Court ${courtNumber}`
      : bookingType === 'class'
      ? AVAILABLE_CLASSES.find(c => c.id === selectedClass)?.name || 'Class'
      : 'Open Play';

    addBooking({
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      type: bookingType,
      name: bookingName,
      creditCost,
      courtNumber: bookingType === 'court' ? courtNumber : undefined,
    });

    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    // Reset form
    setSelectedTime(null);
    setCourtNumber(1);
    setSelectedClass('');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <>
      <Navbar 
        isAuthenticated={isAuthenticated} 
        userCredits={user.credits}
        onLogout={handleLogout}
      />
      
      <main className="flex-grow bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2">
              Welcome back, {user.name}!
            </h1>
            <p className="text-xl text-gray-600">
              Reserve your court time or join a class below.
            </p>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="mb-6 p-4 bg-green-100 border-4 border-green-500 text-green-800 font-bold text-center animate-pulse">
              ✓ Booking confirmed! Check "My Sessions" to view your reservations.
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calendar Section */}
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4">
                Select Date
              </h2>
              <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
            </div>

            {/* Booking Section */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight mb-4">
                  Book Your Session
                </h2>
                
                {selectedDate && (
                  <div className="bg-yellow-100 border-2 border-yellow-400 p-4 mb-4">
                    <p className="font-bold text-sm">Selected Date:</p>
                    <p className="text-lg font-semibold">{formatDate(selectedDate)}</p>
                  </div>
                )}
              </div>

              {/* Booking Type Selector */}
              <div className="bg-white border-4 border-black p-6">
                <label className="block text-sm font-bold uppercase tracking-wide mb-3">
                  Booking Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setBookingType('court')}
                    className={`py-3 px-4 font-bold text-sm uppercase tracking-wide border-2 transition-all ${
                      bookingType === 'court'
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-black hover:bg-gray-100'
                    }`}
                  >
                    Court<br/>
                    <span className="text-xs">3 credits</span>
                  </button>
                  <button
                    onClick={() => setBookingType('class')}
                    className={`py-3 px-4 font-bold text-sm uppercase tracking-wide border-2 transition-all ${
                      bookingType === 'class'
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-black hover:bg-gray-100'
                    }`}
                  >
                    Class<br/>
                    <span className="text-xs">1 credit</span>
                  </button>
                  <button
                    onClick={() => setBookingType('open-play')}
                    className={`py-3 px-4 font-bold text-sm uppercase tracking-wide border-2 transition-all ${
                      bookingType === 'open-play'
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-black hover:bg-gray-100'
                    }`}
                  >
                    Open Play<br/>
                    <span className="text-xs">1 credit</span>
                  </button>
                </div>
              </div>

              {/* Court Number (only for court bookings) */}
              {bookingType === 'court' && (
                <div className="bg-white border-4 border-black p-6">
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
              )}

              {/* Class Selector (only for class bookings) */}
              {bookingType === 'class' && (
                <div className="bg-white border-4 border-black p-6">
                  <label className="block text-sm font-bold uppercase tracking-wide mb-3">
                    Select Class
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-yellow-400 font-semibold"
                  >
                    <option value="">Choose a class...</option>
                    {AVAILABLE_CLASSES.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} - {cls.time}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Time Slots */}
              <div className="bg-white border-4 border-black p-6">
                <label className="block text-sm font-bold uppercase tracking-wide mb-3">
                  Select Time
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      className={`py-3 px-4 font-semibold text-sm border-2 transition-all ${
                        !slot.available
                          ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
                          : selectedTime === slot.time
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-black hover:bg-gray-100 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-xs text-gray-600 font-semibold">
                  Operating hours: 7:00 AM - 8:00 PM
                </p>
              </div>

              {/* Confirm Booking Button */}
              <button
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime}
                className="w-full py-4 bg-yellow-400 text-black font-bold text-lg uppercase tracking-wide hover:bg-yellow-300 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed border-4 border-black"
              >
                Confirm Booking ({CREDIT_COSTS[bookingType]} Credits)
              </button>

              {/* Purchase Credits */}
              <div className="bg-white border-2 border-black p-4 text-center">
                <p className="text-sm font-semibold mb-2">Need more credits?</p>
                <button className="text-sm font-bold text-black underline hover:no-underline">
                  Purchase Credits →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

