
"use client";

import { cn } from '@/lib/utils';
import { Car, User, Users, Star } from 'lucide-react';
import Image from 'next/image';

export const rideOptionsData = [
    {
        name: 'Standard',
        description: 'Affordable, everyday rides',
        basePrice: 15.86,
        icon: Car,
        capacity: 1,
        image: 'https://picsum.photos/300/200'
    },
    {
        name: 'Comfort',
        description: 'Newer cars with extra legroom',
        basePrice: 22.50,
        icon: Users,
        capacity: 2,
        image: 'https://picsum.photos/300/200'
    },
    {
        name: 'Priority',
        description: 'Faster pickups and drop-offs',
        basePrice: 28.10,
        icon: Star,
        capacity: 1,
        image: 'https://picsum.photos/300/200'
    },
];

type RideOptionsProps = {
    selectedRide: string;
    onSelectRide: (rideName: string) => void;
    serviceType: 'dropoff' | 'roundtrip' | 'oneway';
};

const RideOptions = ({ selectedRide, onSelectRide, serviceType }: RideOptionsProps) => {
    
    const calculatePrice = (basePrice: number) => {
        if (serviceType === 'roundtrip') {
            return basePrice * 2;
        }
        return basePrice;
    }

    return (
        <div className="space-y-3">
            {rideOptionsData.map((ride) => (
                <button
                    key={ride.name}
                    onClick={() => onSelectRide(ride.name)}
                    className={cn(
                        "w-full p-4 rounded-lg border-2 transition-all flex items-center gap-4 text-left",
                        selectedRide === ride.name
                            ? "border-primary bg-primary/10"
                            : "border-transparent bg-muted hover:bg-muted/80"
                    )}
                >
                    <div className="relative w-24 h-16 rounded-md overflow-hidden flex-shrink-0">
                         <Image src={ride.image} alt={ride.name} data-ai-hint="car side" fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                           <h3 className="font-bold text-lg">{ride.name}</h3>
                           <div className="flex items-center">
                             <User className="w-4 h-4" />
                             <span>{ride.capacity}</span>
                           </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{ride.description}</p>
                         <p className="font-semibold text-lg mt-1">${calculatePrice(ride.basePrice).toFixed(2)}</p>
                    </div>
                </button>
            ))}
        </div>
    );
};

export default RideOptions;
