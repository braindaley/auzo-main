"use client";

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { vehicleStorage } from '@/lib/vehicle-storage';
import { Suspense } from 'react';

const ColorSelectionContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const year = searchParams.get('year');
    const make = searchParams.get('make');
    const model = searchParams.get('model');
    
    const popularColors = [
        { name: 'White', hex: '#FFFFFF', border: '#E5E5E5' },
        { name: 'Black', hex: '#000000', border: '#000000' },
        { name: 'Silver', hex: '#C0C0C0', border: '#A0A0A0' },
        { name: 'Gray', hex: '#808080', border: '#606060' },
        { name: 'Red', hex: '#DC2626', border: '#DC2626' },
        { name: 'Blue', hex: '#2563EB', border: '#2563EB' },
        { name: 'Green', hex: '#16A34A', border: '#16A34A' },
        { name: 'Yellow', hex: '#EAB308', border: '#EAB308' },
        { name: 'Orange', hex: '#EA580C', border: '#EA580C' },
        { name: 'Purple', hex: '#7C3AED', border: '#7C3AED' },
        { name: 'Brown', hex: '#A16207', border: '#A16207' },
        { name: 'Gold', hex: '#D97706', border: '#D97706' }
    ];

    const handleColorSelect = (color: string) => {
        if (year && make && model) {
            const newVehicle = vehicleStorage.saveVehicle({
                year,
                make,
                model,
                color
            });
            
            // Check if we came from select-vehicle page
            const returnTo = searchParams.get('returnTo');
            if (returnTo === '/select-vehicle') {
                // Store the newly created vehicle and go to confirm-booking
                sessionStorage.setItem('selectedVehicle', JSON.stringify(newVehicle));
                router.push('/confirm-booking');
            } else {
                // Normal flow - go back to garage
                router.push('/garage');
            }
        }
    };

    const handleBack = () => {
        const params = new URLSearchParams();
        if (year) params.append('year', year);
        if (make) params.append('make', make);
        const returnTo = searchParams.get('returnTo');
        if (returnTo) params.append('returnTo', returnTo);
        router.push(`/garage/add-vehicle/model?${params.toString()}`);
    };

    return (
        <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center mb-6">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleBack}
                        className="mr-3"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h1 className="text-2xl font-semibold">Select Color</h1>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {popularColors.map((color) => (
                        <Button
                            key={color.name}
                            variant="outline"
                            className="h-16 justify-start items-center gap-4 p-4"
                            onClick={() => handleColorSelect(color.name)}
                        >
                            <div 
                                className="w-8 h-8 rounded-full border-2"
                                style={{ 
                                    backgroundColor: color.hex,
                                    borderColor: color.border
                                }}
                            />
                            <span className="font-medium">{color.name}</span>
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ColorSelectionPage = () => {
    return (
        <Suspense fallback={<div className="flex-1 overflow-y-auto p-4"><div className="max-w-2xl mx-auto"><div className="text-center">Loading...</div></div></div>}>
            <ColorSelectionContent />
        </Suspense>
    );
};

export default ColorSelectionPage;