"use client";

import DriverNav from '@/components/DriverNav';
import Link from 'next/link';

const DrivePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 pb-24">
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Welcome Back!</h2>
            <p className="text-gray-600">Toggle your status using the button below to start accepting rides.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">Today's Earnings</p>
              <p className="text-2xl font-bold">$75.58</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">Trips Today</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Link href="/drive/earnings" className="block bg-white rounded-xl px-6 pt-3 pb-3 shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors no-underline">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 m-0">Earnings</h3>
                <div className="text-gray-400">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            <Link href="/drive/public-profile" className="block bg-white rounded-xl px-6 pt-3 pb-3 shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors no-underline">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 m-0">Public Profile</h3>
                <div className="text-gray-400">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            <Link href="/drive/payouts" className="block bg-white rounded-xl px-6 pt-3 pb-3 shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors no-underline">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 m-0">Payouts</h3>
                <div className="text-gray-400">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>

      <DriverNav />
    </div>
  );
};

export default DrivePage;