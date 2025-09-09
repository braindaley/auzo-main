"use client";

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const YearSelectionPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnTo = searchParams.get('returnTo');
    
    const years = Array.from({ length: 31 }, (_, i) => 2025 - i);

    const handleYearSelect = (year: number) => {
        const params = new URLSearchParams({ year: year.toString() });
        if (returnTo) params.append('returnTo', returnTo);
        router.push(`/garage/add-vehicle/make?${params.toString()}`);
    };

    const handleBack = () => {
        router.push('/garage');
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
                    <h1 className="text-2xl font-semibold">Select Year</h1>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {years.map((year) => (
                        <Button
                            key={year}
                            variant="outline"
                            className="h-12 bg-white hover:bg-gray-50 border-gray-200"
                            onClick={() => handleYearSelect(year)}
                        >
                            {year}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default YearSelectionPage;