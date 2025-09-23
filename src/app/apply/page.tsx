"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ApplyPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    zipCode: '',
    referralCode: '',
    age: '',
    ssnNumber: '',
  });
  const [zipError, setZipError] = useState('');

  const validateZipCode = (zip: string) => {
    const zipRegex = /^\d{5}$/;
    return zipRegex.test(zip);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.zipCode) {
        setZipError('Zip code is required');
        return;
      }
      if (!validateZipCode(formData.zipCode)) {
        setZipError('Please enter a valid 5-digit zip code');
        return;
      }
      setZipError('');
    }

    if (currentStep === 4) {
      router.push('/apply/background-check');
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      router.push('/drivers');
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const formatSSN = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 9);

    if (limited.length >= 6) {
      return `${limited.slice(0, 3)}-${limited.slice(3, 5)}-${limited.slice(5)}`;
    } else if (limited.length >= 3) {
      return `${limited.slice(0, 3)}-${limited.slice(3)}`;
    }
    return limited;
  };

  const handleSSNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSSN(e.target.value);
    setFormData({ ...formData, ssnNumber: formatted });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 pb-24 flex flex-col">
        <div className="flex-1 p-6 w-full flex flex-col">
          <div className="mb-6">
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`flex-1 h-2 rounded-full ${
                    step <= currentStep ? 'bg-black' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {currentStep === 1 && (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Earn with Auzo</h1>
                  <p className="text-gray-600 mt-2">
                    Start earning extra money on your own schedule
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zip code
                    </label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                        setFormData({ ...formData, zipCode: value });
                        if (zipError) setZipError('');
                      }}
                      className={`w-full px-4 py-3 border ${zipError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-black focus:border-transparent`}
                      placeholder="Enter your zip code"
                      maxLength={5}
                    />
                    {zipError && (
                      <p className="mt-1 text-sm text-red-600">{zipError}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Referral code (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.referralCode}
                      onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Enter referral code"
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  By proceeding, I agree that Auzo or its representatives may contact you by email, phone, SMS.
                </p>
              </div>

              <div className="flex space-x-3 mt-auto">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-gray-200 text-gray-900 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-black text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">What is your age</h1>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center bg-white px-6 py-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="age"
                      value="25+"
                      checked={formData.age === '25+'}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-5 h-5 text-black focus:ring-black border-gray-300"
                    />
                    <span className="ml-3 text-lg font-medium text-gray-900">25 years or older</span>
                  </label>

                  <label className="flex items-center bg-white px-6 py-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="age"
                      value="18-24"
                      checked={formData.age === '18-24'}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-5 h-5 text-black focus:ring-black border-gray-300"
                    />
                    <span className="ml-3 text-lg font-medium text-gray-900">18-24 years</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 mt-auto">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-gray-200 text-gray-900 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-black text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors"
                  disabled={!formData.age}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Background check</h1>
                  <p className="text-gray-600 mt-2">
                    Review the following disclosure
                  </p>
                </div>

                <div className="bg-gray-100 rounded-lg p-4 h-64 overflow-y-auto">
                  <p className="text-sm text-gray-700">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                  </p>
                </div>
              </div>

              <div className="flex space-x-3 mt-auto">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-gray-200 text-gray-900 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-black text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors"
                >
                  Agree
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 space-y-6 overflow-y-auto">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Background check</h1>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Social security number
                  </label>
                  <input
                    type="text"
                    value={formData.ssnNumber}
                    onChange={handleSSNChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="XXX-XX-XXXX"
                  />
                </div>

                <div className="space-y-4 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-medium">How will my SSN be used?</p>
                      <p>Your SSN will be used to conduct a comprehensive background check and to manage your tax reporting and payouts securely.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.143 8 8c0-.143.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.439.433.582 0 .143-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-medium">Pay a $20 refundable deposit</p>
                      <p>You'll get your deposit back after completing 5 successful trips. This helps us maintain a committed driver community.</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500">
                    By my electronic signature, I hereby authorize Auzo to conduct a background check for the purpose of evaluating my eligibility to drive on the platform. I understand that this check will include criminal history, driving records, and other relevant information.
                  </p>
                </div>
              </div>

              <div className="flex flex-col space-y-3 mt-auto">
                <button
                  onClick={handleNext}
                  className="w-full bg-black text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors"
                >
                  Agree and acknowledge
                </button>
                <button
                  onClick={handleBack}
                  className="w-full bg-gray-200 text-gray-900 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ApplyPage;