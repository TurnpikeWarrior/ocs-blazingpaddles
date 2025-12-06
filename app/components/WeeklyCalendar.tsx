'use client';

import { useState, useEffect } from 'react';
import { Booking } from '../types';

interface WeeklyCalendarProps {
  onTimeSlotClick: (date: Date, time: string) => void;
  onUserBookingClick: (booking: Booking) => void;
  userBookings: Booking[];
}

function getStartOfWeek() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diff = dayOfWeek === 0 ? 0 : dayOfWeek;
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - diff);
  sunday.setHours(0, 0, 0, 0);
  return sunday;
}

export default function WeeklyCalendar({ onTimeSlotClick, onUserBookingClick, userBookings }: WeeklyCalendarProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCurrentWeekStart(getStartOfWeek());
    setMounted(true);
  }, []);

  // Generate the week dates
  const getWeekDates = () => {
    if (!currentWeekStart) return [];
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  // Show loading state until mounted
  if (!mounted || !currentWeekStart) {
    return (
      <div className="bg-white border-4 border-black">
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-black"></div>
          <p className="mt-4 font-bold">Loading calendar...</p>
        </div>
      </div>
    );
  }

  // Time slots from 8 AM to 8 PM
  const timeSlots = [
    '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', 
    '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM'
  ];

  const previousWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newStart);
  };

  const nextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newStart);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isPastTimeSlot = (date: Date, time: string): boolean => {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // If the date is before today, it's past
    if (date < today) return true;
    
    // If the date is after today, it's not past
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date >= tomorrow) return false;
    
    // If it's today, check the time
    // Parse the time string (e.g., "8 AM", "1 PM")
    const timeMatch = time.match(/(\d+)\s*(AM|PM)/i);
    if (!timeMatch) return false;
    
    let hour = parseInt(timeMatch[1]);
    const meridiem = timeMatch[2].toUpperCase();
    
    // Convert to 24-hour format
    if (meridiem === 'PM' && hour !== 12) {
      hour += 12;
    } else if (meridiem === 'AM' && hour === 12) {
      hour = 0;
    }
    
    // Compare with current hour
    const currentHour = now.getHours();
    return hour <= currentHour;
  };

  // Mock function to check if a time slot is reserved (randomly for demo)
  const isReserved = (date: Date, time: string) => {
    // Generate some mock reservations
    const key = `${date.toDateString()}-${time}`;
    const hash = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return hash % 3 === 0; // Roughly 33% will be reserved
  };

  // Check if a time slot has a user booking
  const getUserBooking = (date: Date, time: string): Booking | undefined => {
    const dateStr = date.toISOString().split('T')[0];
    return userBookings.find(
      (booking) => booking.date === dateStr && booking.time === time
    );
  };

  const handleTimeSlotClick = (date: Date, time: string) => {
    if (isPastTimeSlot(date, time)) return;
    
    // Check if this is a user booking
    const userBooking = getUserBooking(date, time);
    if (userBooking) {
      onUserBookingClick(userBooking);
      return;
    }
    
    onTimeSlotClick(date, time);
  };

  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return (
    <div className="bg-white border-4 border-black">
      {/* Header with navigation */}
      <div className="flex items-center justify-between p-4 border-b-2 border-black">
        <button
          onClick={previousWeek}
          className="px-4 py-2 hover:bg-gray-100 border-2 border-black font-bold"
          aria-label="Previous week"
        >
          ← Previous
        </button>
        
        <h2 className="text-xl font-black uppercase tracking-tight">
          {weekDates[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        
        <button
          onClick={nextWeek}
          className="px-4 py-2 hover:bg-gray-100 border-2 border-black font-bold"
          aria-label="Next week"
        >
          Next →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Day headers */}
          <div className="grid grid-cols-8 border-b-2 border-black">
            <div className="p-2 border-r-2 border-black"></div>
            {weekDates.map((date, index) => {
              const today = isToday(date);
              return (
                <div
                  key={index}
                  className={`p-3 text-center border-r-2 border-black last:border-r-0 ${
                    today ? 'bg-blue-500' : ''
                  }`}
                >
                  <div className={`text-xs font-bold uppercase tracking-wide ${
                    today ? 'text-white' : 'text-gray-600'
                  }`}>
                    {dayNames[index]}
                  </div>
                  <div className={`text-2xl font-black ${
                    today ? 'text-white' : 'text-black'
                  }`}>
                    {date.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time slots grid */}
          {timeSlots.map((time, timeIndex) => (
            <div key={time} className="grid grid-cols-8 border-b border-gray-300 last:border-b-0">
              {/* Time label */}
              <div className="p-3 text-xs font-semibold text-gray-500 border-r-2 border-black flex items-start">
                {time}
              </div>

              {/* Time slot cells */}
              {weekDates.map((date, dateIndex) => {
                const past = isPastTimeSlot(date, time);
                const reserved = isReserved(date, time);
                const userBooking = getUserBooking(date, time);
                const today = isToday(date);

                return (
                  <button
                    key={dateIndex}
                    onClick={() => handleTimeSlotClick(date, time)}
                    disabled={past || (reserved && !userBooking)}
                    className={`
                      min-h-[60px] p-2 text-center text-xs font-semibold border-r border-gray-300 last:border-r-0
                      transition-colors relative
                      ${today ? 'border-r-2 border-yellow-400' : ''}
                      ${past ? 'bg-gray-100 cursor-not-allowed text-gray-400' : ''}
                      ${userBooking ? 'bg-yellow-400 border-2 border-yellow-600 cursor-pointer hover:bg-yellow-300' : ''}
                      ${!past && !reserved && !userBooking ? 'hover:bg-yellow-100 cursor-pointer' : ''}
                      ${reserved && !past && !userBooking ? 'bg-gray-200 border-2 border-gray-400 cursor-not-allowed' : ''}
                    `}
                  >
                    {userBooking && (
                      <div className="text-xs leading-tight font-bold">
                        ✓ {userBooking.name}
                      </div>
                    )}
                    {reserved && !past && !userBooking && (
                      <div className="text-xs leading-tight">
                        All Courts<br />Reserved
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div className="p-4 border-t-2 border-black bg-gray-50">
        <p className="text-sm italic text-gray-600 text-center mb-3">
          Click on any available slot to open the booking page.
        </p>
        <div className="flex justify-center gap-6 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 border-2 border-yellow-600"></div>
            <span>Your Bookings</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 border-2 border-gray-400"></div>
            <span>Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border-2 border-gray-300"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300"></div>
            <span>Past</span>
          </div>
        </div>
      </div>
    </div>
  );
}

