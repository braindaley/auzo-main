"use client";

import { useState } from 'react';
import { MoreHorizontal, Trash2, Star, CreditCard } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';

import { CreditCard as CreditCardType, CardBrand, CARD_BRAND_LABELS } from '@/lib/types/credit-card';
import { maskCardNumber, isCardExpired } from '@/lib/services/credit-card-service';

interface CreditCardItemProps {
  card: CreditCardType;
  onSetDefault: (cardId: string) => Promise<void>;
  onDelete: (cardId: string) => Promise<void>;
  isLoading?: boolean;
}

function getCardBrandIcon(brand: CardBrand) {
  switch (brand) {
    case CardBrand.VISA:
      return '💳'; // Visa logo would be better
    case CardBrand.MASTERCARD:
      return '💳'; // Mastercard logo would be better
    case CardBrand.AMERICAN_EXPRESS:
      return '💳'; // Amex logo would be better
    case CardBrand.DISCOVER:
      return '💳'; // Discover logo would be better
    default:
      return '💳';
  }
}

function getCardBrandColor(brand: CardBrand): string {
  switch (brand) {
    case CardBrand.VISA:
      return 'from-blue-600 to-blue-700';
    case CardBrand.MASTERCARD:
      return 'from-red-600 to-red-700';
    case CardBrand.AMERICAN_EXPRESS:
      return 'from-green-600 to-green-700';
    case CardBrand.DISCOVER:
      return 'from-orange-600 to-orange-700';
    case CardBrand.DINERS_CLUB:
      return 'from-purple-600 to-purple-700';
    case CardBrand.JCB:
      return 'from-indigo-600 to-indigo-700';
    default:
      return 'from-gray-600 to-gray-700';
  }
}

export function CreditCardItem({ card, onSetDefault, onDelete, isLoading = false }: CreditCardItemProps) {
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
  const maskedNumber = maskCardNumber(`************${card.cardNumber}`);

  return (
    <>
      <div className={`bg-gradient-to-r ${getCardBrandColor(card.brand)} rounded-xl p-6 text-white relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}>
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <div className="absolute top-4 right-4 opacity-20">
          <CreditCard className="h-16 w-16" />
        </div>
        
        {/* Card header */}
        <div className="relative flex justify-between items-start mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold">{CARD_BRAND_LABELS[card.brand]}</h3>
                {card.isDefault && (
                  <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="text-xs font-medium">Default</span>
                    </div>
                  </div>
                )}
                {isExpired && (
                  <div className="bg-red-500/30 backdrop-blur-sm px-2 py-1 rounded-full">
                    <span className="text-xs font-medium">Expired</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-white/80">
                {card.nickname || 'Credit Card'}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-white hover:bg-white/20 border-0"
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
                className="text-destructive focus:text-destructive"
                disabled={actionLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Card number */}
        <div className="mb-6">
          <div className="text-xl font-mono tracking-wider mb-2">
            {maskedNumber}
          </div>
        </div>

        {/* Card details */}
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs text-white/60 uppercase tracking-wide mb-1">Cardholder</p>
            <p className="text-sm font-medium uppercase">{card.cardholderName}</p>
          </div>
          <div>
            <p className="text-xs text-white/60 uppercase tracking-wide mb-1">Expires</p>
            <p className={`text-sm font-medium ${isExpired ? 'text-red-200' : ''}`}>
              {String(card.expiryMonth).padStart(2, '0')}/{card.expiryYear}
            </p>
          </div>
        </div>

        {card.billingAddress && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-xs text-white/60 uppercase tracking-wide mb-1">Billing Address</p>
            <div className="text-sm text-white/90">
              <div>{card.billingAddress.city}, {card.billingAddress.state} {card.billingAddress.zipCode}</div>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Credit Card</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this credit card? This action cannot be undone.
              {card.isDefault && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
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
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {actionLoading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}