'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Booking, Class } from '../types';
import { MOCK_USERS, MOCK_BOOKINGS } from '../utils/mockData';

interface AuthContextType {
  user: User | null;
  bookings: Booking[];
  classes: Class[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addBooking: (booking: Omit<Booking, 'id' | 'userId'>) => void;
  removeBooking: (bookingId: string) => void;
  updateUserCredits: (credits: number) => void;
  createClass: (classData: Omit<Class, 'id' | 'enrolledCount'>) => void;
  deleteClass: (classId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('blazin-user');
    const storedBookings = localStorage.getItem('blazin-bookings');
    const storedClasses = localStorage.getItem('blazin-classes');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    } else {
      setBookings(MOCK_BOOKINGS);
    }

    if (storedClasses) {
      setClasses(JSON.parse(storedClasses));
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

    // If it's a class booking, update class enrollment
    if (bookingData.type === 'class' && bookingData.classId) {
      const updatedClasses = classes.map(cls => 
        cls.id === bookingData.classId 
          ? { ...cls, enrolledCount: cls.enrolledCount + 1 }
          : cls
      );
      setClasses(updatedClasses);
      localStorage.setItem('blazin-classes', JSON.stringify(updatedClasses));
    }

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

    // If it's a class booking, update class enrollment
    if (bookingToRemove.type === 'class' && bookingToRemove.classId) {
      const updatedClasses = classes.map(cls => 
        cls.id === bookingToRemove.classId 
          ? { ...cls, enrolledCount: Math.max(0, cls.enrolledCount - 1) }
          : cls
      );
      setClasses(updatedClasses);
      localStorage.setItem('blazin-classes', JSON.stringify(updatedClasses));
    }

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

  const createClass = (classData: Omit<Class, 'id' | 'enrolledCount'>) => {
    const newClass: Class = {
      ...classData,
      id: `class-${Date.now()}`,
      enrolledCount: 0,
    };

    const updatedClasses = [...classes, newClass];
    setClasses(updatedClasses);
    localStorage.setItem('blazin-classes', JSON.stringify(updatedClasses));
  };

  const deleteClass = (classId: string) => {
    const updatedClasses = classes.filter(c => c.id !== classId);
    setClasses(updatedClasses);
    localStorage.setItem('blazin-classes', JSON.stringify(updatedClasses));

    // Also remove all bookings for this class
    const updatedBookings = bookings.filter(b => b.classId !== classId);
    setBookings(updatedBookings);
    localStorage.setItem('blazin-bookings', JSON.stringify(updatedBookings));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        bookings: bookings.filter((b) => b.userId === user?.id),
        classes,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        logout,
        addBooking,
        removeBooking,
        updateUserCredits,
        createClass,
        deleteClass,
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

