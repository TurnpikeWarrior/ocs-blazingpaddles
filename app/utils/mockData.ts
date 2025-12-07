import { User, Booking } from '../types';

// Mock user data
export const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'member@blazinpaddles.com',
    name: 'Alex Johnson',
    credits: 15,
    role: 'member',
  },
  {
    id: '2',
    email: 'admin@blazinpaddles.com',
    name: 'Admin User',
    credits: 999,
    role: 'admin',
  },
];

// Mock bookings data
export const MOCK_BOOKINGS: Booking[] = [
  {
    id: '1',
    userId: '1',
    date: '2024-12-15',
    time: '10:00 AM',
    type: 'court',
    name: 'Court 1',
    creditCost: 3,
    courtNumber: 1,
  },
  {
    id: '2',
    userId: '1',
    date: '2024-12-18',
    time: '2:00 PM',
    type: 'class',
    name: 'Beginner Fundamentals',
    creditCost: 1,
  },
];

// Operating hours
export const OPERATING_HOURS = {
  start: 7, // 7 AM
  end: 20,  // 8 PM (20:00)
};

// Generate time slots for a day
export function generateTimeSlots() {
  const slots = [];
  for (let hour = OPERATING_HOURS.start; hour < OPERATING_HOURS.end; hour++) {
    const time12h = hour > 12 ? hour - 12 : hour;
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayTime = `${time12h}:00 ${period}`;
    
    slots.push({
      id: `slot-${hour}`,
      time: displayTime,
      available: Math.random() > 0.3, // Random availability for demo
    });
  }
  return slots;
}

// Credit costs
export const CREDIT_COSTS = {
  court: 3,
  class: 1,
};

// Mock classes available
export const AVAILABLE_CLASSES = [
  { id: 'class-1', name: 'Beginner Fundamentals', time: '9:00 AM', credits: 1 },
  { id: 'class-2', name: 'Advanced Techniques', time: '11:00 AM', credits: 1 },
  { id: 'class-3', name: 'Tournament Prep', time: '3:00 PM', credits: 1 },
  { id: 'class-4', name: 'Youth Clinic', time: '4:00 PM', credits: 1 },
];

