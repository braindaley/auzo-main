"use client";

import { useState, useEffect } from 'react';
import { CreditCard, Loader2, Plus } from 'lucide-react';

import { WalletCreditCardItem } from './wallet-credit-card-item';
import { CreditCardForm } from './credit-card-form';

import { 
  CreditCard as CreditCardType, 
  CreditCardFormData 
} from '@/lib/types/credit-card';
import { 
  addCreditCard, 
  getActiveCreditCards, 
  setDefaultCreditCard, 
  deleteCreditCard 
} from '@/lib/services/credit-card-service';

interface WalletCreditCardListProps {
  userId: string;
}

export function WalletCreditCardList({ userId }: WalletCreditCardListProps) {
  const [creditCards, setCreditCards] = useState<CreditCardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const loadCreditCards = async () => {
    if (!userId) {
      console.log('No userId provided');
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      console.log('Loading credit cards for user:', userId);
      const cards = await getActiveCreditCards(userId);
      console.log('Loaded cards:', cards);
      
      // Sort cards: default first, then by creation date
      const sortedCards = cards.sort((a, b) => {
        if (a.isDefault && !b.isDefault) return -1;
        if (!a.isDefault && b.isDefault) return 1;
        if (a.createdAt && b.createdAt) {
          const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : a.createdAt.toMillis();
          const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : b.createdAt.toMillis();
          return bTime - aTime; // Most recent first
        }
        return 0;
      });
      setCreditCards(sortedCards);
    } catch (error) {
      console.error('Error loading credit cards:', error);
      // Set empty array on error so we don't stay in loading state
      setCreditCards([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCreditCards();
  }, [userId]);

  const handleAddCard = async (cardData: CreditCardFormData) => {
    if (!userId) throw new Error('User ID is required');
    
    setIsSubmitting(true);
    try {
      const cardInput = {
        cardNumber: cardData.cardNumber.replace(/\s/g, ''),
        cardholderName: cardData.cardholderName,
        expiryMonth: parseInt(cardData.expiryMonth),
        expiryYear: parseInt(cardData.expiryYear),
        cvv: cardData.cvv,
        nickname: cardData.nickname || undefined,
        billingAddress: cardData.billingAddress,
        isDefault: cardData.isDefault,
      };

      await addCreditCard(userId, cardInput);
      await loadCreditCards(); // Reload the list
      setShowAddForm(false); // Hide the form after successful submission
    } catch (error) {
      console.error('Error adding credit card:', error);
      throw error; // Re-throw to let the form handle the error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetDefault = async (cardId: string) => {
    if (!userId) return;
    
    try {
      await setDefaultCreditCard(userId, cardId);
      await loadCreditCards(); // Reload to show updated default status
    } catch (error) {
      console.error('Error setting default card:', error);
      throw error;
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!userId) return;
    
    try {
      await deleteCreditCard(userId, cardId);
      await loadCreditCards(); // Reload the list
    } catch (error) {
      console.error('Error deleting credit card:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <CreditCard className="h-5 w-5 text-gray-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Payment</h2>
              <p className="text-sm text-gray-600">
                Manage your credit cards and payment methods
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
            <span className="ml-3 text-gray-600">Loading payment methods...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Methods Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <CreditCard className="h-5 w-5 text-gray-700" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Payment</h2>
                <p className="text-sm text-gray-600">
                  {creditCards.length === 0 ? 'No cards added' : `${creditCards.length} card${creditCards.length === 1 ? '' : 's'}`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {creditCards.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CreditCard className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No payment methods</h3>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                  Add a credit card to make payments easier and faster
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {creditCards.map((card) => (
                  <WalletCreditCardItem
                    key={card.id}
                    card={card}
                    onSetDefault={handleSetDefault}
                    onDelete={handleDeleteCard}
                    isLoading={isSubmitting}
                  />
                ))}
              </div>
            )}
            
            {showAddForm && (
              <div className="border-t border-gray-200 pt-6">
                <CreditCardForm 
                  onSubmit={handleAddCard}
                  isLoading={isSubmitting}
                />
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}