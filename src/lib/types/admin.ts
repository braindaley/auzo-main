export enum AdminRole {
  SUPPORT = 'support',
  ADVANCED_OPS = 'advanced_ops'
}

export interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: AdminRole;
  createdAt: Date;
}

export interface CustomerDetail {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  status: 'active' | 'disabled';
  createdAt: Date;
  orders: {
    id: string;
    orderNumber: string;
    date: Date;
    service: string;
    vehicle: string;
    cost: number;
    status: string;
  }[];
  vehicles: {
    id: string;
    year: string;
    make: string;
    model: string;
    color: string;
  }[];
  paymentMethods: {
    id: string;
    last4: string;
    brand: string;
    isDefault: boolean;
  }[];
}

export interface DriverDetail {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  status: 'active' | 'disabled' | 'pending';
  rating: number;
  totalTrips: number;
  totalEarnings: number;
  createdAt: Date;
  trips: DriverTrip[];
  payouts: DriverPayout[];
}

export interface DriverTrip {
  id: string;
  date: Date;
  pickup: string;
  dropoff: string;
  customer: string;
  earnings: number;
  rating?: number;
  status: string;
}

export interface DriverPayout {
  id: string;
  date: Date;
  amount: number;
  method: string;
  status: 'completed' | 'pending' | 'failed';
  transactionId?: string;
}

export interface DriverApplication {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;

  // Application data
  zipCode: string;
  referralCode?: string;
  age: string;
  licenseNumber: string;
  licenseState: string;
  ssnLast4: string;
  cardLast4: string;

  // Background check
  backgroundCheck?: {
    status: 'pending' | 'pass' | 'fail';
    completedAt?: Date;
    details?: string;
  };

  // Decision
  reviewedBy?: string;
  reviewedAt?: Date;
  rejectionReason?: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  serviceType: string;
  location: string;
  discountAmount: number;
  discountType: 'fixed' | 'percentage';
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  imageUrl?: string;
  createdAt: Date;
}

export interface VirtualCard {
  id: string;
  cardNumber: string; // Full for admin, last 4 for display
  last4: string;
  cardholder: string;
  issuedTo: 'driver' | 'customer';
  issuedToId: string;
  issuedToName: string;
  spendingLimit: number;
  currentSpend: number;
  status: 'active' | 'suspended' | 'cancelled';
  createdAt: Date;
  transactions: CardTransaction[];
}

export interface CardTransaction {
  id: string;
  date: Date;
  merchant: string;
  amount: number;
  category: string;
  status: 'completed' | 'pending' | 'declined';
}