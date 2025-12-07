'use client';

import { useState, useEffect } from 'react';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number>(2025);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-black text-white border-t-2 border-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-3 uppercase tracking-wide">Blazin' Paddles</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your premier destination for pickleball courts, classes, and community play.
            </p>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg font-bold mb-3 uppercase tracking-wide">Hours</h3>
            <p className="text-gray-300 text-sm">
              <span className="font-semibold">Every Day:</span> 7:00 AM - 8:00 PM
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-3 uppercase tracking-wide">Contact</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Email: info@blazinpaddles.com<br />
              Phone: (555) 123-4567
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
          © {currentYear} Blazin' Paddles. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

