"use client";

import { useState, useEffect } from 'react';
import { ChevronDown, CreditCard, Plus, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { CreditCard as CreditCardType, CardBrand, CARD_BRAND_LABELS } from '@/lib/types/credit-card';
import { CreditCardForm } from './credit-card-form';
import { maskCardNumber } from '@/lib/services/credit-card-service';

interface CreditCardSelectorProps {
  cards: CreditCardType[];
  selectedCardId?: string;
  onCardSelect: (cardId: string) => void;
  onAddCard: (cardData: any) => Promise<void>;
  isLoading?: boolean;
  required?: boolean;
}

function getCardBrandLogo(brand: CardBrand) {
  switch (brand) {
    case CardBrand.VISA:
      return (
        <div className="bg-gray-900 text-white px-2 py-1 rounded text-xs font-bold">
          VISA
        </div>
      );
    case CardBrand.MASTERCARD:
      return (
        <div className="bg-gray-900 text-white px-2 py-1 rounded text-xs font-bold">
          MC
        </div>
      );
    case CardBrand.AMERICAN_EXPRESS:
      return (
        <div className="bg-gray-900 text-white px-2 py-1 rounded text-xs font-bold">
          AMEX
        </div>
      );
    case CardBrand.DISCOVER:
      return (
        <div className="bg-gray-900 text-white px-2 py-1 rounded text-xs font-bold">
          DISC
        </div>
      );
    default:
      return (
        <div className="bg-gray-900 text-white px-2 py-1 rounded text-xs font-bold">
          CARD
        </div>
      );
  }
}

export function CreditCardSelector({
  cards,
  selectedCardId,
  onCardSelect,
  onAddCard,
  isLoading = false,
  required = false
}: CreditCardSelectorProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  const selectedCard = cards.find(card => card.id === selectedCardId);
  const defaultCard = cards.find(card => card.isDefault);
  
  // Auto-select default card if none selected
  useEffect(() => {
    if (!selectedCardId && defaultCard) {
      onCardSelect(defaultCard.id!);
    }
  }, [selectedCardId, defaultCard, onCardSelect]);

  const handleAddCard = async (cardData: any) => {
    await onAddCard(cardData);
    setShowAddDialog(false);
  };

  // If no cards exist and required, show add card button
  if (cards.length === 0) {
    return (
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogTrigger asChild>
          <Card className="p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors cursor-pointer">
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Plus className="w-5 h-5" />
              <span className="text-base font-medium">Add Credit Card</span>
            </div>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Add Credit Card
            </DialogTitle>
            <DialogDescription>
              Add a credit card to complete your booking.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <CreditCardForm 
              onSubmit={handleAddCard}
              isLoading={isLoading}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="space-y-3">
      {/* Selected Card Display */}
      {selectedCard && (
        <Card className="p-4 bg-white border border-gray-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getCardBrandLogo(selectedCard.brand)}
              <span className="text-gray-500 font-medium">•••• {selectedCard.cardNumber}</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-500 text-sm">
                {String(selectedCard.expiryMonth).padStart(2, '0')}/{selectedCard.expiryYear}
              </span>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-current">
                  <circle cx="12" cy="12" r="1" fill="currentColor"/>
                  <circle cx="12" cy="5" r="1" fill="currentColor"/>
                  <circle cx="12" cy="19" r="1" fill="currentColor"/>
                </svg>
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Card Selection and Add New */}
      <div className="flex gap-2">
        {cards.length > 1 && (
          <Select value={selectedCardId} onValueChange={onCardSelect}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Choose a different card" />
            </SelectTrigger>
            <SelectContent>
              {cards.map((card) => (
                <SelectItem key={card.id} value={card.id!}>
                  <div className="flex items-center space-x-2">
                    {getCardBrandLogo(card.brand)}
                    <span>
                      {CARD_BRAND_LABELS[card.brand]} ••••{card.cardNumber}
                      {card.isDefault && <span className="text-xs text-blue-600 ml-1">(Default)</span>}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Card className="p-3 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors cursor-pointer">
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Add Credit Card</span>
              </div>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Add Credit Card
              </DialogTitle>
              <DialogDescription>
                Add a new credit card to your account.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <CreditCardForm 
                onSubmit={handleAddCard}
                isLoading={isLoading}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}