'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { Class } from '../types';
import { CREDIT_COSTS } from '../utils/mockData';

export default function AdminPage() {
  const { user, classes, isAuthenticated, isAdmin, logout, createClass, deleteClass } = useAuth();
  const router = useRouter();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [className, setClassName] = useState('');
  const [classDate, setClassDate] = useState('');
  const [classTime, setClassTime] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [classToDelete, setClassToDelete] = useState<Class | null>(null);

  // Protect route - admin only
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/member');
    }
  }, [isAuthenticated, isAdmin, router]);

  // Handle ESC key to close modals
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showErrorModal) {
          setShowErrorModal(false);
        } else if (showDeleteModal) {
          handleCancelDelete();
        } else if (showCreateModal) {
          setShowCreateModal(false);
        }
      }
    };

    if (showCreateModal || showErrorModal || showDeleteModal) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showCreateModal, showErrorModal, showDeleteModal]);

  if (!user || !isAdmin) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleCreateClass = () => {
    if (!className.trim()) {
      setErrorMessage('Please enter a class name.');
      setShowErrorModal(true);
      return;
    }

    if (!classDate) {
      setErrorMessage('Please select a date.');
      setShowErrorModal(true);
      return;
    }

    if (!classTime) {
      setErrorMessage('Please select a time.');
      setShowErrorModal(true);
      return;
    }

    createClass({
      name: className,
      date: classDate,
      time: classTime,
      maxCapacity: 20,
      creditCost: CREDIT_COSTS.class,
    });

    // Reset form
    setClassName('');
    setClassDate('');
    setClassTime('');
    setShowCreateModal(false);
  };

  const handleDeleteClass = (classItem: Class) => {
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

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setClassToDelete(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
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
              Admin Dashboard
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Manage classes and view system information.
            </p>
          </div>

          {/* Create Class Button */}
          <div className="mb-8">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-8 py-4 bg-black text-white font-bold text-lg uppercase tracking-wide hover:bg-gray-800 transition-colors border-2 border-black"
            >
              + Create New Class
            </button>
          </div>

          {/* Classes List */}
          {sortedClasses.length === 0 ? (
            <div className="bg-[#faf9f7] border-4 border-black p-12 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-2xl font-bold mb-3 uppercase tracking-wide">
                No Classes Created
              </h2>
              <p className="text-gray-600">
                Create your first class to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedClasses.map((classItem) => (
                <div
                  key={classItem.id}
                  className="bg-[#faf9f7] border-4 border-black p-6 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">👨‍🏫</div>
                    <button
                      onClick={() => handleDeleteClass(classItem)}
                      className="px-3 py-1 bg-red-500 text-white font-bold text-xs uppercase tracking-wide hover:bg-red-600 transition-colors border-2 border-black"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-black uppercase tracking-tight">
                      {classItem.name}
                    </h3>
                    
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
                        <span className="font-semibold">
                          {classItem.enrolledCount} / {classItem.maxCapacity}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-bold">Credit Cost:</span>
                        <span className="font-semibold">{classItem.creditCost} Credit</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Class Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#faf9f7] border-4 border-black max-w-lg w-full">
            {/* Modal Header */}
            <div className="bg-yellow-400 border-b-4 border-black p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tight mb-2">
                    Create New Class
                  </h2>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-3xl font-bold hover:opacity-70"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wide mb-3">
                  Class Name
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-yellow-400 font-semibold"
                  placeholder="e.g., Beginner Fundamentals"
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wide mb-3">
                  Date
                </label>
                <input
                  type="date"
                  value={classDate}
                  onChange={(e) => setClassDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-yellow-400 font-semibold"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wide mb-3">
                  Time
                </label>
                <select
                  value={classTime}
                  onChange={(e) => setClassTime(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-yellow-400 font-semibold"
                >
                  <option value="">Select time...</option>
                  {['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
                    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', 
                    '6:00 PM', '7:00 PM', '8:00 PM'].map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-gray-50 border-2 border-gray-300 p-4">
                <h3 className="font-bold uppercase text-sm mb-2">Class Details</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-semibold">Max Capacity:</span> 20 students</p>
                  <p><span className="font-semibold">Credit Cost:</span> {CREDIT_COSTS.class} Credit</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setClassName('');
                    setClassDate('');
                    setClassTime('');
                  }}
                  className="flex-1 py-4 bg-[#faf9f7] text-black font-bold text-lg uppercase tracking-wide hover:bg-gray-100 transition-colors border-2 border-black"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateClass}
                  className="flex-1 py-4 bg-yellow-400 text-black font-bold text-lg uppercase tracking-wide hover:bg-yellow-300 transition-colors border-4 border-black"
                >
                  Create Class
                </button>
              </div>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && classToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#faf9f7] border-4 border-black max-w-md w-full">
            {/* Modal Header */}
            <div className="bg-red-500 border-b-4 border-black p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tight text-white">
                    Confirm Deletion
                  </h2>
                </div>
                <button
                  onClick={handleCancelDelete}
                  className="text-3xl font-bold hover:opacity-70 text-white"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div className="bg-red-50 border-2 border-red-300 p-4">
                <p className="text-base text-red-900 font-semibold mb-2">
                  Are you sure you want to delete this class?
                </p>
                <div className="text-sm text-red-800 space-y-1">
                  <p><span className="font-bold">Class:</span> {classToDelete.name}</p>
                  <p><span className="font-bold">Date:</span> {formatDate(classToDelete.date)}</p>
                  <p><span className="font-bold">Time:</span> {formatTime(classToDelete.time)}</p>
                  <p className="mt-2 font-bold">
                    ⚠️ All {classToDelete.enrolledCount} enrollment(s) will be cancelled and credits refunded.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 py-4 bg-[#faf9f7] text-black font-bold text-lg uppercase tracking-wide hover:bg-gray-100 transition-colors border-2 border-black"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 py-4 bg-red-500 text-white font-bold text-lg uppercase tracking-wide hover:bg-red-600 transition-colors border-4 border-black"
                >
                  Delete Class
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

