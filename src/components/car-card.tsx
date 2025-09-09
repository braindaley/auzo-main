"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Car } from 'lucide-react';

interface Vehicle {
  id: string;
  year: string;
  make: string;
  model: string;
  color: string;
  vin?: string;
  licensePlate?: string;
  purchaseDate?: string;
  photos?: string[];
}

interface CarCardProps {
  vehicle: Vehicle;
  onClick: (vehicle: Vehicle) => void;
}

export const CarCard = ({ vehicle, onClick }: CarCardProps) => {
  return (
    <Card 
      className="bg-card hover:bg-muted/80 transition-colors cursor-pointer"
      onClick={() => onClick(vehicle)}
    >
      <CardContent className="p-4 flex items-center gap-4">
        <div className="flex-shrink-0">
          <Car className="w-8 h-8 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">
            {vehicle.year} {vehicle.make} {vehicle.model} ({vehicle.color})
          </h3>
          <p className="text-sm text-muted-foreground">
            Last serviced: 15/03/2024
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export type { Vehicle };