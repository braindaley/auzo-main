"use client";

import { useState } from 'react';
import Link from 'next/link';

const DriversPage = () => {
  const [hasApplied, setHasApplied] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const handleApply = () => {
    setHasApplied(true);
    setTimeout(() => {
      setIsApproved(true);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 pb-24">
        <div className="p-6 space-y-8 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900">Drive with Auzo</h1>

          <div className="relative w-full h-48 md:h-64 bg-gray-200 rounded-xl overflow-hidden">
          </div>

          <div className="flex flex-col space-y-4">
            {!hasApplied ? (
              <Link
                href="/apply"
                className="w-full bg-black text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors text-center block no-underline"
              >
                Apply Now
              </Link>
            ) : (
              <>
                {isApproved && (
                  <>
                    <p className="text-sm text-gray-600 text-center">You've been approved! Start driving</p>
                    <Link
                      href="/drive"
                      className="w-full bg-black text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors text-center block no-underline"
                    >
                      Go Online
                    </Link>
                  </>
                )}
                {!isApproved && (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <p className="text-sm text-gray-600">Processing your application...</p>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-lg text-gray-700 leading-relaxed">
              Join the Auzo driver community and start earning extra money on your own schedule.
              Whether you're looking for a flexible side hustle or a full-time opportunity,
              driving with Auzo gives you the freedom to work when you want, where you want.
              Set your own hours, be your own boss, and earn competitive rates for every trip you complete.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">You've been approved</h2>
            <Link
              href="/drive"
              className="w-full bg-black text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors text-center block no-underline"
            >
              Go online
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DriversPage;