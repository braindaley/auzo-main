"use client";

import { useState, use, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, Search, Calendar, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const mockDestinations = [
    {
        id: 1,
        type: 'business',
        businessName: 'AutoZone Pro Service Center',
        address: '123 Main St',
        city: 'San Francisco, CA',
        distance: '0.8 mi',
        lastVisited: '2 hours ago',
        hasAuzoService: true
    },
    {
        id: 2,
        type: 'business', 
        businessName: 'Jiffy Lube Express',
        address: '456 Market St',
        city: 'San Francisco, CA',
        distance: '1.2 mi',
        lastVisited: '1 day ago',
        hasAuzoService: true
    },
    {
        id: 3,
        type: 'business',
        businessName: 'Tesla Service Center',
        address: '789 Harrison St',
        city: 'San Francisco, CA',
        distance: '2.1 mi',
        lastVisited: '3 days ago'
    },
    {
        id: 4,
        type: 'business',
        businessName: 'Midas Auto Repair',
        address: '1001 Van Ness Ave',
        city: 'San Francisco, CA',
        distance: '3.4 mi',
        lastVisited: '1 week ago'
    },
    {
        id: 5,
        type: 'business',
        businessName: 'Firestone Complete Auto Care',
        address: '567 Geary Blvd',
        city: 'San Francisco, CA',
        distance: '1.7 mi',
        lastVisited: '2 weeks ago'
    },
    {
        id: 6,
        type: 'business',
        businessName: 'BMW of San Francisco',
        address: '1675 Howard St',
        city: 'San Francisco, CA',
        distance: '2.5 mi',
        lastVisited: '3 weeks ago'
    },
    {
        id: 7,
        type: 'business',
        businessName: 'Discount Tire & Wheel',
        address: '890 Mission St',
        city: 'San Francisco, CA',
        distance: '1.9 mi',
        lastVisited: '1 month ago'
    },
    {
        id: 8,
        type: 'business',
        businessName: 'Pep Boys Auto Service',
        address: '234 Folsom St',
        city: 'San Francisco, CA',
        distance: '2.8 mi',
        lastVisited: '1 month ago'
    }
];

interface DeliverPageProps {
    searchParams: { pickup?: string };
}

export default function DeliverPage({ searchParams }: DeliverPageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDestination, setSelectedDestination] = useState('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const router = useRouter();
    const resolvedSearchParams = use(searchParams);
    const pickupTime = resolvedSearchParams?.pickup === 'later' ? 'later' : 'now';
    const [currentPickupTime, setCurrentPickupTime] = useState(pickupTime);
    
    useEffect(() => {
        // Check if date and time are already selected
        const storedDate = sessionStorage.getItem('selectedDate');
        const storedTime = sessionStorage.getItem('selectedTime');
        if (storedDate && storedTime) {
            setSelectedDate(storedDate);
            setSelectedTime(storedTime);
            setCurrentPickupTime('later');
        }
    }, []);

    const handleDestinationSelect = (destination: typeof mockDestinations[0]) => {
        const destinationName = destination.type === 'business' 
            ? destination.businessName 
            : destination.address;
        
        setSelectedDestination(destinationName || '');
        setSearchQuery(destinationName || '');
        
        // Store destination in sessionStorage for confirm-booking page
        sessionStorage.setItem('selectedDestination', destinationName || '');
        
        // Deliver flow is always one-way (no Auzo Service locations)
        sessionStorage.setItem('isRoundTrip', 'false');
        
        // Navigate to select vehicle page  
        setTimeout(() => {
            if (currentPickupTime === 'later' && selectedDate && selectedTime) {
                // Time already selected, go to vehicle selection
                router.push('/select-vehicle?pickup=later');
            } else if (currentPickupTime === 'later') {
                // Need to select time first
                router.push('/choose-time?from=deliver');
            } else {
                // Immediate pickup
                router.push('/select-vehicle');
            }
        }, 500);
    };

    const filteredDestinations = mockDestinations
        .filter(dest => !('hasAuzoService' in dest) || !dest.hasAuzoService) // Exclude Auzo Service locations
        .filter(dest => {
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
                        <h1 className="text-lg font-semibold text-gray-900">Deliver your car...</h1>
                    </div>
                    {selectedDate && selectedTime ? (
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => {
                                    // Navigate to choose-time page to edit
                                    router.push('/choose-time?from=deliver');
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
                                className="flex items-center justify-center w-8 h-8 bg-gray-100 border border-gray-300 rounded-md hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm"
                                title="Cancel scheduled time"
                            >
                                <X className="w-4 h-4 text-gray-700 hover:text-red-600" />
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => {
                                // Navigate to choose-time page
                                router.push('/choose-time?from=deliver');
                            }}
                            className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors"
                        >
                            <Calendar className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">
                                Later
                            </span>
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 p-4 space-y-4">
                <div className="relative">
                    <div className="absolute left-4 top-16 h-4 w-0.5 bg-gray-300 z-0"></div>
                    
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
                                    placeholder="Search destinations"
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
                    <h2 className="text-sm font-medium text-gray-700 px-1 mb-2">Recent destinations</h2>
                    
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
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3 text-gray-400" />
                                            <span className="text-xs text-gray-500">{destination.lastVisited}</span>
                                        </div>
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
                        <p className="text-gray-500">No destinations found</p>
                        <p className="text-sm text-gray-400">Try searching for an address or business name</p>
                    </div>
                )}
            </div>
        </div>
    );
}