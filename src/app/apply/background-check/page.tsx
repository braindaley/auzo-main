"use client";

import { useRouter } from 'next/navigation';

const BackgroundCheckPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 pb-24 flex flex-col">
        <div className="flex-1 p-6 w-full flex flex-col items-center justify-center">
          <div className="max-w-md w-full space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Background check in progress
              </h1>

              <p className="text-gray-600 mt-4 leading-relaxed">
                Thank you for your application! We're currently reviewing your information and conducting a comprehensive background check. This process typically takes up to 48 hours to complete.

                Once approved, you'll receive an email and push notification with instructions on how to get started as an Auzo driver. We appreciate your patience during this review process.
              </p>
            </div>

            <button
              onClick={() => router.push('/')}
              className="w-full bg-black text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors"
            >
              Home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BackgroundCheckPage;