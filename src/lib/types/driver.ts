export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  status: 'active' | 'disabled' | 'pending';
  rating: number;
  totalTrips: number;
  vehicleInfo?: {
    year: string;
    make: string;
    model: string;
    licensePlate: string;
  };
  createdAt: Date;
}