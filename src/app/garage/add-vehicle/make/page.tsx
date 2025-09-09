"use client";

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const MakeSelectionContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const year = searchParams.get('year');
    const returnTo = searchParams.get('returnTo');
    
    const popularMakes = [
        'Toyota', 'Ford', 'Chevrolet', 'Honda', 'Nissan',
        'Hyundai', 'Kia', 'Volkswagen', 'BMW', 'Mercedes-Benz',
        'Audi', 'Subaru', 'Mazda', 'Jeep', 'Ram',
        'GMC', 'Cadillac', 'Lexus', 'Acura', 'Infiniti',
        'Volvo', 'Buick', 'Lincoln', 'Genesis', 'Tesla'
    ];

    const handleMakeSelect = (make: string) => {
        const params = new URLSearchParams({ 
            year: year || '', 
            make: make 
        });
        if (returnTo) params.append('returnTo', returnTo);
        router.push(`/garage/add-vehicle/model?${params.toString()}`);
    };

    const handleBack = () => {
        const params = new URLSearchParams();
        if (year) params.append('year', year);
        if (returnTo) params.append('returnTo', returnTo);
        router.push(`/garage/add-vehicle/year?${params.toString()}`);
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
                    <h1 className="text-2xl font-semibold">Select Make</h1>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {popularMakes.map((make) => (
                        <Button
                            key={make}
                            variant="outline"
                            className="h-12 justify-center text-center"
                            onClick={() => handleMakeSelect(make)}
                        >
                            {make}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const MakeSelectionPage = () => {
    return (
        <Suspense fallback={<div className="flex-1 overflow-y-auto p-4"><div className="max-w-2xl mx-auto"><div className="text-center">Loading...</div></div></div>}>
            <MakeSelectionContent />
        </Suspense>
    );
};

export default MakeSelectionPage;