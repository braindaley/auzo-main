import { Vehicle } from '@/components/car-card';

export interface Transaction {
  id: string;
  orderNumber: string;
  timestamp: string;
  status: 'requested' | 'matched' | 'in_progress' | 'completed' | 'cancelled';
  
  // Booking details
  vehicle: Vehicle;
  destination: string;
  pickupTime: string;
  isScheduled: boolean;
  scheduledDate?: string;
  scheduledTime?: string;
  
  // Service details
  serviceType: 'delivery';
  cost: number;
  
  // Location details
  pickupLocation: string;
  
  // Driver details (filled when driver is assigned)
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  estimatedArrival?: string;
}

class TransactionStorage {
  private readonly STORAGE_KEY = 'auzo_transactions';

  private generateOrderNumber(): string {
    return `AZ-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
  }

  private generateTransactionId(): string {
    return `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }

  saveTransaction(bookingData: {
    vehicle: Vehicle;
    destination: string;
    pickupTime: string;
    isScheduled: boolean;
    scheduledDate?: string;
    scheduledTime?: string;
  }): Transaction {
    const transaction: Transaction = {
      id: this.generateTransactionId(),
      orderNumber: this.generateOrderNumber(),
      timestamp: new Date().toISOString(),
      status: 'requested',
      
      // Booking details
      vehicle: bookingData.vehicle,
      destination: bookingData.destination,
      pickupTime: bookingData.pickupTime,
      isScheduled: bookingData.isScheduled,
      scheduledDate: bookingData.scheduledDate,
      scheduledTime: bookingData.scheduledTime,
      
      // Service details
      serviceType: 'delivery',
      cost: 14.90,
      
      // Location details
      pickupLocation: 'Current location'
    };

    // Get existing transactions
    const existingTransactions = this.getTransactions();
    
    // Add new transaction
    const updatedTransactions = [transaction, ...existingTransactions];
    
    // Save to localStorage
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedTransactions));
    
    return transaction;
  }

  getTransactions(): Transaction[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error parsing transactions:', error);
      return [];
    }
  }

  getTransactionById(id: string): Transaction | null {
    const transactions = this.getTransactions();
    return transactions.find(t => t.id === id) || null;
  }

  updateTransactionStatus(id: string, status: Transaction['status'], updates?: Partial<Transaction>): void {
    const transactions = this.getTransactions();
    const transactionIndex = transactions.findIndex(t => t.id === id);
    
    if (transactionIndex === -1) return;
    
    transactions[transactionIndex] = {
      ...transactions[transactionIndex],
      status,
      ...updates
    };
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(transactions));
  }

  updateTransaction(id: string, updates: Partial<Transaction>): void {
    const transactions = this.getTransactions();
    const transactionIndex = transactions.findIndex(t => t.id === id);
    
    if (transactionIndex === -1) return;
    
    transactions[transactionIndex] = {
      ...transactions[transactionIndex],
      ...updates
    };
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(transactions));
  }

  getRecentTransactions(limit: number = 10): Transaction[] {
    return this.getTransactions().slice(0, limit);
  }

  clearTransactions(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export const transactionStorage = new TransactionStorage();