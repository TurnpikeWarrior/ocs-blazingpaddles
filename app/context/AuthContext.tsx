'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Booking } from '../types';
import { MOCK_USERS, MOCK_BOOKINGS } from '../utils/mockData';

interface AuthContextType {
  user: User | null;
  bookings: Booking[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addBooking: (booking: Omit<Booking, 'id' | 'userId'>) => void;
  removeBooking: (bookingId: string) => void;
  updateUserCredits: (credits: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('blazin-user');
    const storedBookings = localStorage.getItem('blazin-bookings');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    } else {
      setBookings(MOCK_BOOKINGS);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in production, this would call an API
    const foundUser = MOCK_USERS.find((u) => u.email === email);
    
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('blazin-user', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('blazin-user');
  };

  const addBooking = (bookingData: Omit<Booking, 'id' | 'userId'>) => {
    if (!user) return;

    const newBooking: Booking = {
      ...bookingData,
      id: `booking-${Date.now()}`,
      userId: user.id,
    };

    const updatedBookings = [...bookings, newBooking];
    setBookings(updatedBookings);
    localStorage.setItem('blazin-bookings', JSON.stringify(updatedBookings));

    // Deduct credits
    const updatedUser = { ...user, credits: user.credits - bookingData.creditCost };
    setUser(updatedUser);
    localStorage.setItem('blazin-user', JSON.stringify(updatedUser));
  };

  const removeBooking = (bookingId: string) => {
    if (!user) return;

    const bookingToRemove = bookings.find(b => b.id === bookingId);
    if (!bookingToRemove) return;

    // Remove the booking
    const updatedBookings = bookings.filter(b => b.id !== bookingId);
    setBookings(updatedBookings);
    localStorage.setItem('blazin-bookings', JSON.stringify(updatedBookings));

    // Refund credits
    const updatedUser = { ...user, credits: user.credits + bookingToRemove.creditCost };
    setUser(updatedUser);
    localStorage.setItem('blazin-user', JSON.stringify(updatedUser));
  };

  const updateUserCredits = (credits: number) => {
    if (!user) return;
    
    const updatedUser = { ...user, credits };
    setUser(updatedUser);
    localStorage.setItem('blazin-user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        bookings: bookings.filter((b) => b.userId === user?.id),
        isAuthenticated: !!user,
        login,
        logout,
        addBooking,
        removeBooking,
        updateUserCredits,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

