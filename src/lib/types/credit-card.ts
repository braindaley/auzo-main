import { Timestamp } from 'firebase/firestore';
import { BaseDocument } from '../firestore-service';

export interface CreditCard extends BaseDocument {
  id?: string;
  userId: string;
  cardNumber: string; // Last 4 digits only for display
  cardholderName: string;
  expiryMonth: number;
  expiryYear: number;
  brand: CardBrand;
  isDefault: boolean;
  nickname?: string | null;
  billingAddress?: BillingAddress;
  isActive: boolean;
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

export interface BillingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export enum CardBrand {
  VISA = 'visa',
  MASTERCARD = 'mastercard',
  AMERICAN_EXPRESS = 'amex',
  DISCOVER = 'discover',
  DINERS_CLUB = 'diners',
  JCB = 'jcb',
  UNKNOWN = 'unknown'
}

export interface CreditCardInput {
  cardNumber: string; // Full card number for processing
  cardholderName: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  nickname?: string | null;
  billingAddress: BillingAddress;
  isDefault?: boolean;
}

export interface CreditCardFormData {
  cardNumber: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  nickname?: string | null;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  isDefault: boolean;
}

export const CARD_BRAND_LABELS: Record<CardBrand, string> = {
  [CardBrand.VISA]: 'Visa',
  [CardBrand.MASTERCARD]: 'Mastercard',
  [CardBrand.AMERICAN_EXPRESS]: 'American Express',
  [CardBrand.DISCOVER]: 'Discover',
  [CardBrand.DINERS_CLUB]: 'Diners Club',
  [CardBrand.JCB]: 'JCB',
  [CardBrand.UNKNOWN]: 'Unknown'
};