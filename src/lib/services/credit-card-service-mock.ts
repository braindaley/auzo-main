// Mock credit card service for prototype/development
import { CreditCard, CreditCardInput, CardBrand } from '../types/credit-card';

const STORAGE_KEY = 'auzo-mock-credit-cards';
const ID_KEY = 'auzo-mock-card-next-id';

// Get cards from localStorage
function getStoredCards(): CreditCard[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading stored cards:', error);
    return [];
  }
}

// Save cards to localStorage
function saveCards(cards: CreditCard[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch (error) {
    console.error('Error saving cards:', error);
  }
}

// Get next ID
function getNextId(): number {
  if (typeof window === 'undefined') return 1;
  
  try {
    const stored = localStorage.getItem(ID_KEY);
    return stored ? parseInt(stored) : 1;
  } catch (error) {
    return 1;
  }
}

// Save next ID
function saveNextId(id: number): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(ID_KEY, id.toString());
  } catch (error) {
    console.error('Error saving next ID:', error);
  }
}

// Initialize cards from storage
let mockCards: CreditCard[] = [];
let nextId = 1;

export function detectCardBrand(cardNumber: string): CardBrand {
  const number = cardNumber.replace(/\s/g, '');
  
  if (/^4/.test(number)) return CardBrand.VISA;
  if (/^5[1-5]/.test(number)) return CardBrand.MASTERCARD;
  if (/^3[47]/.test(number)) return CardBrand.AMERICAN_EXPRESS;
  if (/^6(?:011|5)/.test(number)) return CardBrand.DISCOVER;
  if (/^3[0689]/.test(number)) return CardBrand.DINERS_CLUB;
  if (/^35/.test(number)) return CardBrand.JCB;
  
  return CardBrand.UNKNOWN;
}

export function maskCardNumber(cardNumber: string): string {
  const lastFour = cardNumber.slice(-4);
  return `**** **** **** ${lastFour}`;
}

export function formatCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  const match = cleaned.match(/.{1,4}/g);
  return match ? match.join(' ') : cleaned;
}

export function validateCardNumber(cardNumber: string): boolean {
  // Skip validation for prototype
  return true;
}

export async function addCreditCard(userId: string, cardData: CreditCardInput): Promise<string> {
  console.log('Mock: Adding credit card for user:', userId, cardData);
  
  const brand = detectCardBrand(cardData.cardNumber);
  const maskedNumber = cardData.cardNumber.slice(-4);

  // If this is set as default, unset all other defaults first
  if (cardData.isDefault) {
    mockCards = mockCards.map(card => 
      card.userId === userId ? { ...card, isDefault: false } : card
    );
  }

  const creditCard: CreditCard = {
    id: `mock-card-${nextId++}`,
    userId,
    cardNumber: maskedNumber,
    cardholderName: cardData.cardholderName,
    expiryMonth: cardData.expiryMonth,
    expiryYear: cardData.expiryYear,
    brand,
    isDefault: cardData.isDefault || false,
    nickname: cardData.nickname,
    billingAddress: cardData.billingAddress,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  mockCards.push(creditCard);
  console.log('Mock: Card added, total cards:', mockCards.length);
  
  return creditCard.id!;
}

export async function getUserCreditCards(userId: string): Promise<CreditCard[]> {
  console.log('Mock: Getting cards for user:', userId);
  const userCards = mockCards.filter(card => card.userId === userId);
  console.log('Mock: Found cards:', userCards);
  return userCards;
}

export async function getActiveCreditCards(userId: string): Promise<CreditCard[]> {
  console.log('Mock: Getting active cards for user:', userId);
  const userCards = await getUserCreditCards(userId);
  const activeCards = userCards.filter(card => card.isActive);
  console.log('Mock: Active cards:', activeCards);
  return activeCards;
}

export async function getDefaultCreditCard(userId: string): Promise<CreditCard | null> {
  const cards = await getUserCreditCards(userId);
  const defaultCard = cards.find(card => card.isDefault && card.isActive);
  return defaultCard || null;
}

export async function setDefaultCreditCard(userId: string, cardId: string): Promise<void> {
  console.log('Mock: Setting default card:', cardId, 'for user:', userId);
  
  // Unset all defaults for this user
  mockCards = mockCards.map(card => 
    card.userId === userId ? { ...card, isDefault: false } : card
  );
  
  // Set the specified card as default
  mockCards = mockCards.map(card => 
    card.id === cardId ? { ...card, isDefault: true } : card
  );
}

export async function updateCreditCard(
  cardId: string, 
  updates: Partial<Omit<CreditCard, 'id' | 'userId' | 'cardNumber' | 'createdAt'>>
): Promise<void> {
  mockCards = mockCards.map(card => 
    card.id === cardId ? { ...card, ...updates, updatedAt: new Date() } : card
  );
}

export async function deleteCreditCard(userId: string, cardId: string): Promise<void> {
  console.log('Mock: Deleting card:', cardId, 'for user:', userId);
  
  // Find the card to check if it was default
  const cardToDelete = mockCards.find(c => c.id === cardId);
  const wasDefault = cardToDelete?.isDefault;
  
  // Soft delete by marking as inactive
  mockCards = mockCards.map(card => 
    card.id === cardId ? { ...card, isActive: false } : card
  );
  
  // If this was the default card, set another card as default
  if (wasDefault) {
    const remainingCards = await getActiveCreditCards(userId);
    if (remainingCards.length > 0) {
      await setDefaultCreditCard(userId, remainingCards[0].id!);
    }
  }
}

export async function hardDeleteCreditCard(cardId: string): Promise<void> {
  mockCards = mockCards.filter(card => card.id !== cardId);
}

export function isCardExpired(expiryMonth: number, expiryYear: number): boolean {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  
  if (expiryYear < currentYear) return true;
  if (expiryYear === currentYear && expiryMonth < currentMonth) return true;
  
  return false;
}

// Initialize with some sample data for prototype
export function initializeMockData() {
  if (mockCards.length === 0) {
    console.log('Mock: Initializing sample data');
    mockCards = [
      {
        id: 'sample-1',
        userId: 'demo-user-123',
        cardNumber: '1234',
        cardholderName: 'John Doe',
        expiryMonth: 12,
        expiryYear: 2025,
        brand: CardBrand.VISA,
        isDefault: true,
        nickname: 'Personal Card',
        billingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'US'
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'sample-2',
        userId: 'demo-user-123',
        cardNumber: '5678',
        cardholderName: 'John Doe',
        expiryMonth: 8,
        expiryYear: 2026,
        brand: CardBrand.MASTERCARD,
        isDefault: false,
        nickname: 'Work Card',
        billingAddress: {
          street: '456 Oak Ave',
          city: 'New York',
          state: 'NY',
          zipCode: '10002',
          country: 'US'
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
}