"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Home } from 'lucide-react';

const DriverNav = () => {
  const [isOnline, setIsOnline] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleOnline = () => {
    if (!isOnline && pathname !== '/drive/online') {
      router.push('/drive/online');
    } else if (pathname === '/drive/online') {
      router.push('/drive');
    }
    setIsOnline(!isOnline);
  };

  // Determine if user is currently online based on the current route
  const isCurrentlyOnline = pathname === '/drive/online';

  return (
    <footer className="sticky bottom-0 z-10 bg-white border-t border-gray-200" style={{ height: '96px' }}>
      <div className="container mx-auto px-0 h-full">
        <div className="grid grid-cols-2 h-full">
          <Link
            href="/drive"
            className="flex flex-col items-center justify-center h-full text-gray-600 hover:text-black transition-colors no-underline"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>

          <div className="flex items-center justify-center h-full">
            <button
              onClick={toggleOnline}
              className={`flex items-center justify-center font-semibold transition-colors rounded-lg px-6 py-3 border ${
                isCurrentlyOnline
                  ? 'bg-transparent border-gray-400 text-gray-700 hover:bg-gray-50'
                  : 'bg-black text-white hover:bg-gray-800 border-black'
              }`}
            >
              {isCurrentlyOnline ? "You're Online" : 'Go Online'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DriverNav;