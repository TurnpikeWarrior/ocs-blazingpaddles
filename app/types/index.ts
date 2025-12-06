// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  credits: number;
}

// Booking Types
export type BookingType = 'court' | 'class';

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  type?: BookingType;
  className?: string;
}

export interface Booking {
  id: string;
  userId: string;
  date: string;
  time: string;
  type: BookingType;
  name: string;
  creditCost: number;
  courtNumber?: number;
}

// Calendar Types
export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  hasBookings: boolean;
}

