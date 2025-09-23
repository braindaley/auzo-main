"use client";

import DriverNav from '@/components/DriverNav';

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
              <p className="text-2xl font-bold">$0.00</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">Trips Today</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>
      </main>

      <DriverNav />
    </div>
  );
};

export default DrivePage;