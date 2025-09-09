"use client";

import { WalletCreditCardList } from '@/components/wallet-credit-card-list';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const WalletPage = () => {
  // TODO: Replace with actual user authentication
  // For now, using a placeholder user ID
  const userId = "demo-user-123"; // This should come from your auth system
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
        <main className="flex-1 pb-24">
            <div className="p-6 space-y-6">
                <div className="space-y-4">
                    <Link 
                        href="/account" 
                        className="inline-flex items-center gap-3 text-gray-900 hover:text-gray-700 transition-colors no-underline"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-lg font-medium">Account</span>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Wallet</h1>
                        <p className="text-gray-600 mt-2">
                            Manage your payment methods and cards
                        </p>
                    </div>
                </div>
                
                <WalletCreditCardList userId={userId} />
            </div>
        </main>
    </div>
  );
};

export default WalletPage;