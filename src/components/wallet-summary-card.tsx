"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { getActiveCreditCards } from '@/lib/services/credit-card-service';
import { CreditCard as CreditCardType } from '@/lib/types/credit-card';

interface WalletSummaryCardProps {
  userId: string;
}

export function WalletSummaryCard({ userId }: WalletSummaryCardProps) {
  const [cardCount, setCardCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCardCount = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        const cards = await getActiveCreditCards(userId);
        setCardCount(cards.length);
      } catch (error) {
        console.error('Error loading card count:', error);
        setCardCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadCardCount();
  }, [userId]);

  return (
    <Link href="/wallet">
      <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group border border-gray-100">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
          <p className="text-sm text-gray-600">
            {isLoading ? (
              "Loading..."
            ) : cardCount === 0 ? (
              "No payment methods"
            ) : cardCount === 1 ? (
              "1 payment method"
            ) : (
              `${cardCount} payment methods`
            )}
          </p>
        </div>
      </div>
    </Link>
  );
}