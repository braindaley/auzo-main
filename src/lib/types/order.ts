import { Timestamp } from 'firebase/firestore';

export enum OrderStatus {
  SCHEDULED = 0,
  FINDING_DRIVER = 1,
  DRIVER_ON_WAY = 2,
  CAR_IN_TRANSIT = 3,
  CAR_DELIVERED = 4,
  CANCELLED = 5,
}

export const OrderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.SCHEDULED]: 'Scheduled',
  [OrderStatus.FINDING_DRIVER]: 'Finding driver',
  [OrderStatus.DRIVER_ON_WAY]: 'Driver on way',
  [OrderStatus.CAR_IN_TRANSIT]: 'Car in transit',
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
  };
  notes?: string;
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
  statusHistory?: Array<{
    status: OrderStatus;
    timestamp: Timestamp | Date;
  }>;
}