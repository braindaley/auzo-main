"use client";

import { useState } from 'react';
import { MoreHorizontal, Trash2, Star } from 'lucide-react';

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
import { maskCardNumber, isCardExpired } from '@/lib/services/credit-card-service';

interface WalletCreditCardItemProps {
  card: CreditCardType;
  onSetDefault: (cardId: string) => Promise<void>;
  onDelete: (cardId: string) => Promise<void>;
  isLoading?: boolean;
}

export function WalletCreditCardItem({ card, onSetDefault, onDelete, isLoading = false }: WalletCreditCardItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleSetDefault = async () => {
    if (!card.id || card.isDefault) return;
    
    setActionLoading(true);
    try {
      await onSetDefault(card.id);
    } catch (error) {
      console.error('Error setting default card:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!card.id) return;
    
    setActionLoading(true);
    try {
      await onDelete(card.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting card:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const isExpired = isCardExpired(card.expiryMonth, card.expiryYear);
  const maskedNumber = `•••• ${card.cardNumber}`;

  return (
    <>
      <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
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
            <DropdownMenuTrigger asChild>
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
                    onClick={handleSetDefault}
                    disabled={actionLoading}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Set as Default
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem 
                onClick={() => setShowDeleteDialog(true)}
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Credit Card</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this credit card? This action cannot be undone.
              {card.isDefault && (
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
    </>
  );
}