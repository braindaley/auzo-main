"use client";

import { useState, useEffect, use } from 'react';
import { ArrowLeft, Droplets, Car, Fuel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Vehicle } from '@/components/car-card';

type ServiceOption = {
    id: string;
    name: string;
    price: string;
    description?: string;
};

type ServiceCategory = {
    id: string;
    name: string;
    icon: React.ElementType;
    options: ServiceOption[];
};

const serviceCategories: ServiceCategory[] = [
    {
        id: 'oil-change',
        name: 'Oil Change',
        icon: Droplets,
        options: [
            { id: 'synthetic', name: 'Synthetic Oil', price: '$70', description: 'High-performance synthetic oil' },
            { id: 'conventional', name: 'Conventional Oil', price: '$40', description: 'Standard conventional oil' }
        ]
    },
    {
        id: 'car-wash',
        name: 'Car Wash',
        icon: Car,
        options: [
            { id: 'basic', name: 'Basic Wash', price: '$15', description: 'Exterior wash and dry' },
            { id: 'premium', name: 'Premium Wash', price: '$25', description: 'Wash, wax, and interior vacuum' },
            { id: 'deluxe', name: 'Deluxe Wash', price: '$35', description: 'Full detail service' }
        ]
    },
    {
        id: 'fuel-fill',
        name: 'Fuel Fill',
        icon: Fuel,
        options: [
            { id: 'regular', name: 'Regular', price: '$3.20/gallon', description: '87 octane' },
            { id: 'mid-grade', name: 'Mid-Grade', price: '$3.60/gallon', description: '89 octane' },
            { id: 'premium', name: 'Premium', price: '$4.25/gallon', description: '93 octane' },
            { id: 'diesel', name: 'Diesel', price: '$3.95/gallon', description: 'Diesel fuel' }
        ]
    }
];

interface SelectServiceOptionsPageProps {
    searchParams: { service?: string };
}

export default function SelectServiceOptionsPage({ searchParams }: SelectServiceOptionsPageProps) {
    const router = useRouter();
    const resolvedSearchParams = use(searchParams);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [selectedService, setSelectedService] = useState<string>('');
    const [selectedOption, setSelectedOption] = useState<ServiceOption | null>(null);
    const [activeCategory, setActiveCategory] = useState<ServiceCategory | null>(null);

    useEffect(() => {
        // Get selected vehicle from sessionStorage
        const vehicleData = sessionStorage.getItem('selectedVehicle');
        if (vehicleData) {
            try {
                setSelectedVehicle(JSON.parse(vehicleData));
            } catch {
                // Handle parsing errors gracefully
            }
        }

        // Get the service type from sessionStorage or URL params
        const serviceTypeFromSession = sessionStorage.getItem('selectedServiceType');
        const serviceTypeFromUrl = resolvedSearchParams?.service;
        
        // Map service names from home page to service category IDs
        const serviceMapping: Record<string, string> = {
            'quick lube': 'oil-change',
            'car wash': 'car-wash',
            'fuel fill': 'fuel-fill'
        };
        
        let serviceType = serviceTypeFromSession;
        if (serviceTypeFromUrl) {
            serviceType = serviceMapping[serviceTypeFromUrl.toLowerCase()] || serviceTypeFromUrl;
        }
        
        if (serviceType) {
            const category = serviceCategories.find(cat => cat.id === serviceType);
            if (category) {
                setActiveCategory(category);
                setSelectedService(serviceType);
                // Store the resolved service type
                sessionStorage.setItem('selectedServiceType', serviceType);
            }
        }
    }, [resolvedSearchParams]);

    const handleServiceSelect = (category: ServiceCategory) => {
        setActiveCategory(category);
        setSelectedService(category.id);
        setSelectedOption(null);
    };

    const handleOptionSelect = (option: ServiceOption) => {
        setSelectedOption(option);
        
        // Automatically proceed to next screen after selection
        if (activeCategory) {
            // Store selected service details
            sessionStorage.setItem('selectedServiceCategory', activeCategory.name);
            sessionStorage.setItem('selectedServiceOption', JSON.stringify(option));
            
            // Add a small delay for visual feedback before navigation
            setTimeout(() => {
                router.push('/confirm-booking');
            }, 300);
        }
    };

    const handleContinue = () => {
        if (selectedOption && activeCategory) {
            // Store selected service details
            sessionStorage.setItem('selectedServiceCategory', activeCategory.name);
            sessionStorage.setItem('selectedServiceOption', JSON.stringify(selectedOption));
            
            // Navigate to confirm booking
            router.push('/confirm-booking');
        }
    };

    const handleBack = () => {
        router.push('/select-vehicle');
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="border-b bg-white px-4 py-4">
                <div className="flex items-center gap-4">
                    <button onClick={handleBack} className="p-1">
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-lg font-semibold text-gray-900">Select Service</h1>
                        <p className="text-sm text-blue-600 font-medium">Auzo Service</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {/* Vehicle Info */}
                {selectedVehicle && (
                    <Card className="mb-4 bg-blue-50 border-blue-200">
                        <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                                <Car className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-xs text-blue-600">Selected Vehicle</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Service Categories - Only show if no category is pre-selected */}
                {!activeCategory ? (
                    <div className="space-y-3">
                        <h2 className="text-sm font-medium text-gray-700 mb-3">Choose a service type</h2>
                        {serviceCategories.map((category) => {
                            const Icon = category.icon;
                            return (
                                <Card 
                                    key={category.id}
                                    className="cursor-pointer transition-all hover:shadow-md"
                                    onClick={() => handleServiceSelect(category)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Icon className="w-6 h-6 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900">{category.name}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {category.options.length} options available
                                                </p>
                                            </div>
                                            <div className="text-gray-400">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-medium text-gray-700">
                                Select {activeCategory.name} option
                            </h2>
                            {!resolvedSearchParams?.service && (
                                <button 
                                    onClick={() => {
                                        setActiveCategory(null);
                                        setSelectedOption(null);
                                        sessionStorage.removeItem('selectedServiceType');
                                    }}
                                    className="text-sm text-blue-600 hover:text-blue-700"
                                >
                                    Change service
                                </button>
                            )}
                        </div>
                        
                        {activeCategory.options.map((option) => (
                            <Card 
                                key={option.id}
                                className={`cursor-pointer transition-all ${
                                    selectedOption?.id === option.id 
                                        ? 'ring-2 ring-primary bg-primary/5' 
                                        : 'hover:shadow-md'
                                }`}
                                onClick={() => handleOptionSelect(option)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{option.name}</h3>
                                            {option.description && (
                                                <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-lg font-bold text-primary">{option.price}</p>
                                        </div>
                                    </div>
                                    {selectedOption?.id === option.id && (
                                        <div className="mt-3 pt-3 border-t">
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <span className="text-sm font-medium text-primary">Selected</span>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Continue Button */}
            <div className="border-t bg-white p-4">
                <Button 
                    className="w-full h-12 text-base font-semibold"
                    onClick={handleContinue}
                    disabled={!selectedOption}
                >
                    Continue to Booking
                </Button>
            </div>
        </div>
    );
}