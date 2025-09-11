"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Plus, Star, MoreHorizontal, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { CreditCard as CreditCardType, CardBrand, CARD_BRAND_LABELS } from '@/lib/types/credit-card';
import { isCardExpired } from '@/lib/services/credit-card-service';

interface BookingCreditCardSelectorProps {
  cards: CreditCardType[];
  selectedCardId?: string;
  onCardSelect: (cardId: string) => void;
  onSetDefault: (cardId: string) => Promise<void>;
  onDelete: (cardId: string) => Promise<void>;
  isLoading?: boolean;
  required?: boolean;
}

export function BookingCreditCardSelector({
  cards,
  selectedCardId,
  onCardSelect,
  onSetDefault,
  onDelete,
  isLoading = false,
  required = false
}: BookingCreditCardSelectorProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleAddCard = () => {
    router.push('/wallet/add-card?returnTo=/confirm-booking');
  };

  const handleSetDefault = async (cardId: string) => {
    if (!cardId) return;
    
    setActionLoading(true);
    try {
      await onSetDefault(cardId);
    } catch (error) {
      console.error('Error setting default card:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!cardToDelete) return;
    
    setActionLoading(true);
    try {
      await onDelete(cardToDelete);
      setShowDeleteDialog(false);
      setCardToDelete(null);
    } catch (error) {
      console.error('Error deleting card:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const openDeleteDialog = (cardId: string) => {
    setCardToDelete(cardId);
    setShowDeleteDialog(true);
  };

  // If no cards exist, show add card button
  if (cards.length === 0) {
    return (
      <div 
        className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer"
        onClick={handleAddCard}
      >
        <div className="flex items-center justify-center space-x-2 text-gray-600">
          <Plus className="w-5 h-5" />
          <span className="text-base font-medium">Add Credit Card</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Credit Cards List */}
      {cards.map((card) => {
        const isExpired = isCardExpired(card.expiryMonth, card.expiryYear);
        const maskedNumber = `•••• ${card.cardNumber}`;
        const isSelected = card.id === selectedCardId;

        return (
          <div 
            key={card.id}
            className={`bg-white rounded-lg p-4 border-2 transition-all cursor-pointer ${
              isSelected 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => card.id && onCardSelect(card.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Radio button indicator */}
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-blue-500' : 'border-gray-400'
                }`}>
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  )}
                </div>
                
                {/* Card type indicator */}
                <div className="w-12 h-8 bg-gray-900 rounded-md flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {card.brand === CardBrand.VISA ? 'VISA' :
                     card.brand === CardBrand.MASTERCARD ? 'MC' :
                     card.brand === CardBrand.AMERICAN_EXPRESS ? 'AMEX' :
                     card.brand === CardBrand.DISCOVER ? 'DISC' :
                     'CARD'}
                  </span>
                </div>
                
                {/* Card details */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {card.nickname || CARD_BRAND_LABELS[card.brand]}
                    </span>
                    {card.isDefault && (
                      <div className="px-2 py-1 bg-gray-900 text-white text-xs rounded-full flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-current" />
                        <span>Default</span>
                      </div>
                    )}
                    {isExpired && (
                      <div className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        <span>Expired</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-sm font-mono text-gray-600">{maskedNumber}</span>
                    <span className="text-xs text-gray-500">
                      {String(card.expiryMonth).padStart(2, '0')}/{card.expiryYear}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    disabled={isLoading || actionLoading}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!card.isDefault && (
                    <>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          card.id && handleSetDefault(card.id);
                        }}
                        disabled={actionLoading}
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Set as Default
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      card.id && openDeleteDialog(card.id);
                    }}
                    className="text-red-600 focus:text-red-600"
                    disabled={actionLoading}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      })}

      {/* Add New Card Button */}
      <div 
        className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer"
        onClick={handleAddCard}
      >
        <div className="flex items-center justify-center space-x-2 text-gray-600">
          <Plus className="w-5 h-5" />
          <span className="text-base font-medium">Add New Card</span>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Credit Card</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this credit card? This action cannot be undone.
              {cards.find(c => c.id === cardToDelete)?.isDefault && (
                <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> This is your default payment method. If you delete it, 
                    another card will automatically be set as default (if available).
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={actionLoading}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {actionLoading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}