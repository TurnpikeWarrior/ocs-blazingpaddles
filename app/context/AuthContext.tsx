'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Booking, Class } from '../types';
import { supabaseClient } from '../lib/supabase-client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  bookings: Booking[];
  classes: Class[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithOAuth: (provider: 'google' | 'github' | 'facebook') => Promise<void>;
  logout: () => Promise<void>;
  addBooking: (booking: Omit<Booking, 'id' | 'userId'>) => Promise<void>;
  removeBooking: (bookingId: string) => Promise<void>;
  updateUserCredits: (credits: number) => Promise<void>;
  createClass: (classData: Omit<Class, 'id' | 'enrolledCount'>) => Promise<void>;
  deleteClass: (classId: string) => Promise<void>;
  joinClass: (classId: string) => Promise<void>;
  leaveClass: (classId: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);

  // Fetch bookings and classes from API
  const fetchBookings = async (userId?: string) => {
    try {
      const url = userId ? `/api/bookings?userId=${userId}` : '/api/bookings';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes');
      if (response.ok) {
        const data = await response.json();
        setClasses(data);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const refreshData = async () => {
    if (user) {
      await fetchBookings(user.id);
    }
    await fetchClasses();
  };

  // Sync Supabase Auth user to our users table
  const syncUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      // Check if user exists in our users table
      const response = await fetch(`/api/users?email=${encodeURIComponent(supabaseUser.email!)}`);
      
      if (response.ok) {
        // User exists, use it
        const existingUser = await response.json();
        setUser(existingUser);
        await fetchBookings(existingUser.id);
      } else {
        // User doesn't exist, create profile in users table
        const newUser = {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email!.split('@')[0],
          credits: 10, // Default credits for new users
          role: 'member' as const,
        };
        
        const createResponse = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser),
        });
        
        if (createResponse.ok) {
          const createdUser = await createResponse.json();
          setUser(createdUser);
          await fetchBookings(createdUser.id);
        }
      }
    } catch (error) {
      console.error('Error syncing user profile:', error);
    }
  };

  // Initialize auth state and listen for changes
  useEffect(() => {
    // Check for Supabase session first
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        syncUserProfile(session.user);
      } else {
        // If no Supabase session, check localStorage for email/password login
        const storedUser = localStorage.getItem('blazin-user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          fetchBookings(parsedUser.id);
        }
      }
      fetchClasses();
    });

    // Listen for auth changes (OAuth)
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await syncUserProfile(session.user);
      } else {
        // Only clear if we're not using email/password login
        const storedUser = localStorage.getItem('blazin-user');
        if (!storedUser) {
          setUser(null);
          setBookings([]);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Email/password login (original method)
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Fetch user from Supabase users table
      const response = await fetch(`/api/users?email=${encodeURIComponent(email)}`);
      
      if (!response.ok) {
        // User not found or error
        return false;
      }
      
      const foundUser = await response.json();
      
      // Simple password check (in production, use Supabase Auth with hashed passwords)
      // For now, we'll use a simple check - you should implement proper authentication
      if (password === 'password') {
        setUser(foundUser);
        localStorage.setItem('blazin-user', JSON.stringify(foundUser));
        // Fetch data after login
        await fetchBookings(foundUser.id);
        await fetchClasses();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  const loginWithOAuth = async (provider: 'google' | 'github' | 'facebook') => {
    try {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        console.error('Error signing in with OAuth:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error during OAuth login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Sign out from Supabase if OAuth was used
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (session) {
        await supabaseClient.auth.signOut();
      }
      
      // Clear local storage (for email/password login)
      localStorage.removeItem('blazin-user');
      
      setUser(null);
      setBookings([]);
      setClasses([]);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const addBooking = async (bookingData: Omit<Booking, 'id' | 'userId'>) => {
    if (!user) return;

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bookingData,
          userId: user.id,
        }),
      });

      if (response.ok) {
        const newBooking = await response.json();
        
        // Deduct credits
        await updateUserCredits(user.credits - bookingData.creditCost);

        // Immediately update local bookings state
        setBookings(prevBookings => [...prevBookings, newBooking]);

        // Refresh data from API (enrollment count is calculated from bookings automatically)
        await refreshData();
      }
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  const removeBooking = async (bookingId: string) => {
    if (!user) return;

    const bookingToRemove = bookings.find(b => b.id === bookingId);
    if (!bookingToRemove) return;

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refund credits
        await updateUserCredits(user.credits + bookingToRemove.creditCost);

        // Immediately update local bookings state
        setBookings(prevBookings => prevBookings.filter(b => b.id !== bookingId));

        // Refresh data from API (enrollment count is calculated from bookings automatically)
        await refreshData();
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  const updateUserCredits = async (credits: number) => {
    if (!user) return;
    
    try {
      // Update in database
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, credits }),
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Error updating user credits:', error);
    }
  };

  const createClass = async (classData: Omit<Class, 'id' | 'enrolledCount'>) => {
    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...classData,
          enrolledCount: 0,
        }),
      });

      if (response.ok) {
        await fetchClasses();
      }
    } catch (error) {
      console.error('Error creating class:', error);
    }
  };

  const deleteClass = async (classId: string) => {
    try {
      const response = await fetch(`/api/classes/${classId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await refreshData();
      }
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  const joinClass = async (classId: string) => {
    if (!user) return;

    const classItem = classes.find(c => c.id === classId);
    if (!classItem) return;

    // Create a booking for the class
    await addBooking({
      date: classItem.date,
      time: classItem.time,
      type: 'class',
      name: classItem.name,
      creditCost: classItem.creditCost,
      classId: classId,
    });
  };

  const leaveClass = async (classId: string) => {
    if (!user) return;

    const booking = bookings.find(b => b.classId === classId && b.userId === user.id);
    if (booking) {
      await removeBooking(booking.id);
    }
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
        loginWithOAuth,
        logout,
        addBooking,
        removeBooking,
        updateUserCredits,
        createClass,
        deleteClass,
        joinClass,
        leaveClass,
        refreshData,
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

