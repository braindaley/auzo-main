import { Timestamp } from 'firebase/firestore';

export enum OrderStatus {
  SCHEDULED = 0,
  FINDING_DRIVER = 1,
  DRIVER_ON_WAY = 2,
  DRIVER_ARRIVED = 3,
  CAR_IN_TRANSIT = 4,
  CAR_AT_SERVICE = 5,
  DRIVER_RETURNING = 6,
  CAR_DELIVERED = 7,
  CANCELLED = 8,
}

export const OrderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.SCHEDULED]: 'Scheduled',
  [OrderStatus.FINDING_DRIVER]: 'Finding driver',
  [OrderStatus.DRIVER_ON_WAY]: 'Driver on way',
  [OrderStatus.DRIVER_ARRIVED]: 'Driver arrived',
  [OrderStatus.CAR_IN_TRANSIT]: 'Car in transit',
  [OrderStatus.CAR_AT_SERVICE]: 'Car at service',
  [OrderStatus.DRIVER_RETURNING]: 'Driver returning',
  [OrderStatus.CAR_DELIVERED]: 'Car delivered',
  [OrderStatus.CANCELLED]: 'Cancelled',
};

export interface Order {
  id?: string;
  status: OrderStatus;
  pickupLocation?: string;
  dropoffLocation?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  isRoundTrip?: boolean;
  vehicleInfo?: {
    make?: string;
    model?: string;
    year?: string;
    licensePlate?: string;
  };
  customerInfo?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  driverInfo?: {
    name?: string;
    phone?: string;
    id?: string;
    rating?: number;
    tip?: number;
    ratedAt?: Date | Timestamp;
  };
  billingInfo?: {
    userId: string; // ID of user who placed the order
    billedToUserId: string; // ID of user who will be billed (owner or self)
    paymentMethod: 'credit_card' | 'bill_to_owner';
    ownerName?: string; // Name of owner for display purposes
  };
  notes?: string;
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
  statusHistory?: Array<{
    status: OrderStatus;
    timestamp: Timestamp | Date;
  }>;
}