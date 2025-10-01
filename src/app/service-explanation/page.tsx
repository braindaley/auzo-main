"use client";

import React, { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ServiceExplanationContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const serviceName = searchParams.get('service') || 'service';
    const isPromotional = searchParams.get('promotional') === 'true';

    useEffect(() => {
        // Clear promotional flag if not coming from promotional route
        if (!isPromotional) {
            sessionStorage.removeItem('isPromotionalOilChange');
            sessionStorage.removeItem('promotionalDiscount');
        }
    }, [isPromotional]);

    const formatServiceName = (service: string) => {
        return service.split('%20').join(' ').split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const handleNext = () => {
        const params = new URLSearchParams({
            service: serviceName,
            fromExplanation: 'true'
        });
        
        // Determine which flow to use based on service type
        const serviceNameLower = serviceName.toLowerCase();
        
        // One-way service types (dealer, tire, brake, transmission, body, general repair)
        const isOneWayService = serviceNameLower.includes('dealer') || 
                               serviceNameLower.includes('tire') ||
                               serviceNameLower.includes('brake') ||
                               serviceNameLower.includes('transmission') ||
                               serviceNameLower.includes('body') ||
                               serviceNameLower.includes('general') ||
                               (serviceNameLower.includes('service') && serviceNameLower.includes('center'));
        
        // Full-service types (round-trip with Auzo Service - like quick lube, car wash, fuel fill)
        const isFullService = serviceNameLower.includes('quick lube') ||
                              serviceNameLower.includes('car wash') ||
                              serviceNameLower.includes('fuel fill') ||
                              (serviceNameLower.includes('service') && !serviceNameLower.includes('center'));
        
        let targetPath = '/deliver'; // Default to deliver flow
        if (isOneWayService) {
            targetPath = '/one-way-service'; // One-way service flow
        } else if (isFullService) {
            targetPath = '/full-service'; // Round-trip service flow
        }
        router.push(`${targetPath}?${params.toString()}`);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Header */}
            <div className="border-b bg-white px-4 py-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/home')}
                        className="p-1"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-lg font-semibold text-gray-900">
                            {formatServiceName(serviceName)}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 bg-white mx-4 mt-4 rounded-lg shadow-sm">
                <div className="space-y-4">
                    {(() => {
                        const serviceNameLower = serviceName.toLowerCase();
                        const isFullService = serviceNameLower.includes('quick lube') ||
                                              serviceNameLower.includes('car wash') ||
                                              serviceNameLower.includes('fuel fill');
                        
                        if (isFullService) {
                            return (
                                <>
                                    <p className="text-lg font-medium text-gray-900">
                                        Order an Auzo driver for a full service {formatServiceName(serviceName).toLowerCase()}
                                    </p>
                                    
                                    <p className="text-base text-gray-700">
                                        An Auzo driver will pick up your vehicle, complete your service, and return it back to your specified location.
                                    </p>
                                    
                                    <p className="text-base text-gray-700">
                                        Up-front pricing included! Note that you will receive a price quote when you order so that you know how much everything will cost up front.
                                    </p>

                                    <p className="text-base text-gray-700">
                                        Please ensure your vehicle is safe to drive before ordering service.
                                    </p>
                                </>
                            );
                        } else {
                            return (
                                <>
                                    <p className="text-lg font-medium text-gray-900">
                                        Order an Auzo driver for your {formatServiceName(serviceName).toLowerCase()}
                                    </p>

                                    <p className="text-base text-gray-700">
                                        An Auzo driver will pick up your vehicle and deliver it to your specified location.
                                    </p>

                                    <p className="text-base text-gray-700">
                                        Note: If an appointment is required, be sure to set that up in advance.
                                    </p>

                                    <p className="text-base text-gray-700">
                                        For your convenience, once your vehicle's service is completed, order another Auzo driver to bring it home.
                                    </p>

                                    <p className="text-base text-gray-700">
                                        Please ensure your vehicle is safe to drive before ordering service.
                                    </p>
                                </>
                            );
                        }
                    })()}

                    {/* Button */}
                    <div className="pt-4">
                        <Button 
                            className="w-full h-12 text-base font-semibold"
                            onClick={handleNext}
                        >
                            Request driver
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ServiceExplanationPage = () => {
    return (
        <Suspense fallback={<div className="flex flex-col min-h-screen bg-gray-50 items-center justify-center">Loading...</div>}>
            <ServiceExplanationContent />
        </Suspense>
    );
};

export default ServiceExplanationPage;