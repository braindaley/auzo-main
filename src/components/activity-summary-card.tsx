"use client";

import { useState, useEffect } from 'react';
import { Activity, ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { transactionStorage, Transaction } from '@/lib/transaction-storage';

export function ActivitySummaryCard() {
  const [recentTransaction, setRecentTransaction] = useState<Transaction | null>(null);
  const [totalTransactions, setTotalTransactions] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const transactions = transactionStorage.getTransactions();
      setTotalTransactions(transactions.length);
      setRecentTransaction(transactions[0] || null); // First item is most recent
    } catch (error) {
      console.error('Error loading transactions:', error);
      setTotalTransactions(0);
      setRecentTransaction(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'in_progress':
        return 'text-blue-600 bg-blue-50';
      case 'matched':
        return 'text-yellow-600 bg-yellow-50';
      case 'requested':
        return 'text-gray-600 bg-gray-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusLabel = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'matched':
        return 'Driver Matched';
      case 'requested':
        return 'Requested';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <Link href="/activity">
      <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
              <Activity className="h-6 w-6 text-gray-700" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Activity</h3>
              <p className="text-sm text-gray-600">
                {isLoading ? (
                  "Loading..."
                ) : totalTransactions === 0 ? (
                  "No activity yet"
                ) : totalTransactions === 1 ? (
                  "1 service"
                ) : (
                  `${totalTransactions} services`
                )}
              </p>
            </div>
          </div>
          
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>

        {/* Recent transaction preview */}
        {recentTransaction && !isLoading && (
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(recentTransaction.status)}`}>
                    {getStatusLabel(recentTransaction.status)}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm">
                    <span className="text-gray-700 truncate">
                      {recentTransaction.vehicle.year} {recentTransaction.vehicle.make} {recentTransaction.vehicle.model}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}