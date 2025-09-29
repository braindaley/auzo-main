export interface Promotion {
  id: string;
  title: string;
  description: string;
  serviceType: string;
  serviceName: string;
  location: string;
  discountAmount: number;
  discountType: 'fixed' | 'percentage';
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  imageUrl?: string;
  terms?: string;
  createdAt: Date;
  updatedAt: Date;
}