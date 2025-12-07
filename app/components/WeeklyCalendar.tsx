'use client';

import { useState, useEffect } from 'react';
import { Booking, Class } from '../types';

interface WeeklyCalendarProps {
  onTimeSlotClick: (date: Date, time: string) => void;
  onUserBookingClick: (booking: Booking) => void;
  onClassClick?: (classItem: Class) => void;
  userBookings: Booking[];
  classes?: Class[];
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

export default function WeeklyCalendar({ onTimeSlotClick, onUserBookingClick, onClassClick, userBookings, classes = [] }: WeeklyCalendarProps) {
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
      <div className="bg-[#faf9f7] border-4 border-black">
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-black"></div>
          <p className="mt-4 font-bold">Loading calendar...</p>
        </div>
      </div>
    );
  }

  // Time slots from 8 AM to 8 PM
  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
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
    // Parse the time string (e.g., "8:00 AM", "1:00 PM", "8 AM", "1 PM")
    const timeMatch = time.match(/(\d+)(?::\d+)?\s*(AM|PM)/i);
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

  // Helper function to format date in local timezone as YYYY-MM-DD
  const formatDateLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Check if a time slot has a user booking
  const getUserBooking = (date: Date, time: string): Booking | undefined => {
    const dateStr = formatDateLocal(date);
    return userBookings.find(
      (booking) => booking.date === dateStr && booking.time === time
    );
  };

  // Check if a time slot has a class
  const getClass = (date: Date, time: string): Class | undefined => {
    const dateStr = formatDateLocal(date);
    return classes.find(
      (cls) => cls.date === dateStr && cls.time === time
    );
  };

  // Mock function to check if a time slot is reserved (randomly for demo)
  // Returns false if there's a class at this time slot (classes handle their own display)
  const isReserved = (date: Date, time: string) => {
    // If there's a class at this time slot, don't mark it as reserved
    const classItem = getClass(date, time);
    if (classItem) {
      return false;
    }
    
    // Generate some mock reservations
    const key = `${date.toDateString()}-${time}`;
    const hash = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return hash % 3 === 0; // Roughly 33% will be reserved
  };

  const handleTimeSlotClick = (date: Date, time: string) => {
    if (isPastTimeSlot(date, time)) return;
    
    // Check if this is a user booking
    const userBooking = getUserBooking(date, time);
    if (userBooking) {
      onUserBookingClick(userBooking);
      return;
    }
    
    // Check if this is a class
    const classItem = getClass(date, time);
    if (classItem && onClassClick) {
      onClassClick(classItem);
      return;
    }
    
    onTimeSlotClick(date, time);
  };

  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return (
    <div>
      {/* Legend - Outside calendar box, top-right */}
      <div className="flex justify-end mb-4">
          <div className="flex gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 border-2 border-yellow-600 rounded"></div>
              <span>Your Booking</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 border-2 border-blue-600 rounded"></div>
              <span>Class</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 border-2 border-gray-400 rounded"></div>
              <span>Reserved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#faf9f7] border-2 border-gray-300 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded"></div>
              <span>Past</span>
            </div>
          </div>
      </div>

      <div className="bg-[#faf9f7] border-4 border-black">
        {/* Header with navigation */}
        <div className="flex items-center justify-between p-4 border-b-2 border-black">
          <button
            onClick={previousWeek}
            className="px-4 py-2 hover:bg-gray-100 border-2 border-black font-bold"
            aria-label="Previous week"
          >
            ← Previous Month
          </button>
          
          <h2 className="text-3xl font-black uppercase tracking-tight">
            {weekDates[0].toLocaleDateString('en-US', { month: 'long' })}
          </h2>
          
          <button
            onClick={nextWeek}
            className="px-4 py-2 hover:bg-gray-100 border-2 border-black font-bold"
            aria-label="Next week"
          >
            Next Month →
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
              <div className="p-3 text-base font-bold text-gray-700 border-r-2 border-black flex items-center justify-center">
                {time}
              </div>

              {/* Time slot cells */}
              {weekDates.map((date, dateIndex) => {
                const past = isPastTimeSlot(date, time);
                const reserved = isReserved(date, time);
                const userBooking = getUserBooking(date, time);
                let classItem = getClass(date, time);
                // If user has a class booking but classItem wasn't found by date/time, try finding by classId
                if (userBooking?.type === 'class' && userBooking.classId && !classItem) {
                  classItem = classes.find(cls => cls.id === userBooking.classId);
                }
                const today = isToday(date);
                const hasUserClassBooking = userBooking?.type === 'class' && userBooking?.classId === classItem?.id;

                return (
                  <button
                    key={dateIndex}
                    onClick={() => handleTimeSlotClick(date, time)}
                    disabled={past || (reserved && !userBooking && !classItem)}
                    className={`
                      min-h-[60px] p-1 text-center text-xs font-semibold border-r border-gray-300 last:border-r-0
                      transition-all relative
                      ${today ? 'border-r-2 border-yellow-400' : ''}
                      ${past ? 'bg-gray-100 cursor-not-allowed text-gray-400' : ''}
                      ${!past && !reserved && !userBooking && !classItem ? 'hover:bg-yellow-100 cursor-pointer' : ''}
                    `}
                  >
                    {userBooking && userBooking.type !== 'class' && (
                      <div className="h-[52px] px-3 rounded-lg font-bold text-xs leading-tight flex items-center justify-center bg-yellow-500 text-black shadow-md hover:shadow-lg transition-all">
                        ✓ {userBooking.name}
                      </div>
                    )}
                    {classItem && hasUserClassBooking && (
                      <div className="h-[52px] px-3 rounded-lg font-bold text-xs leading-tight flex flex-col items-center justify-center bg-blue-500 text-white shadow-md hover:shadow-lg transition-all">
                        <div>✓ Class</div>
                        <div className="text-[10px]">{classItem.enrolledCount} / {classItem.maxCapacity}</div>
                      </div>
                    )}
                    {classItem && !hasUserClassBooking && (
                      <div className="h-[52px] px-3 rounded-lg font-bold text-xs leading-tight flex flex-col items-center justify-center bg-blue-300 text-black shadow-md hover:shadow-lg transition-all cursor-pointer">
                        <div>Class</div>
                        <div>{classItem.enrolledCount} / {classItem.maxCapacity}</div>
                      </div>
                    )}
                    {reserved && !past && !userBooking && !classItem && (
                      <div className="h-[52px] px-3 rounded-lg bg-gray-300 text-gray-700 font-semibold text-xs leading-tight shadow-sm flex items-center justify-center">
                        <div>All Courts<br />Reserved</div>
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
      <div className="p-4 border-t-2 border-black bg-gray-50 text-center">
        <p className="text-sm italic text-gray-600">
          Click on any available slot to open the booking page.
        </p>
      </div>
      </div>
    </div>
  );
}

