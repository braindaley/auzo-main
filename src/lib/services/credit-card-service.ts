import { where, orderBy } from 'firebase/firestore';
import { 
  createDocument, 
  getDocuments, 
  updateDocument, 
  deleteDocument,
  queryDocuments 
} from '../firestore-service';
import { CreditCard, CreditCardInput, CardBrand } from '../types/credit-card';

const COLLECTION_NAME = 'creditCards';

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
  const number = cardNumber.replace(/\s/g, '');
  
  // Basic length check
  if (number.length < 13 || number.length > 19) return false;
  
  // Luhn algorithm
  let sum = 0;
  let shouldDouble = false;
  
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i]);
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
}

export async function addCreditCard(userId: string, cardData: CreditCardInput): Promise<string> {
  // Skip validation for prototype - allow any card number
  const brand = detectCardBrand(cardData.cardNumber);
  const maskedNumber = cardData.cardNumber.slice(-4); // Store only last 4 digits

  // If this is set as default, unset all other defaults first
  if (cardData.isDefault) {
    await setAllCardsNonDefault(userId);
  }

  const creditCard: Omit<CreditCard, 'id'> = {
    userId,
    cardNumber: maskedNumber,
    cardholderName: cardData.cardholderName,
    expiryMonth: cardData.expiryMonth,
    expiryYear: cardData.expiryYear,
    brand,
    isDefault: cardData.isDefault || false,
    nickname: cardData.nickname || null,
    billingAddress: cardData.billingAddress,
    isActive: true
  };

  return await createDocument<Omit<CreditCard, 'id'>>(COLLECTION_NAME, creditCard);
}

export async function getUserCreditCards(userId: string): Promise<CreditCard[]> {
  console.log('getUserCreditCards called for userId:', userId);
  try {
    const result = await queryDocuments<CreditCard>(
      COLLECTION_NAME,
      'userId',
      '==',
      userId
    );
    console.log('queryDocuments result:', result);
    return result;
  } catch (error) {
    console.error('Error in getUserCreditCards:', error);
    console.error('Error details:', {
      code: (error as any)?.code,
      message: (error as any)?.message,
      details: error
    });
    
    // If it's a permission error, return empty array for now
    if ((error as any)?.code === 'permission-denied' || (error as any)?.code === 'unauthenticated') {
      console.warn('Permission denied - returning empty array. Check Firestore rules.');
      return [];
    }
    
    throw error;
  }
}

export async function getActiveCreditCards(userId: string): Promise<CreditCard[]> {
  console.log('getActiveCreditCards called for userId:', userId);
  try {
    const allCards = await getUserCreditCards(userId);
    console.log('All cards from getUserCreditCards:', allCards);
    const activeCards = allCards.filter(card => card.isActive);
    console.log('Active cards:', activeCards);
    return activeCards;
  } catch (error) {
    console.error('Error in getActiveCreditCards:', error);
    throw error;
  }
}

export async function getDefaultCreditCard(userId: string): Promise<CreditCard | null> {
  const cards = await queryDocuments<CreditCard>(
    COLLECTION_NAME,
    'userId',
    '==',
    userId
  );
  
  const defaultCard = cards.find(card => card.isDefault && card.isActive);
  return defaultCard || null;
}

export async function setDefaultCreditCard(userId: string, cardId: string): Promise<void> {
  // First, unset all defaults for this user
  await setAllCardsNonDefault(userId);
  
  // Then set the specified card as default
  await updateDocument(COLLECTION_NAME, cardId, { isDefault: true });
}

async function setAllCardsNonDefault(userId: string): Promise<void> {
  const userCards = await getUserCreditCards(userId);
  const updatePromises = userCards
    .filter(card => card.isDefault)
    .map(card => updateDocument(COLLECTION_NAME, card.id!, { isDefault: false }));
  
  await Promise.all(updatePromises);
}

export async function updateCreditCard(
  cardId: string, 
  updates: Partial<Omit<CreditCard, 'id' | 'userId' | 'cardNumber' | 'createdAt'>>
): Promise<void> {
  await updateDocument(COLLECTION_NAME, cardId, updates);
}

export async function deleteCreditCard(userId: string, cardId: string): Promise<void> {
  // Check if this was the default card
  const card = await queryDocuments<CreditCard>(
    COLLECTION_NAME,
    'userId',
    '==',
    userId
  );
  
  const cardToDelete = card.find(c => c.id === cardId);
  const wasDefault = cardToDelete?.isDefault;
  
  // Soft delete by marking as inactive
  await updateDocument(COLLECTION_NAME, cardId, { isActive: false });
  
  // If this was the default card, set another card as default
  if (wasDefault) {
    const remainingCards = await getActiveCreditCards(userId);
    if (remainingCards.length > 0) {
      await setDefaultCreditCard(userId, remainingCards[0].id!);
    }
  }
}

export async function hardDeleteCreditCard(cardId: string): Promise<void> {
  await deleteDocument(COLLECTION_NAME, cardId);
}

export function isCardExpired(expiryMonth: number, expiryYear: number): boolean {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11
  const currentYear = now.getFullYear();
  
  if (expiryYear < currentYear) return true;
  if (expiryYear === currentYear && expiryMonth < currentMonth) return true;
  
  return false;
}