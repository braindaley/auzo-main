"use client";

import DriverNav from '@/components/DriverNav';
import Link from 'next/link';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { useState } from 'react';

const PayoutsPage = () => {
  const [showACHForm, setShowACHForm] = useState(false);
  const [achData, setAchData] = useState({
    accountHolderName: '',
    accountNumber: '',
    routingNumber: '',
    accountType: 'checking'
  });

  // Calculate next Friday
  const getNextFriday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 5 = Friday
    const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7; // If today is Friday, get next Friday
    const nextFriday = new Date(today);
    nextFriday.setDate(today.getDate() + daysUntilFriday);
    return nextFriday;
  };

  // Generate previous 7 Fridays with mock payout data
  const generatePreviousPayouts = () => {
    const payouts = [];
    const amounts = [342.75, 298.50, 417.25, 389.90, 312.40, 445.80, 367.15]; // Mock amounts

    for (let i = 1; i <= 7; i++) {
      const friday = new Date();
      friday.setDate(friday.getDate() - (friday.getDay() + 2 + (i - 1) * 7)); // Previous Fridays
      payouts.push({
        date: friday.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        amount: amounts[i - 1]
      });
    }
    return payouts;
  };

  const nextPayoutDate = getNextFriday().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const previousPayouts = generatePreviousPayouts();
  const currentBalance = 156.75; // Mock current balance

  const handleACHSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the ACH data to your backend
    console.log('ACH Data:', achData);
    alert('Payment method added successfully!');
    setShowACHForm(false);
    setAchData({
      accountHolderName: '',
      accountNumber: '',
      routingNumber: '',
      accountType: 'checking'
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setAchData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 pb-24">
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Link
              href="/drive"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Payouts</h1>
          </div>

          {/* Balance Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Balance</p>
                <p className="text-3xl font-bold text-gray-900">${currentBalance.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Next payout: {nextPayoutDate}</p>
              </div>
              <button
                onClick={() => setShowACHForm(true)}
                className="flex items-center gap-2 mx-auto px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <CreditCard className="w-4 h-4" />
                Payment Method
              </button>
            </div>
          </div>

          {/* Previous Payouts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">Recent Payouts</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {previousPayouts.map((payout, index) => (
                <div key={index} className="p-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{payout.date}</span>
                  <span className="text-sm font-semibold text-gray-900">${payout.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ACH Form Modal */}
        {showACHForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full" style={{ maxWidth: '340px' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add ACH Account</h2>
                <button
                  onClick={() => setShowACHForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleACHSubmit} className="space-y-4">
                <div>
                  <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700 mb-1">
                    Account Holder Name
                  </label>
                  <input
                    id="accountHolderName"
                    type="text"
                    value={achData.accountHolderName}
                    onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                    placeholder="Enter full name on account"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="routingNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Routing Number
                  </label>
                  <input
                    id="routingNumber"
                    type="text"
                    value={achData.routingNumber}
                    onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                    placeholder="9-digit routing number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={9}
                    pattern="[0-9]{9}"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number
                  </label>
                  <input
                    id="accountNumber"
                    type="text"
                    value={achData.accountNumber}
                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                    placeholder="Enter account number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 mb-1">
                    Account Type
                  </label>
                  <select
                    id="accountType"
                    value={achData.accountType}
                    onChange={(e) => handleInputChange('accountType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowACHForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Add Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <DriverNav />
    </div>
  );
};

export default PayoutsPage;