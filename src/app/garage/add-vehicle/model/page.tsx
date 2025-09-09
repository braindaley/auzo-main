"use client";

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const ModelSelectionContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const year = searchParams.get('year');
    const make = searchParams.get('make');
    const returnTo = searchParams.get('returnTo');
    
    const modelsByMake: { [key: string]: string[] } = {
        'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Prius'],
        'Ford': ['F-150', 'Explorer', 'Escape', 'Mustang', 'Edge'],
        'Chevrolet': ['Silverado', 'Equinox', 'Malibu', 'Tahoe', 'Traverse'],
        'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'HR-V'],
        'Nissan': ['Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Murano'],
        'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Accent'],
        'Kia': ['Forte', 'Optima', 'Sorento', 'Sportage', 'Soul'],
        'Volkswagen': ['Jetta', 'Passat', 'Tiguan', 'Atlas', 'Golf'],
        'BMW': ['3 Series', '5 Series', 'X3', 'X5', 'X1'],
        'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE', 'A-Class'],
        'Audi': ['A4', 'A6', 'Q5', 'Q7', 'A3'],
        'Subaru': ['Outback', 'Forester', 'Impreza', 'Crosstrek', 'Legacy'],
        'Mazda': ['Mazda3', 'CX-5', 'Mazda6', 'CX-9', 'CX-3'],
        'Jeep': ['Grand Cherokee', 'Cherokee', 'Wrangler', 'Compass', 'Renegade'],
        'Ram': ['1500', '2500', '3500', 'ProMaster', 'ProMaster City'],
        'GMC': ['Sierra', 'Terrain', 'Acadia', 'Yukon', 'Canyon'],
        'Cadillac': ['Escalade', 'XT5', 'CTS', 'ATS', 'XT4'],
        'Lexus': ['RX', 'ES', 'NX', 'GX', 'IS'],
        'Acura': ['TLX', 'RDX', 'MDX', 'ILX', 'TSX'],
        'Infiniti': ['Q50', 'QX60', 'Q60', 'QX80', 'Q70'],
        'Volvo': ['XC90', 'XC60', 'S60', 'V60', 'XC40'],
        'Buick': ['Enclave', 'Encore', 'LaCrosse', 'Regal', 'Envision'],
        'Lincoln': ['Navigator', 'MKZ', 'MKX', 'Continental', 'Corsair'],
        'Genesis': ['G90', 'G80', 'GV70', 'GV80', 'G70'],
        'Tesla': ['Model 3', 'Model Y', 'Model S', 'Model X', 'Cybertruck']
    };

    const models = modelsByMake[make || ''] || ['Sedan', 'SUV', 'Coupe', 'Hatchback', 'Truck'];

    const handleModelSelect = (model: string) => {
        const params = new URLSearchParams({ 
            year: year || '', 
            make: make || '',
            model: model
        });
        if (returnTo) params.append('returnTo', returnTo);
        router.push(`/garage/add-vehicle/color?${params.toString()}`);
    };

    const handleBack = () => {
        const params = new URLSearchParams();
        if (year) params.append('year', year);
        if (returnTo) params.append('returnTo', returnTo);
        router.push(`/garage/add-vehicle/make?${params.toString()}`);
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
                    <h1 className="text-2xl font-semibold">Select Model</h1>
                </div>

                <div className="space-y-3">
                    {models.map((model) => (
                        <Button
                            key={model}
                            variant="outline"
                            className="w-full h-12 justify-start"
                            onClick={() => handleModelSelect(model)}
                        >
                            {model}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ModelSelectionPage = () => {
    return (
        <Suspense fallback={<div className="flex-1 overflow-y-auto p-4"><div className="max-w-2xl mx-auto"><div className="text-center">Loading...</div></div></div>}>
            <ModelSelectionContent />
        </Suspense>
    );
};

export default ModelSelectionPage;