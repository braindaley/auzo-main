import { CustomerDetail, DriverDetail, DriverApplication, Promotion, VirtualCard, AdminRole } from './types/admin';

const ADMIN_ROLE_KEY = 'auzo_admin_role';
const CUSTOMERS_KEY = 'auzo_admin_customers';
const DRIVERS_KEY = 'auzo_admin_drivers';
const APPLICATIONS_KEY = 'auzo_admin_applications';
const PROMOTIONS_KEY = 'auzo_admin_promotions';
const VIRTUAL_CARDS_KEY = 'auzo_admin_virtual_cards';
const IMPERSONATE_KEY = 'auzo_impersonate';

export const adminStorage = {
  // Admin Role Management
  getAdminRole(): AdminRole {
    if (typeof window === 'undefined') return AdminRole.SUPPORT;
    const role = localStorage.getItem(ADMIN_ROLE_KEY);
    return (role as AdminRole) || AdminRole.SUPPORT;
  },

  setAdminRole(role: AdminRole): void {
    localStorage.setItem(ADMIN_ROLE_KEY, role);
  },

  // Impersonation
  getImpersonation(): { type: 'customer' | 'driver', id: string, name: string } | null {
    if (typeof window === 'undefined') return null;
    const data = sessionStorage.getItem(IMPERSONATE_KEY);
    return data ? JSON.parse(data) : null;
  },

  setImpersonation(type: 'customer' | 'driver', id: string, name: string): void {
    sessionStorage.setItem(IMPERSONATE_KEY, JSON.stringify({ type, id, name }));
  },

  clearImpersonation(): void {
    sessionStorage.removeItem(IMPERSONATE_KEY);
  },

  // Customers
  getCustomers(): CustomerDetail[] {
    if (typeof window === 'undefined') return mockCustomers;
    const stored = localStorage.getItem(CUSTOMERS_KEY);
    return stored ? JSON.parse(stored) : mockCustomers;
  },

  getCustomer(id: string): CustomerDetail | undefined {
    return this.getCustomers().find(c => c.id === id);
  },

  updateCustomer(id: string, updates: Partial<CustomerDetail>): void {
    const customers = this.getCustomers();
    const index = customers.findIndex(c => c.id === id);
    if (index !== -1) {
      customers[index] = { ...customers[index], ...updates };
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
    }
  },

  // Drivers
  getDrivers(): DriverDetail[] {
    if (typeof window === 'undefined') return mockDrivers;
    const stored = localStorage.getItem(DRIVERS_KEY);
    return stored ? JSON.parse(stored) : mockDrivers;
  },

  getDriver(id: string): DriverDetail | undefined {
    return this.getDrivers().find(d => d.id === id);
  },

  updateDriver(id: string, updates: Partial<DriverDetail>): void {
    const drivers = this.getDrivers();
    const index = drivers.findIndex(d => d.id === id);
    if (index !== -1) {
      drivers[index] = { ...drivers[index], ...updates };
      localStorage.setItem(DRIVERS_KEY, JSON.stringify(drivers));
    }
  },

  // Applications
  getApplications(): DriverApplication[] {
    if (typeof window === 'undefined') return mockApplications;
    const stored = localStorage.getItem(APPLICATIONS_KEY);
    return stored ? JSON.parse(stored) : mockApplications;
  },

  getApplication(id: string): DriverApplication | undefined {
    return this.getApplications().find(a => a.id === id);
  },

  updateApplication(id: string, updates: Partial<DriverApplication>): void {
    const applications = this.getApplications();
    const index = applications.findIndex(a => a.id === id);
    if (index !== -1) {
      applications[index] = { ...applications[index], ...updates };
      localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
    }
  },

  approveApplication(id: string, reviewedBy: string): void {
    this.updateApplication(id, {
      status: 'approved',
      reviewedBy,
      reviewedAt: new Date()
    });
  },

  rejectApplication(id: string, reviewedBy: string, reason: string): void {
    this.updateApplication(id, {
      status: 'rejected',
      reviewedBy,
      reviewedAt: new Date(),
      rejectionReason: reason
    });
  },

  // Promotions
  getPromotions(): Promotion[] {
    if (typeof window === 'undefined') return mockPromotions;
    const stored = localStorage.getItem(PROMOTIONS_KEY);
    return stored ? JSON.parse(stored) : mockPromotions;
  },

  getPromotion(id: string): Promotion | undefined {
    return this.getPromotions().find(p => p.id === id);
  },

  createPromotion(promotion: Omit<Promotion, 'id' | 'createdAt'>): Promotion {
    const promotions = this.getPromotions();
    const newPromotion: Promotion = {
      ...promotion,
      id: `promo-${Date.now()}`,
      createdAt: new Date()
    };
    promotions.push(newPromotion);
    localStorage.setItem(PROMOTIONS_KEY, JSON.stringify(promotions));
    return newPromotion;
  },

  updatePromotion(id: string, updates: Partial<Promotion>): void {
    const promotions = this.getPromotions();
    const index = promotions.findIndex(p => p.id === id);
    if (index !== -1) {
      promotions[index] = { ...promotions[index], ...updates };
      localStorage.setItem(PROMOTIONS_KEY, JSON.stringify(promotions));
    }
  },

  // Virtual Cards
  getVirtualCards(): VirtualCard[] {
    if (typeof window === 'undefined') return mockVirtualCards;
    const stored = localStorage.getItem(VIRTUAL_CARDS_KEY);
    return stored ? JSON.parse(stored) : mockVirtualCards;
  },

  getVirtualCard(id: string): VirtualCard | undefined {
    return this.getVirtualCards().find(c => c.id === id);
  },

  updateVirtualCard(id: string, updates: Partial<VirtualCard>): void {
    const cards = this.getVirtualCards();
    const index = cards.findIndex(c => c.id === id);
    if (index !== -1) {
      cards[index] = { ...cards[index], ...updates };
      localStorage.setItem(VIRTUAL_CARDS_KEY, JSON.stringify(cards));
    }
  }
};

// Mock Data
const mockCustomers: CustomerDetail[] = [
  {
    id: 'cust-1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    phone: '4155551234',
    email: 'sarah.j@email.com',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    orders: [
      {
        id: 'order-1',
        orderNumber: 'AZ-12345',
        date: new Date('2024-03-10'),
        service: 'Quick Lube',
        vehicle: '2022 Tesla Model 3',
        cost: 85.00,
        status: 'completed'
      },
      {
        id: 'order-2',
        orderNumber: 'AZ-12389',
        date: new Date('2024-03-25'),
        service: 'Car Wash',
        vehicle: '2022 Tesla Model 3',
        cost: 45.00,
        status: 'completed'
      }
    ],
    vehicles: [
      { id: 'veh-1', year: '2022', make: 'Tesla', model: 'Model 3', color: 'White' }
    ],
    paymentMethods: [
      { id: 'pm-1', last4: '4242', brand: 'Visa', isDefault: true }
    ]
  },
  {
    id: 'cust-2',
    firstName: 'Michael',
    lastName: 'Chen',
    phone: '4155555678',
    email: 'mchen@email.com',
    status: 'active',
    createdAt: new Date('2024-02-20'),
    orders: [
      {
        id: 'order-3',
        orderNumber: 'AZ-12401',
        date: new Date('2024-03-28'),
        service: 'Dealer Service',
        vehicle: '2021 BMW X5',
        cost: 320.00,
        status: 'completed'
      }
    ],
    vehicles: [
      { id: 'veh-2', year: '2021', make: 'BMW', model: 'X5', color: 'Black' }
    ],
    paymentMethods: [
      { id: 'pm-2', last4: '8888', brand: 'Mastercard', isDefault: true }
    ]
  }
];

const mockDrivers: DriverDetail[] = [
  {
    id: 'driver-1',
    firstName: 'James',
    lastName: 'Martinez',
    phone: '4155559999',
    email: 'james.m@email.com',
    status: 'active',
    rating: 4.8,
    totalTrips: 247,
    totalEarnings: 3845.50,
    createdAt: new Date('2024-01-10'),
    trips: [
      {
        id: 'trip-1',
        date: new Date('2024-03-28'),
        pickup: '123 Main St',
        dropoff: 'Jiffy Lube - Downtown',
        customer: 'Sarah Johnson',
        earnings: 15.50,
        rating: 5,
        status: 'completed'
      },
      {
        id: 'trip-2',
        date: new Date('2024-03-27'),
        pickup: '456 Oak Ave',
        dropoff: 'BMW Service Center',
        customer: 'Michael Chen',
        earnings: 28.00,
        rating: 5,
        status: 'completed'
      }
    ],
    payouts: [
      {
        id: 'payout-1',
        date: new Date('2024-03-25'),
        amount: 450.00,
        method: 'Bank Transfer',
        status: 'completed',
        transactionId: 'TXN-98765'
      },
      {
        id: 'payout-2',
        date: new Date('2024-03-18'),
        amount: 380.50,
        method: 'Bank Transfer',
        status: 'completed',
        transactionId: 'TXN-98723'
      }
    ]
  },
  {
    id: 'driver-2',
    firstName: 'Lisa',
    lastName: 'Anderson',
    phone: '4155557777',
    email: 'lisa.a@email.com',
    status: 'active',
    rating: 4.9,
    totalTrips: 189,
    totalEarnings: 2956.00,
    createdAt: new Date('2024-02-05'),
    trips: [
      {
        id: 'trip-3',
        date: new Date('2024-03-28'),
        pickup: '789 Elm St',
        dropoff: 'Quick Lube Express',
        customer: 'David Park',
        earnings: 18.00,
        rating: 5,
        status: 'completed'
      }
    ],
    payouts: [
      {
        id: 'payout-3',
        date: new Date('2024-03-25'),
        amount: 520.00,
        method: 'Bank Transfer',
        status: 'completed',
        transactionId: 'TXN-98789'
      }
    ]
  }
];

const mockApplications: DriverApplication[] = [
  {
    id: 'app-1',
    firstName: 'Robert',
    lastName: 'Williams',
    phone: '4155554444',
    status: 'pending',
    submittedAt: new Date('2024-03-26'),
    zipCode: '94102',
    referralCode: 'REF123',
    age: '25+',
    licenseNumber: 'D1234567',
    licenseState: 'CA',
    ssnLast4: '5678',
    cardLast4: '9999',
    backgroundCheck: {
      status: 'pass',
      completedAt: new Date('2024-03-27'),
      details: 'No criminal record. Clean driving history.'
    }
  },
  {
    id: 'app-2',
    firstName: 'Emily',
    lastName: 'Davis',
    phone: '4155553333',
    status: 'pending',
    submittedAt: new Date('2024-03-27'),
    zipCode: '94103',
    age: '25+',
    licenseNumber: 'D9876543',
    licenseState: 'CA',
    ssnLast4: '1234',
    cardLast4: '7777',
    backgroundCheck: {
      status: 'pending',
      details: 'Background check in progress...'
    }
  }
];

const mockPromotions: Promotion[] = [
  {
    id: 'promo-1',
    title: '$10 off Oil Change',
    description: '33-Point Service Inspection Included',
    serviceType: 'quick%20lube',
    serviceName: 'Quick Lube',
    location: 'Oilstop',
    discountAmount: 10,
    discountType: 'fixed',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-04-30'),
    isActive: true,
    terms: 'Valid for first-time customers only',
    createdAt: new Date('2024-02-28'),
    updatedAt: new Date('2024-02-28')
  }
];

const mockVirtualCards: VirtualCard[] = [
  {
    id: 'card-1',
    cardNumber: '4532123456781234',
    last4: '1234',
    cardholder: 'James Martinez',
    issuedTo: 'driver',
    issuedToId: 'driver-1',
    issuedToName: 'James Martinez',
    spendingLimit: 500.00,
    currentSpend: 145.50,
    status: 'active',
    createdAt: new Date('2024-01-15'),
    transactions: [
      {
        id: 'txn-1',
        date: new Date('2024-03-28'),
        merchant: 'Shell Gas Station',
        amount: 45.50,
        category: 'Fuel',
        status: 'completed'
      },
      {
        id: 'txn-2',
        date: new Date('2024-03-27'),
        merchant: 'AutoZone',
        amount: 100.00,
        category: 'Parts',
        status: 'completed'
      }
    ]
  }
];