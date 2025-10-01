"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Droplet } from 'lucide-react';
import { useRouter } from 'next/navigation';

const PromotionsPage = () => {
    const router = useRouter();

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
                <h1 className="heading-1 mb-6">Promotions</h1>

                <Card
                    className="bg-white hover:bg-gray-50 transition-colors border cursor-pointer"
                    onClick={() => {
                        // Set promotional flag for the oil change special
                        sessionStorage.setItem('isPromotionalOilChange', 'true');
                        sessionStorage.setItem('promotionalDiscount', '10');
                        // Navigate to service explanation for quick lube
                        router.push('/service-explanation?service=quick%20lube&promotional=true');
                    }}
                >
                    <CardContent className="p-0">
                        {/* Promotional Image */}
                        <div className="h-32 bg-gray-200 rounded-t-lg flex items-center justify-center">
                            <div className="text-gray-600 text-center">
                                <Droplet className="w-12 h-12 mx-auto mb-2 opacity-80" />
                                <p className="text-sm font-medium">Oil Change Special</p>
                            </div>
                        </div>

                        {/* Promotion Details */}
                        <div className="p-4 space-y-1">
                            <p className="text-lg font-bold text-gray-900">$10 off Oil Change</p>
                            <p className="text-sm text-gray-700 font-medium">Oilstop</p>
                            <p className="text-sm text-gray-600">33-Points Service</p>
                            <p className="text-xs text-gray-500">Round Trip Auzo Service Included</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PromotionsPage;
