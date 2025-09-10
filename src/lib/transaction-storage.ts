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
  serviceType: string;
  specificServiceType?: string; // e.g., "dealer service center", "tire & wheel service", "quick lube"
  isRoundTrip?: boolean;
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

  private determineServiceType(): string {
    if (typeof window === 'undefined') return 'delivery';
    
    const isOneWayService = sessionStorage.getItem('isOneWayService');
    const isRoundTrip = sessionStorage.getItem('isRoundTrip');
    
    if (isOneWayService === 'true') {
      return 'one-way service';
    } else if (isRoundTrip === 'true') {
      return 'full service';
    } else {
      return 'delivery';
    }
  }

  private getSpecificServiceType(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    
    const selectedServiceType = sessionStorage.getItem('selectedServiceType');
    if (selectedServiceType) {
      // Format the service type for display
      return selectedServiceType.replace(/%20/g, ' ');
    }
    return undefined;
  }

  saveTransaction(bookingData: {
    vehicle: Vehicle;
    destination: string;
    pickupTime: string;
    isScheduled: boolean;
    scheduledDate?: string;
    scheduledTime?: string;
    isRoundTrip?: boolean;
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
      serviceType: this.determineServiceType(),
      specificServiceType: this.getSpecificServiceType(),
      isRoundTrip: bookingData.isRoundTrip,
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

  // Cleanup method to remove duplicate transactions
  removeDuplicateTransactions(): void {
    if (typeof window === 'undefined') return;
    
    const transactions = this.getTransactions();
    const uniqueTransactions: Transaction[] = [];
    const seenKeys = new Set<string>();
    
    for (const transaction of transactions) {
      // Create a unique key based on vehicle, destination, and timestamp (within 10 seconds)
      const timestampKey = Math.floor(new Date(transaction.timestamp).getTime() / 10000) * 10000;
      const uniqueKey = `${transaction.vehicle.id}-${transaction.destination}-${timestampKey}`;
      
      if (!seenKeys.has(uniqueKey)) {
        seenKeys.add(uniqueKey);
        uniqueTransactions.push(transaction);
      }
    }
    
    if (uniqueTransactions.length !== transactions.length) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(uniqueTransactions));
      console.log(`Removed ${transactions.length - uniqueTransactions.length} duplicate transactions`);
    }
  }

  getRecentTransactions(limit: number = 10): Transaction[] {
    return this.getTransactions().slice(0, limit);
  }

  cancelTransaction(id: string): void {
    this.updateTransactionStatus(id, 'cancelled');
  }

  clearTransactions(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export const transactionStorage = new TransactionStorage();