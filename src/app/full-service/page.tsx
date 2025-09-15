"use client";

import { useState, use, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, Search, Calendar, ArrowRight, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Service-specific mock data with Auzo Service availability
const quickLubeLocations = [
    {
        id: 1,
        type: 'business',
        businessName: 'Oil Stop',
        address: '3045 Bristol St',
        city: 'Costa Mesa, CA',
        distance: '0.8 mi',
        lastVisited: '2 hours ago',
        serviceType: 'quick lube',
        hasAuzoService: true,
        provider: 'oilstop'
    },
    {
        id: 2,
        type: 'business', 
        businessName: 'Oil Stop',
        address: '1234 Main St',
        city: 'Newport Beach, CA',
        distance: '1.2 mi',
        lastVisited: '1 day ago',
        serviceType: 'quick lube',
        hasAuzoService: true,
        provider: 'oilstop'
    },
    {
        id: 3,
        type: 'business',
        businessName: 'Jiffy Lube',
        address: '123 Main St',
        city: 'San Francisco, CA',
        distance: '2.1 mi',
        lastVisited: '3 days ago',
        serviceType: 'quick lube',
        hasAuzoService: true,
        provider: 'jiffy-lube'
    },
    {
        id: 4,
        type: 'business', 
        businessName: 'Valvoline Instant Oil Change',
        address: '456 Market St',
        city: 'San Francisco, CA',
        distance: '2.5 mi',
        lastVisited: '1 week ago',
        serviceType: 'quick lube',
        hasAuzoService: true,
        provider: 'valvoline'
    }
];

const carWashLocations = [
    {
        id: 3,
        type: 'business',
        businessName: 'Sparkle Car Wash',
        address: '789 Harrison St',
        city: 'San Francisco, CA',
        distance: '2.1 mi',
        lastVisited: '3 days ago',
        serviceType: 'car wash',
        hasAuzoService: true
    },
    {
        id: 4,
        type: 'business',
        businessName: 'Shine & Polish Auto Spa',
        address: '1001 Van Ness Ave',
        city: 'San Francisco, CA',
        distance: '3.4 mi',
        lastVisited: '1 week ago',
        serviceType: 'car wash',
        hasAuzoService: false
    }
];

const fuelFillLocations = [
    {
        id: 5,
        type: 'business',
        businessName: 'Shell Station',
        address: '567 Geary Blvd',
        city: 'San Francisco, CA',
        distance: '1.7 mi',
        lastVisited: '2 weeks ago',
        serviceType: 'fuel fill',
        hasAuzoService: true
    },
    {
        id: 6,
        type: 'business',
        businessName: 'Chevron',
        address: '1675 Howard St',
        city: 'San Francisco, CA',
        distance: '2.5 mi',
        lastVisited: '3 weeks ago',
        serviceType: 'fuel fill',
        hasAuzoService: false
    }
];

const getServiceLocations = (serviceType: string, isPromotional: boolean = false) => {
    // For quick lube, car wash, and fuel fill services, only show Auzo Service locations
    const auzoOnlyServices = ['quick lube', 'car wash', 'fuel fill'];
    
    let locations;
    switch (serviceType) {
        case 'quick lube':
            locations = quickLubeLocations;
            break;
        case 'car wash':
            locations = carWashLocations;
            break;
        case 'fuel fill':
            locations = fuelFillLocations;
            break;
        default:
            locations = [...quickLubeLocations, ...carWashLocations, ...fuelFillLocations];
    }
    
    // Apply filtering based on service type and promotional status
    if (isPromotional && serviceType === 'quick lube') {
        // For promotional oil change: only show Oil Stop locations
        return locations.filter(location => location.hasAuzoService && location.provider === 'oilstop');
    } else if (auzoOnlyServices.includes(serviceType)) {
        // For quick lube, car wash, and fuel fill: only show Auzo Service locations
        return locations.filter(location => location.hasAuzoService);
    } else if (serviceType && !auzoOnlyServices.includes(serviceType)) {
        // For other specific services: only show non-Auzo Service locations
        return locations.filter(location => !location.hasAuzoService);
    } else {
        // For default/no specific service: return all locations
        return locations;
    }
};

const getServiceTitle = (serviceType: string) => {
    switch (serviceType) {
        case 'quick lube':
            return 'Quick Lube Service';
        case 'car wash':
            return 'Car Wash Service';
        case 'fuel fill':
            return 'Fuel Fill Service';
        default:
            return 'Auzo Service';
    }
};

interface ServicePageProps {
    searchParams: { pickup?: string; service?: string; fromExplanation?: string };
}

export default function ServicePage({ searchParams }: ServicePageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDestination, setSelectedDestination] = useState('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const router = useRouter();
    const resolvedSearchParams = use(searchParams);
    const pickupTime = resolvedSearchParams?.pickup === 'later' ? 'later' : 'now';
    const serviceType = resolvedSearchParams?.service ? decodeURIComponent(resolvedSearchParams.service).replace(/%20/g, ' ') : '';
    const [currentPickupTime, setCurrentPickupTime] = useState(pickupTime);
    
    useEffect(() => {
        // Check if we're coming from service explanation page
        const fromExplanation = resolvedSearchParams?.fromExplanation === 'true';
        
        // Check if date and time are already selected
        const storedDate = sessionStorage.getItem('selectedDate');
        const storedTime = sessionStorage.getItem('selectedTime');
        const storedDestination = sessionStorage.getItem('selectedDestination');
        const storedServiceType = sessionStorage.getItem('selectedServiceType');
        
        if (storedDate && storedTime) {
            setSelectedDate(storedDate);
            setSelectedTime(storedTime);
            setCurrentPickupTime('later');
        }
        
        // Clear destination if coming from home/service explanation (fresh flow)
        if (fromExplanation) {
            sessionStorage.removeItem('selectedDestination');
            sessionStorage.removeItem('selectedServiceType');
            // Clear any cached add-on services when starting fresh
            sessionStorage.removeItem('selectedCarWash');
            sessionStorage.removeItem('selectedFuelFill');
            setSelectedDestination('');
            setSearchQuery('');
        } else if (storedDestination && storedServiceType === resolvedSearchParams?.service) {
            // Only restore destination if we're in the same service flow and not starting fresh
            setSelectedDestination(storedDestination);
            setSearchQuery(storedDestination);
        } else {
            // Clear stored destination if it's a different service
            sessionStorage.removeItem('selectedDestination');
            sessionStorage.removeItem('selectedServiceType');
        }
    }, [resolvedSearchParams?.service, resolvedSearchParams?.fromExplanation]);

    const handleDestinationSelect = (destination: any) => {
        const destinationName = destination.type === 'business' 
            ? destination.businessName 
            : destination.address;
        
        setSelectedDestination(destinationName || '');
        setSearchQuery(destinationName || '');
        
        // Store destination and service info in sessionStorage
        sessionStorage.setItem('selectedDestination', destinationName || '');
        sessionStorage.setItem('serviceType', serviceType);
        
        // Store the specific service type if provided
        const urlServiceType = resolvedSearchParams?.service;
        if (urlServiceType) {
            sessionStorage.setItem('selectedServiceType', urlServiceType);
        }
        
        if (destination.hasAuzoService) {
            // Auzo Service locations - round trip flow
            sessionStorage.setItem('isRoundTrip', 'true');
            setTimeout(() => {
                if (currentPickupTime === 'later' && selectedDate && selectedTime) {
                    // Time already selected, go to vehicle selection
                    router.push('/select-vehicle?pickup=later');
                } else if (currentPickupTime === 'later') {
                    // Need to select time first, preserving service parameter
                    const params = new URLSearchParams();
                    params.set('from', 'full-service');
                    if (serviceType) {
                        params.set('service', serviceType);
                    }
                    router.push(`/choose-time?${params.toString()}`);
                } else {
                    // Immediate pickup
                    router.push('/select-vehicle');
                }
            }, 500);
        } else {
            // Regular delivery flow for locations without Auzo Service
            sessionStorage.setItem('isRoundTrip', 'false');
            setTimeout(() => {
                if (currentPickupTime === 'later' && selectedDate && selectedTime) {
                    // Time already selected, go to vehicle selection
                    router.push('/select-vehicle?pickup=later');
                } else if (currentPickupTime === 'later') {
                    // Need to select time first, preserving service parameter
                    const params = new URLSearchParams();
                    params.set('from', 'full-service');
                    if (serviceType) {
                        params.set('service', serviceType);
                    }
                    router.push(`/choose-time?${params.toString()}`);
                } else {
                    // Immediate pickup
                    router.push('/select-vehicle');
                }
            }, 500);
        }
    };

    // Check if this is a promotional oil change
    const isPromotionalOilChange = typeof window !== 'undefined' && sessionStorage.getItem('isPromotionalOilChange') === 'true';
    
    const serviceLocations = getServiceLocations(serviceType, isPromotionalOilChange);
    const serviceTitle = getServiceTitle(serviceType);

    const filteredDestinations = serviceLocations.filter(dest => {
        // If there's a selected destination, show all locations (don't filter)
        if (selectedDestination) return true;
        // Otherwise, filter based on search query
        if (!searchQuery) return true;
        const searchLower = searchQuery.toLowerCase();
        return (
            (dest.type === 'business' && dest.businessName?.toLowerCase().includes(searchLower)) ||
            dest.address.toLowerCase().includes(searchLower) ||
            dest.city.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <div className="border-b bg-white px-4 py-4">
                <div className="flex items-center gap-4 mb-3">
                    <Link href="/home" className="p-1">
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-lg font-semibold text-gray-900">{serviceTitle}</h1>
                    </div>
                </div>
                {/* Date/Time Selection moved below service title */}
                {selectedDate && selectedTime ? (
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => {
                                // Navigate to choose-time page to edit, preserving service parameter
                                const params = new URLSearchParams();
                                params.set('from', 'full-service');
                                if (serviceType) {
                                    params.set('service', serviceType);
                                }
                                router.push(`/choose-time?${params.toString()}`);
                            }}
                            className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors"
                        >
                            <Calendar className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">
                                {selectedDate} at {selectedTime}
                            </span>
                        </button>
                        <button
                            onClick={() => {
                                // Clear selected time and switch to now
                                sessionStorage.removeItem('selectedDate');
                                sessionStorage.removeItem('selectedTime');
                                setSelectedDate('');
                                setSelectedTime('');
                                setCurrentPickupTime('now');
                            }}
                            className="flex items-center justify-center w-8 h-8 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 hover:border-red-400 transition-colors shadow-sm"
                            title="Cancel scheduled time"
                        >
                            <span className="text-red-600 font-semibold text-sm leading-none">×</span>
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={() => {
                            // Navigate to choose-time page, preserving service parameter
                            const params = new URLSearchParams();
                            params.set('from', 'full-service');
                            if (serviceType) {
                                params.set('service', serviceType);
                            }
                            router.push(`/choose-time?${params.toString()}`);
                        }}
                        className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors w-fit"
                    >
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">
                            Later
                        </span>
                    </button>
                )}
            </div>

            <div className="flex-1 p-4 space-y-4">
                <div className="relative">
                    {/* Show round trip visualization for Auzo Service locations */}
                    <div className="absolute left-4 top-16 h-16 w-0.5 bg-gray-300 z-0"></div>
                    <div className="absolute left-4 top-36 h-16 w-0.5 bg-gray-300 z-0"></div>
                    
                    <div className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg bg-white mb-1 relative">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 z-10"></div>
                        <div className="flex-1">
                            <div className="text-xs text-gray-500 mb-1">From</div>
                            <div className="text-gray-900 font-medium">Current location</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 border-2 border-blue-500 rounded-lg bg-white mb-1 relative">
                        <Search className="w-5 h-5 text-blue-500 flex-shrink-0 z-10" />
                        <div className="flex-1">
                            <div className="text-xs text-blue-600 font-medium mb-1">To</div>
                            {selectedDestination ? (
                                <div className="flex items-center justify-between">
                                    <div className="text-gray-900 font-medium">{selectedDestination}</div>
                                    <button
                                        onClick={() => {
                                            setSelectedDestination('');
                                            setSearchQuery('');
                                            sessionStorage.removeItem('selectedDestination');
                                        }}
                                        className="text-gray-400 hover:text-gray-600 p-1"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <input 
                                    type="text"
                                    placeholder="Search service locations"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full outline-none text-gray-900 placeholder-gray-400 text-base border-0 p-0 bg-transparent"
                                    autoFocus
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg bg-white relative">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 z-10"></div>
                        <div className="flex-1">
                            <div className="text-xs text-gray-500 mb-1">Back to</div>
                            <div className="text-gray-900 font-medium">Current location</div>
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <h2 className="text-sm font-medium text-gray-700 px-1 mb-2">
                        {serviceType ? `Select a ${serviceTitle} location` : 'Select a service location'}
                    </h2>
                    
                    {filteredDestinations.map((destination) => (
                        <div 
                            key={destination.id}
                            onClick={() => handleDestinationSelect(destination)}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                        >
                            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full flex-shrink-0">
                                <MapPin className="w-4 h-4 text-gray-600" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        {destination.type === 'business' ? (
                                            <>
                                                {destination.hasAuzoService && (
                                                    <Badge variant="secondary" className="text-[10px] py-0 px-1.5 bg-blue-100 text-blue-700 mb-1 inline-block">
                                                        Auzo Service
                                                    </Badge>
                                                )}
                                                <p className="font-medium text-gray-900 truncate">
                                                    {destination.businessName}
                                                </p>
                                                <p className="text-sm text-gray-600 truncate">
                                                    {destination.address}, {destination.city}
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="font-medium text-gray-900 truncate">
                                                    {destination.address}
                                                </p>
                                                <p className="text-sm text-gray-600 truncate">
                                                    {destination.city}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                    
                                    <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                                        <span className="text-xs text-gray-500">{destination.distance}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredDestinations.length === 0 && searchQuery && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <MapPin className="w-12 h-12 text-gray-300 mb-3" />
                        <p className="text-gray-500">No service locations found</p>
                        <p className="text-sm text-gray-400">Try searching for a different location</p>
                    </div>
                )}
            </div>
        </div>
    );
}