"use client";

import { useState, use } from 'react';
import { ArrowLeft, MapPin, Clock, Search, Calendar, Car, Wrench, Cog, Settings, PaintBucket, Gauge, CircleDot, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Service-specific locations for one-way services
const serviceLocations = {
    dealer: [
        {
            id: 1,
            type: 'business',
            businessName: 'Honda Service Center',
            address: '123 Bay Shore Blvd',
            city: 'San Francisco, CA',
            distance: '0.9 mi',
            lastVisited: '2 hours ago',
            serviceType: 'dealer'
        },
        {
            id: 2,
            type: 'business', 
            businessName: 'Toyota Service Department',
            address: '456 Geary Blvd',
            city: 'San Francisco, CA',
            distance: '1.2 mi',
            lastVisited: '1 day ago',
            serviceType: 'dealer'
        },
        {
            id: 3,
            type: 'business',
            businessName: 'Ford Dealership Service',
            address: '789 Van Ness Ave',
            city: 'San Francisco, CA',
            distance: '1.5 mi',
            lastVisited: '3 days ago',
            serviceType: 'dealer'
        },
        {
            id: 4,
            type: 'business',
            businessName: 'Chevrolet Service Center',
            address: '890 Mission St',
            city: 'San Francisco, CA',
            distance: '1.8 mi',
            lastVisited: '5 days ago',
            serviceType: 'dealer'
        },
        {
            id: 5,
            type: 'business',
            businessName: 'Nissan Service Department',
            address: '234 Market St',
            city: 'San Francisco, CA',
            distance: '2.1 mi',
            lastVisited: '1 week ago',
            serviceType: 'dealer'
        },
        {
            id: 6,
            type: 'business',
            businessName: 'BMW Service Center',
            address: '567 Polk St',
            city: 'San Francisco, CA',
            distance: '2.4 mi',
            lastVisited: '1 week ago',
            serviceType: 'dealer'
        },
        {
            id: 7,
            type: 'business',
            businessName: 'Mercedes-Benz Service',
            address: '345 California St',
            city: 'San Francisco, CA',
            distance: '2.7 mi',
            lastVisited: '2 weeks ago',
            serviceType: 'dealer'
        },
        {
            id: 8,
            type: 'business',
            businessName: 'Audi Service Department',
            address: '678 Fillmore St',
            city: 'San Francisco, CA',
            distance: '3.0 mi',
            lastVisited: '2 weeks ago',
            serviceType: 'dealer'
        },
        {
            id: 9,
            type: 'business',
            businessName: 'Mazda Service Center',
            address: '901 Irving St',
            city: 'San Francisco, CA',
            distance: '3.3 mi',
            lastVisited: '3 weeks ago',
            serviceType: 'dealer'
        },
        {
            id: 10,
            type: 'business',
            businessName: 'Volkswagen Service',
            address: '123 Divisadero St',
            city: 'San Francisco, CA',
            distance: '3.6 mi',
            lastVisited: '3 weeks ago',
            serviceType: 'dealer'
        },
        {
            id: 11,
            type: 'business',
            businessName: 'Lexus Service Center',
            address: '456 Hayes St',
            city: 'San Francisco, CA',
            distance: '3.9 mi',
            lastVisited: '1 month ago',
            serviceType: 'dealer'
        },
        {
            id: 12,
            type: 'business',
            businessName: 'Acura Service Department',
            address: '789 Clement St',
            city: 'San Francisco, CA',
            distance: '4.2 mi',
            lastVisited: '1 month ago',
            serviceType: 'dealer'
        },
        {
            id: 13,
            type: 'business',
            businessName: 'Infiniti Service Center',
            address: '234 Judah St',
            city: 'San Francisco, CA',
            distance: '4.5 mi',
            lastVisited: '1 month ago',
            serviceType: 'dealer'
        },
        {
            id: 14,
            type: 'business',
            businessName: 'Cadillac Service Department',
            address: '567 Taraval St',
            city: 'San Francisco, CA',
            distance: '4.8 mi',
            lastVisited: '2 months ago',
            serviceType: 'dealer'
        },
        {
            id: 15,
            type: 'business',
            businessName: 'Lincoln Service Center',
            address: '890 Noriega St',
            city: 'San Francisco, CA',
            distance: '5.1 mi',
            lastVisited: '2 months ago',
            serviceType: 'dealer'
        },
        {
            id: 16,
            type: 'business',
            businessName: 'Volvo Service Department',
            address: '123 Quintara St',
            city: 'San Francisco, CA',
            distance: '5.4 mi',
            lastVisited: '2 months ago',
            serviceType: 'dealer'
        },
        {
            id: 17,
            type: 'business',
            businessName: 'Subaru Service Center',
            address: '456 Rivera St',
            city: 'San Francisco, CA',
            distance: '5.7 mi',
            lastVisited: '3 months ago',
            serviceType: 'dealer'
        },
        {
            id: 18,
            type: 'business',
            businessName: 'Hyundai Service Department',
            address: '789 Santiago St',
            city: 'San Francisco, CA',
            distance: '6.0 mi',
            lastVisited: '3 months ago',
            serviceType: 'dealer'
        }
    ],
    tire: [
        {
            id: 11,
            type: 'business',
            businessName: 'Discount Tire',
            address: '890 Geary Blvd',
            city: 'San Francisco, CA',
            distance: '1.1 mi',
            lastVisited: '3 days ago',
            serviceType: 'tire'
        },
        {
            id: 12,
            type: 'business',
            businessName: 'America\'s Tire',
            address: '234 Van Ness Ave',
            city: 'San Francisco, CA',
            distance: '1.4 mi',
            lastVisited: '1 week ago',
            serviceType: 'tire'
        },
        {
            id: 13,
            type: 'business',
            businessName: 'Les Schwab Tire Center',
            address: '567 Mission St',
            city: 'San Francisco, CA',
            distance: '1.7 mi',
            lastVisited: '1 week ago',
            serviceType: 'tire'
        },
        {
            id: 14,
            type: 'business',
            businessName: 'Costco Tire Center',
            address: '345 Harrison St',
            city: 'San Francisco, CA',
            distance: '2.0 mi',
            lastVisited: '2 weeks ago',
            serviceType: 'tire'
        },
        {
            id: 15,
            type: 'business',
            businessName: 'NTB - National Tire & Battery',
            address: '678 Market St',
            city: 'San Francisco, CA',
            distance: '2.3 mi',
            lastVisited: '2 weeks ago',
            serviceType: 'tire'
        },
        {
            id: 16,
            type: 'business',
            businessName: 'Big O Tires',
            address: '901 Polk St',
            city: 'San Francisco, CA',
            distance: '2.6 mi',
            lastVisited: '3 weeks ago',
            serviceType: 'tire'
        },
        {
            id: 17,
            type: 'business',
            businessName: 'Firestone Complete Auto Care',
            address: '123 California St',
            city: 'San Francisco, CA',
            distance: '2.9 mi',
            lastVisited: '3 weeks ago',
            serviceType: 'tire'
        },
        {
            id: 18,
            type: 'business',
            businessName: 'Goodyear Auto Service',
            address: '456 Fillmore St',
            city: 'San Francisco, CA',
            distance: '3.2 mi',
            lastVisited: '1 month ago',
            serviceType: 'tire'
        },
        {
            id: 19,
            type: 'business',
            businessName: 'Tire Barn',
            address: '789 Irving St',
            city: 'San Francisco, CA',
            distance: '3.5 mi',
            lastVisited: '1 month ago',
            serviceType: 'tire'
        },
        {
            id: 20,
            type: 'business',
            businessName: 'Pep Boys Tires & Auto',
            address: '234 Divisadero St',
            city: 'San Francisco, CA',
            distance: '3.8 mi',
            lastVisited: '1 month ago',
            serviceType: 'tire'
        },
        {
            id: 21,
            type: 'business',
            businessName: 'Wheel Works',
            address: '567 Hayes St',
            city: 'San Francisco, CA',
            distance: '4.1 mi',
            lastVisited: '2 months ago',
            serviceType: 'tire'
        },
        {
            id: 22,
            type: 'business',
            businessName: 'Mavis Tire & Brakes',
            address: '890 Clement St',
            city: 'San Francisco, CA',
            distance: '4.4 mi',
            lastVisited: '2 months ago',
            serviceType: 'tire'
        }
    ],
    brake: [
        {
            id: 21,
            type: 'business',
            businessName: 'Midas Brake Service',
            address: '345 Brake Blvd',
            city: 'San Francisco, CA',
            distance: '1.7 mi',
            lastVisited: '1 week ago',
            serviceType: 'brake'
        },
        {
            id: 22,
            type: 'business',
            businessName: 'Jiffy Lube Brake Center',
            address: '567 Stop St',
            city: 'San Francisco, CA',
            distance: '2.8 mi',
            lastVisited: '3 weeks ago',
            serviceType: 'brake'
        }
    ],
    transmission: [
        {
            id: 31,
            type: 'business',
            businessName: 'AAMCO Transmission',
            address: '678 Gear Ave',
            city: 'San Francisco, CA',
            distance: '2.0 mi',
            lastVisited: '10 days ago',
            serviceType: 'transmission'
        },
        {
            id: 32,
            type: 'business',
            businessName: 'Mr. Transmission',
            address: '789 Clutch St',
            city: 'San Francisco, CA',
            distance: '3.1 mi',
            lastVisited: '1 month ago',
            serviceType: 'transmission'
        }
    ],
    body: [
        {
            id: 41,
            type: 'business',
            businessName: 'Maaco Auto Body',
            address: '890 Paint Ave',
            city: 'San Francisco, CA',
            distance: '1.9 mi',
            lastVisited: '2 weeks ago',
            serviceType: 'body'
        },
        {
            id: 42,
            type: 'business',
            businessName: 'Joe\'s Body Shop',
            address: '123 Repair Rd',
            city: 'San Francisco, CA',
            distance: '2.6 mi',
            lastVisited: '1 month ago',
            serviceType: 'body'
        }
    ],
    general: [
        {
            id: 51,
            type: 'business',
            businessName: 'AutoZone Pro Service',
            address: '456 Fix St',
            city: 'San Francisco, CA',
            distance: '1.4 mi',
            lastVisited: '4 days ago',
            serviceType: 'general'
        },
        {
            id: 52,
            type: 'business',
            businessName: 'Pep Boys Auto Service',
            address: '789 Repair Ave',
            city: 'San Francisco, CA',
            distance: '2.2 mi',
            lastVisited: '1 week ago',
            serviceType: 'general'
        }
    ]
};

interface OneWayServicePageProps {
    searchParams: { pickup?: string; service?: string };
}

// Function to get the appropriate icon based on service type
const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
        case 'dealer':
            return Car;
        case 'tire':
            return CircleDot;
        case 'brake':
            return Gauge;
        case 'transmission':
            return Settings;
        case 'body':
            return PaintBucket;
        case 'general':
        default:
            return Wrench;
    }
};

export default function OneWayServicePage({ searchParams }: OneWayServicePageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDestination, setSelectedDestination] = useState('');
    const router = useRouter();
    const resolvedSearchParams = use(searchParams);
    const pickupTime = resolvedSearchParams?.pickup === 'later' ? 'later' : 'now';
    const serviceType = resolvedSearchParams?.service || '';
    const [currentPickupTime, setCurrentPickupTime] = useState(pickupTime);

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
        
        // One-way trip for all service centers - no round trip
        sessionStorage.setItem('isRoundTrip', 'false');
        sessionStorage.setItem('isOneWayService', 'true');
        
        setTimeout(() => {
            if (currentPickupTime === 'later') {
                router.push('/choose-time');
            } else {
                router.push('/select-vehicle');
            }
        }, 500);
    };

    // Get locations based on service type
    const getLocationsForService = (serviceType: string) => {
        const serviceLower = serviceType.toLowerCase();
        
        // Check for specific service types by keywords
        if (serviceLower.includes('dealer')) {
            return serviceLocations.dealer;
        } else if (serviceLower.includes('tire') || serviceLower.includes('wheel')) {
            return serviceLocations.tire;
        } else if (serviceLower.includes('brake') || serviceLower.includes('muffler')) {
            return serviceLocations.brake;
        } else if (serviceLower.includes('transmission')) {
            return serviceLocations.transmission;
        } else if (serviceLower.includes('body') || serviceLower.includes('glass')) {
            return serviceLocations.body;
        } else {
            return serviceLocations.general;
        }
    };

    const currentLocations = getLocationsForService(serviceType);
    const filteredDestinations = currentLocations.filter(dest => {
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
                        <h1 className="text-lg font-semibold text-gray-900">
                            {serviceType ? serviceType.split('%20').join(' ').split(' ')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                .join(' ') : 'Service'}
                        </h1>
                    </div>
                </div>
                <div className="pl-10">
                    <button 
                        onClick={() => {
                            if (currentPickupTime === 'now') {
                                router.push('/choose-time');
                            } else {
                                setCurrentPickupTime('now');
                            }
                        }}
                        className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors"
                    >
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">
                            {currentPickupTime === 'now' ? 'Now' : 'Later'}
                        </span>
                    </button>
                </div>
            </div>

            <div className="flex-1 p-4 space-y-4">
                <div className="relative">
                    {/* One-way visualization - no return trip */}
                    <div className="absolute left-4 top-16 h-16 w-0.5 bg-gray-300 z-0"></div>
                    
                    <div className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg bg-white mb-1 relative">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 z-10"></div>
                        <div className="flex-1">
                            <div className="text-xs text-gray-500 mb-1">From</div>
                            <div className="text-gray-900 font-medium">Current location</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 border-2 border-blue-500 rounded-lg bg-white relative">
                        <Search className="w-5 h-5 text-blue-500 flex-shrink-0 z-10" />
                        <div className="flex-1">
                            <div className="text-xs text-blue-600 font-medium mb-1">To</div>
                            {selectedDestination ? (
                                <div className="text-gray-900 font-medium">{selectedDestination}</div>
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
                </div>

                <div className="space-y-1">
                    <h2 className="text-sm font-medium text-gray-700 px-1 mb-2">
                        {serviceType ? `Select a ${serviceType.split('%20').join(' ').split(' ')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                            .join(' ')} location` : 'Select a service location'}
                    </h2>
                    
                    {filteredDestinations.map((destination) => (
                        <div 
                            key={destination.id}
                            onClick={() => handleDestinationSelect(destination)}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                        >
                            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full flex-shrink-0">
                                {(() => {
                                    const IconComponent = getServiceIcon(destination.serviceType);
                                    return <IconComponent className="w-4 h-4 text-gray-600" />;
                                })()}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 truncate">
                                            {destination.businessName}
                                        </p>
                                        <p className="text-sm text-gray-600 truncate">
                                            {destination.address}, {destination.city}
                                        </p>
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