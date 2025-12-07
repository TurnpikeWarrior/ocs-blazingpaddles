'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import { Class } from '../../types';

export default function MyClassesPage() {
  const { user, classes, isAuthenticated, isAdmin, logout, deleteClass } = useAuth();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [classToDelete, setClassToDelete] = useState<Class | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string>('');

  // Protect route - admin only
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/member');
    }
  }, [isAuthenticated, isAdmin, router]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showInfoModal) {
          setShowInfoModal(false);
        } else if (showDeleteModal) {
          handleCloseDeleteModal();
        }
      }
    };

    if (showDeleteModal || showInfoModal) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showDeleteModal, showInfoModal]);

  if (!user || !isAdmin) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleDeleteClick = (classItem: Class) => {
    setClassToDelete(classItem);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (classToDelete) {
      deleteClass(classToDelete.id);
      setShowDeleteModal(false);
      setClassToDelete(null);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setClassToDelete(null);
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

  // Sort classes by date
  const sortedClasses = [...classes].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Separate upcoming and past classes
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingClasses = sortedClasses.filter(
    (classItem) => new Date(classItem.date) >= today
  );
  
  const pastClasses = sortedClasses.filter(
    (classItem) => new Date(classItem.date) < today
  );

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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2">
              My Classes
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              View and manage all classes you've created.
            </p>
          </div>

          {/* No Classes State */}
          {classes.length === 0 && (
            <div className="bg-[#faf9f7] border-4 border-black p-12 text-center">
              <div className="text-6xl mb-4">👨‍🏫</div>
              <h2 className="text-2xl font-bold mb-3 uppercase tracking-wide">
                No Classes Yet
              </h2>
              <p className="text-gray-600 mb-6">
                You haven't created any classes yet. Start by creating a class!
              </p>
              <Link
                href="/admin"
                className="inline-block px-8 py-4 bg-black text-white font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors"
              >
                Create Class
              </Link>
            </div>
          )}

          {/* Upcoming Classes */}
          {upcomingClasses.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-yellow-400 border-2 border-black" />
                Upcoming Classes
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingClasses.map((classItem) => (
                  <div
                    key={classItem.id}
                    className="bg-[#faf9f7] border-4 border-black p-6 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">👨‍🏫</div>
                      <div className="flex flex-col gap-2 items-stretch">
                        <button
                          onClick={() => handleDeleteClick(classItem)}
                          className="px-4 py-2 bg-red-500 text-white font-bold text-xs uppercase tracking-wide hover:bg-red-600 transition-colors border-2 border-black text-center whitespace-nowrap"
                        >
                          Delete Class
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-black uppercase tracking-tight">
                        {classItem.name}
                      </h3>
                      
                      <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Class
                      </div>

                      <div className="pt-3 border-t-2 border-gray-200 space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-bold">Date:</span>
                          <span className="font-semibold">{formatDate(classItem.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-bold">Time:</span>
                          <span className="font-semibold">{formatTime(classItem.time)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-bold">Enrollment:</span>
                          <span className="font-semibold">{classItem.enrolledCount} / {classItem.maxCapacity}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-bold">Credit Cost:</span>
                          <span className="font-semibold">{classItem.creditCost} {classItem.creditCost === 1 ? 'Credit' : 'Credits'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past Classes */}
          {pastClasses.length > 0 && (
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-gray-400 border-2 border-black" />
                Past Classes
              </h2>
              
              <div className="bg-[#faf9f7] border-4 border-black overflow-hidden">
                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-black text-white">
                        <th className="px-6 py-4 text-left text-sm font-black uppercase tracking-wide border-r-2 border-gray-700">
                          Class Name
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-black uppercase tracking-wide border-r-2 border-gray-700">
                          Date
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-black uppercase tracking-wide border-r-2 border-gray-700">
                          Time
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-black uppercase tracking-wide border-r-2 border-gray-700">
                          Enrollment
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-black uppercase tracking-wide">
                          Credit Cost
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pastClasses.map((classItem, index) => (
                        <tr 
                          key={classItem.id}
                          className={`${
                            index % 2 === 0 ? 'bg-[#faf9f7]' : 'bg-[#f5f4f2]'
                          } border-t-2 border-gray-300 hover:bg-gray-100 transition-colors`}
                        >
                          <td className="px-6 py-4 font-bold text-gray-700">
                            {classItem.name}
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-700 text-center">
                            {formatDateShort(classItem.date)}
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-700 text-center">
                            {formatTime(classItem.time)}
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-700 text-center">
                            {classItem.enrolledCount} / {classItem.maxCapacity}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-block px-3 py-1 bg-gray-200 border-2 border-gray-400 text-xs font-bold uppercase text-gray-600">
                              {classItem.creditCost}
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
          {classes.length > 0 && (
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/admin"
                className="px-8 py-4 bg-black text-white font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors text-center border-2 border-black"
              >
                Book Another Class
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && classToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#faf9f7] border-4 border-black max-w-lg w-full">
            {/* Modal Header */}
            <div className="bg-red-500 border-b-4 border-black p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tight text-black">
                    Delete Class
                  </h2>
                </div>
                <button
                  onClick={handleCloseDeleteModal}
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
                  You are about to delete <span className="font-bold">"{classToDelete.name}"</span>
                </p>
                <p className="text-sm mb-4 text-red-800">
                  This will also cancel all student enrollments for this class and refund their credits.
                </p>
                <div className="bg-[#faf9f7] border-2 border-red-300 p-4 space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">Date:</span>{' '}
                    {new Date(classToDelete.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p>
                    <span className="font-semibold">Time:</span> {formatTime(classToDelete.time)}
                  </p>
                  <p>
                    <span className="font-semibold">Enrollment:</span> {classToDelete.enrolledCount} / {classToDelete.maxCapacity} students
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleCloseDeleteModal}
                  className="flex-1 py-4 bg-[#faf9f7] text-black font-bold text-lg uppercase tracking-wide hover:bg-gray-100 transition-colors border-2 border-black"
                >
                  No, Keep It
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 py-4 bg-red-500 text-white font-bold text-lg uppercase tracking-wide hover:bg-red-600 transition-colors border-4 border-black"
                >
                  Yes, Delete
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

