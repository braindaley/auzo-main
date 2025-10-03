"use client";

import { useState, useEffect, Suspense } from 'react';
import { ArrowLeft, MapPin, Car, Calendar, Clock, DollarSign, CreditCard, Wrench, MessageSquare, Fuel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Vehicle } from '@/components/car-card';
import { BookingCreditCardSelector } from '@/components/booking-credit-card-selector';
import { CreditCard as CreditCardType } from '@/lib/types/credit-card';
import { 
  getActiveCreditCards, 
  setDefaultCreditCard,
  deleteCreditCard 
} from '@/lib/services/credit-card-service';

function ConfirmBookingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [destination, setDestination] = useState<string>('');
    const [pickupLocation, setPickupLocation] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [creditCards, setCreditCards] = useState<CreditCardType[]>([]);
    const [selectedCardId, setSelectedCardId] = useState<string>('');
    const [isLoadingCards, setIsLoadingCards] = useState(true);
    const [isRoundTrip, setIsRoundTrip] = useState<boolean>(false);
    const [selectedServiceCategory, setSelectedServiceCategory] = useState<string>('');
    const [selectedServiceOption, setSelectedServiceOption] = useState<any>(null);
    const [driverNotes, setDriverNotes] = useState<string>('');
    const [willMeetDriver, setWillMeetDriver] = useState<boolean>(false);
    const [keyHandoffMethod, setKeyHandoffMethod] = useState<'meet' | 'other' | ''>('');
    const [isOrderPickup, setIsOrderPickup] = useState<boolean>(false);
    const [selectedCarWash, setSelectedCarWash] = useState<any>(null);
    const [selectedFuelFill, setSelectedFuelFill] = useState<any>(null);
    const deliveryFee = 14.90;

    useEffect(() => {
        // Only access sessionStorage if we're in the browser
        if (typeof window === 'undefined') return;

        // Check for URL parameters first (for Order Pickup functionality)
        const urlVehicleId = searchParams.get('vehicleId');
        const urlDestination = searchParams.get('destination');
        const urlPickupLocation = searchParams.get('pickupLocation');

        // If we have URL parameters, this is an order pickup scenario
        const isPickupScenario = !!(urlVehicleId && urlDestination && urlPickupLocation);
        setIsOrderPickup(isPickupScenario);

        // Get selected vehicle - either from URL param or sessionStorage
        if (urlVehicleId) {
            // If vehicleId is in URL, we need to construct the vehicle object
            // For now, we'll use a simple approach - in a real app, you'd fetch vehicle details by ID
            setSelectedVehicle({
                id: urlVehicleId,
                year: '2018',
                make: 'Hyundai',
                model: 'Tucson',
                color: 'Blue'
            } as Vehicle);
        } else {
            const vehicleData = sessionStorage.getItem('selectedVehicle');
            if (vehicleData) {
                try {
                    setSelectedVehicle(JSON.parse(vehicleData));
                } catch {
                    // Handle parsing errors gracefully
                }
            }
        }

        // Get destination - either from URL param or sessionStorage
        if (urlDestination) {
            setDestination(urlDestination);
        } else {
            const storedDestination = sessionStorage.getItem('selectedDestination');
            if (storedDestination) {
                setDestination(storedDestination);
            }
        }

        // Get pickup location - either from URL param or default to actual address
        if (urlPickupLocation) {
            setPickupLocation(urlPickupLocation);
        } else {
            // Use a realistic address for the user's current location
            setPickupLocation('1234 Market Street, San Francisco, CA 94103');
        }

        // Get date and time from sessionStorage (if stored from choose-time page)
        const storedDate = sessionStorage.getItem('selectedDate');
        const storedTime = sessionStorage.getItem('selectedTime');
        if (storedDate) setSelectedDate(storedDate);
        if (storedTime) setSelectedTime(storedTime);

        // Get round trip flag from sessionStorage
        const roundTripFlag = sessionStorage.getItem('isRoundTrip');
        if (roundTripFlag === 'true') {
            setIsRoundTrip(true);
        }

        // Get selected service details
        const serviceCategory = sessionStorage.getItem('selectedServiceCategory');
        const serviceOption = sessionStorage.getItem('selectedServiceOption');
        if (serviceCategory) {
            setSelectedServiceCategory(serviceCategory);
        }
        if (serviceOption) {
            try {
                setSelectedServiceOption(JSON.parse(serviceOption));
            } catch {
                // Handle parsing errors gracefully
            }
        }

        // Get add-on services - only for one-way services, not round trips
        if (roundTripFlag !== 'true') {
            // Only load add-on services for one-way bookings
            const carWash = sessionStorage.getItem('selectedCarWash');
            const fuelFill = sessionStorage.getItem('selectedFuelFill');
            if (carWash) {
                try {
                    setSelectedCarWash(JSON.parse(carWash));
                } catch {
                    // Handle parsing errors gracefully
                }
            }
            if (fuelFill) {
                try {
                    setSelectedFuelFill(JSON.parse(fuelFill));
                } catch {
                    // Handle parsing errors gracefully
                }
            }
        } else {
            // Clear any cached add-on services for round trip flows
            sessionStorage.removeItem('selectedCarWash');
            sessionStorage.removeItem('selectedFuelFill');
            setSelectedCarWash(null);
            setSelectedFuelFill(null);
        }

        // Load user's credit cards
        loadCreditCards();
    }, [searchParams]);

    const loadCreditCards = async () => {
        try {
            setIsLoadingCards(true);
            // For now, using a dummy user ID. In a real app, this would come from auth context
            const userId = 'demo-user-123';
            const cards = await getActiveCreditCards(userId);
            
            // Ensure only one card is marked as default (data consistency check)
            let defaultFound = false;
            const cleanedCards = cards.map(card => {
                if (card.isDefault) {
                    if (defaultFound) {
                        // If we already found a default, mark this one as non-default
                        return { ...card, isDefault: false };
                    }
                    defaultFound = true;
                }
                return card;
            });
            
            // Sort cards: default first, then by creation date
            const sortedCards = cleanedCards.sort((a, b) => {
                if (a.isDefault && !b.isDefault) return -1;
                if (!a.isDefault && b.isDefault) return 1;
                if (a.createdAt && b.createdAt) {
                    const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : a.createdAt.toMillis();
                    const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : b.createdAt.toMillis();
                    return bTime - aTime; // Most recent first
                }
                return 0;
            });
            setCreditCards(sortedCards);
            
            // Auto-select default card if available
            const defaultCard = sortedCards.find(card => card.isDefault);
            if (defaultCard) {
                setSelectedCardId(defaultCard.id!);
            } else if (sortedCards.length > 0) {
                setSelectedCardId(sortedCards[0].id!);
            }
        } catch (error) {
            console.error('Error loading credit cards:', error);
            setCreditCards([]);
        } finally {
            setIsLoadingCards(false);
        }
    };

    const handleCardSelect = (cardId: string) => {
        setSelectedCardId(cardId);
    };

    const handleSetDefault = async (cardId: string) => {
        const userId = 'demo-user-123';
        
        try {
            await setDefaultCreditCard(userId, cardId);
            await loadCreditCards(); // Reload to show updated default status
        } catch (error) {
            console.error('Error setting default card:', error);
            throw error;
        }
    };

    const handleDeleteCard = async (cardId: string) => {
        const userId = 'demo-user-123';
        
        try {
            await deleteCreditCard(userId, cardId);
            await loadCreditCards(); // Reload the list
        } catch (error) {
            console.error('Error deleting credit card:', error);
            throw error;
        }
    };

    const handleRequestDriver = () => {
        // Validate that a credit card is selected
        if (!selectedCardId || creditCards.length === 0) {
            alert('Please add and select a credit card to continue.');
            return;
        }

        // Validate key handoff method is selected
        if (!keyHandoffMethod) {
            alert('Please select how you will hand off the keys.');
            return;
        }

        // Validate that if "other" is selected, instructions are provided
        if (keyHandoffMethod === 'other' && !driverNotes.trim()) {
            alert('Please provide instructions for key handoff.');
            return;
        }

        // Store selected card info for next page if needed
        sessionStorage.setItem('selectedCardId', selectedCardId);

        // Store key handoff method
        sessionStorage.setItem('keyHandoffMethod', keyHandoffMethod);

        // Store driver notes if provided
        if (driverNotes.trim()) {
            sessionStorage.setItem('driverNotes', driverNotes);
        }

        // Check if this is a scheduled booking (has date and time)
        if (selectedDate && selectedTime) {
            // For scheduled bookings, go to scheduled confirmation
            router.push('/booking-scheduled');
        } else {
            // For immediate bookings, go to driver search
            router.push('/driver-requested');
        }
    };

    const formatDateTime = () => {
        if (selectedDate && selectedTime) {
            return `${selectedDate} at ${selectedTime}`;
        }
        return 'ASAP';
    };

    const calculateServiceCost = () => {
        // For price ranges, we'll return the range string itself
        // For the Total calculation, we'll show the range plus delivery fee
        return selectedServiceOption?.price || '';
    };

    const calculateTotalCost = () => {
        // For round-trip services with price ranges (like oil changes)
        if (isRoundTrip && selectedServiceOption?.price && selectedServiceOption.price.includes('-')) {
            // Extract min and max values from price range
            const matches = selectedServiceOption.price.match(/\$(\d+(?:\.\d+)?)-\$?(\d+(?:\.\d+)?)/);
            if (matches) {
                const minPrice = parseFloat(matches[1]);
                const maxPrice = parseFloat(matches[2]);
                const totalMin = deliveryFee + minPrice;
                const totalMax = deliveryFee + maxPrice;
                return `$${totalMin.toFixed(2)}-$${totalMax.toFixed(2)}`;
            }
        }

        // For fixed prices (backward compatibility)
        let serviceCost = 0;

        // Only add service cost for round-trip services
        if (isRoundTrip && selectedServiceOption?.price) {
            const priceStr = selectedServiceOption.price.replace(/[^0-9.]/g, '');
            const price = parseFloat(priceStr);
            if (!selectedServiceOption.price.includes('gallon') && !isNaN(price)) {
                serviceCost += price;
            }
        }

        // Add car wash cost (one-way services only)
        if (!isRoundTrip && selectedCarWash?.price) {
            const carWashPriceStr = selectedCarWash.price.replace(/[^0-9.]/g, '');
            const carWashPrice = parseFloat(carWashPriceStr);
            serviceCost += isNaN(carWashPrice) ? 0 : carWashPrice;
        }

        return `$${(deliveryFee + serviceCost).toFixed(2)}`;
    };

    const getBackUrl = () => {
        // If it's a round trip (Auzo service), go back to service selection
        // Otherwise go back to vehicle selection
        if (isRoundTrip && selectedServiceOption) {
            const serviceType = sessionStorage.getItem('selectedServiceType');
            if (serviceType) {
                return `/select-service-options?service=${encodeURIComponent(serviceType)}`;
            }
            return '/select-service-options';
        }
        return '/select-vehicle';
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="border-b bg-white px-4 py-4">
                <div className="flex items-center gap-4">
                    <Link href={getBackUrl()} className="p-1">
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-lg font-semibold text-gray-900">
                            {isRoundTrip ? 'Confirm Round Trip' : 'Confirm Booking'}
                        </h1>
                        {isRoundTrip && (
                            <p className="text-sm text-blue-600 font-medium">Auzo Service</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {/* From and To Section - Round Trip or One Way */}
                <Card className="p-3 bg-white">
                    <div className="space-y-2">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 flex items-center justify-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 leading-none mb-1">From</p>
                                {isOrderPickup ? (
                                    <>
                                        <p className="text-sm text-gray-900 font-medium leading-tight mb-1">
                                            {destination || 'AutoZone Pro Service Center'}
                                        </p>
                                        <p className="text-xs text-gray-600 leading-tight">
                                            789 Mission Street, San Francisco, CA 94103
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm text-gray-900 font-medium leading-tight mb-1">My location</p>
                                        <p className="text-xs text-gray-600 leading-tight">{pickupLocation}</p>
                                    </>
                                )}
                            </div>
                        </div>
                        
                        <div className="border-l border-gray-200 ml-3 h-2"></div>
                        
                        <div className="flex items-start gap-3">
                            <MapPin className="w-6 h-6 text-blue-500" />
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 leading-none mb-1">To</p>
                                {isOrderPickup ? (
                                    <>
                                        <p className="text-sm text-gray-900 font-medium leading-tight mb-1">
                                            Starting location
                                        </p>
                                        <p className="text-xs text-gray-600 leading-tight">
                                            {pickupLocation || '1234 Main Street, Phoenix, AZ 85001'}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm text-gray-900 font-medium leading-tight mb-1">
                                            {destination || 'AutoZone Pro Service Center'}
                                        </p>
                                        <p className="text-xs text-gray-600 leading-tight">
                                            789 Mission Street, San Francisco, CA 94103
                                        </p>
                                        {isRoundTrip && (
                                            <p className="text-xs text-blue-600 font-medium mt-1">Auzo Service</p>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Show return trip for round trip bookings */}
                        {isRoundTrip && (
                            <>
                                <div className="border-l border-gray-200 ml-3 h-2"></div>
                                
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 leading-none mb-1">Back to</p>
                                        <p className="text-sm text-gray-900 font-medium leading-tight mb-1">My location</p>
                                        <p className="text-xs text-gray-600 leading-tight">{pickupLocation}</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </Card>

                {/* Vehicle Section */}
                <Card className="p-3 bg-white">
                    <div className="flex items-start gap-3">
                        <Car className="w-6 h-6 text-gray-600" />
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 leading-none mb-0.5">Vehicle</p>
                            {selectedVehicle ? (
                                <p className="text-sm text-gray-900 font-medium leading-tight">
                                    {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                                    {selectedVehicle?.color && ` (${selectedVehicle.color})`}
                                </p>
                            ) : (
                                <p className="text-sm text-gray-900 font-medium leading-tight">No vehicle selected</p>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Service Selection (for Auzo Service) - Removed as it's now in Cost Section */}

                {/* Date/Time Section */}
                <Card className="p-3 bg-white">
                    <div className="flex items-start gap-3">
                        {selectedDate && selectedTime ? (
                            <Calendar className="w-6 h-6 text-gray-600" />
                        ) : (
                            <Clock className="w-6 h-6 text-gray-600" />
                        )}
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 leading-none mb-0.5">Pickup Time</p>
                            <p className="text-sm text-gray-900 font-medium leading-tight">{formatDateTime()}</p>
                        </div>
                    </div>
                </Card>

                {/* Cost Section */}
                <Card className="p-3 bg-white">
                    <div className="space-y-3">
                        {/* Delivery Fee */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-start gap-3">
                                <DollarSign className="w-6 h-6 text-gray-600" />
                                <div>
                                    <p className="text-xs text-gray-500 leading-none mb-0.5">Delivery Fee</p>
                                    <p className="text-sm text-gray-900 font-medium leading-tight">
                                        {isRoundTrip ? 'Round trip service' : 'One-way delivery'}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold text-gray-900">${deliveryFee.toFixed(2)}</p>
                            </div>
                        </div>
                        
                        {/* Service Cost (if applicable) */}
                        {isRoundTrip && selectedServiceOption && (
                            <>
                                <div className="border-t pt-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-start gap-3">
                                            <Wrench className="w-6 h-6 text-gray-600" />
                                            <div>
                                                <p className="text-xs text-gray-500 leading-none mb-0.5">Service</p>
                                                <p className="text-sm text-gray-900 font-medium leading-tight">
                                                    {selectedServiceOption.name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-semibold text-gray-900">
                                                {selectedServiceOption.price.includes('gallon')
                                                    ? selectedServiceOption.price
                                                    : selectedServiceOption.price}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Car Wash Add-on */}
                        {selectedCarWash && (
                            <div className="border-t pt-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start gap-3">
                                        <Car className="w-6 h-6 text-gray-600" />
                                        <div>
                                            <p className="text-xs text-gray-500 leading-none mb-0.5">Car-wash</p>
                                            <p className="text-sm text-gray-900 font-medium leading-tight">
                                                {selectedCarWash.name}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-semibold text-gray-900">
                                            ${(() => {
                                                const priceStr = selectedCarWash.price.replace(/[^0-9.]/g, '');
                                                const price = parseFloat(priceStr);
                                                return (isNaN(price) ? 0 : price).toFixed(2);
                                            })()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Fuel Fill Add-on */}
                        {selectedFuelFill && (
                            <div className="border-t pt-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start gap-3">
                                        <Fuel className="w-6 h-6 text-gray-600" />
                                        <div>
                                            <p className="text-xs text-gray-500 leading-none mb-0.5">Fuel fill</p>
                                            <p className="text-sm text-gray-900 font-medium leading-tight">
                                                {selectedFuelFill.name} {selectedFuelFill.price}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-semibold text-gray-900">
                                            TBD
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Total */}
                        {((isRoundTrip && selectedServiceOption) || selectedCarWash || selectedFuelFill) && (
                            <div className="border-t pt-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6" />
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Total</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-primary">
                                            ${calculateTotalCost()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Fuel Note */}
                        {((isRoundTrip && selectedServiceOption && selectedServiceOption.price?.includes('gallon')) || selectedFuelFill) && (
                            <div className="border-t pt-3">
                                <p className="text-xs text-gray-500 italic">
                                    * Fuel cost will be calculated based on gallons filled. Price per gallon is estimated and may change.
                                </p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Payment Method Section */}
                <Card className="p-4 bg-white">
                    <div className="flex items-start gap-3 mb-4">
                        <CreditCard className="w-6 h-6 text-gray-600" />
                        <div className="flex-1">
                            <p className="text-lg font-semibold text-gray-900">Payment Method</p>
                            <p className="text-sm text-gray-600">
                                {isLoadingCards ? 'Loading payment methods...' : 
                                 creditCards.length === 0 ? 'Add a card to continue' : 
                                 `${creditCards.length} card${creditCards.length === 1 ? '' : 's'} available`}
                            </p>
                        </div>
                    </div>
                    
                    <BookingCreditCardSelector
                        cards={creditCards}
                        selectedCardId={selectedCardId}
                        onCardSelect={handleCardSelect}
                        onSetDefault={handleSetDefault}
                        onDelete={handleDeleteCard}
                        isLoading={isLoadingCards}
                        required={true}
                    />
                </Card>

                {/* Key Handoff Section */}
                <Card className="p-3 bg-white">
                    <div className="flex items-start gap-3 mb-3">
                        <MessageSquare className="w-6 h-6 text-gray-600" />
                        <div className="flex-1">
                            <p className="text-sm text-gray-900 font-medium leading-tight">
                                How will you hand off the keys?
                            </p>
                        </div>
                    </div>

                    <div className="ml-9 space-y-3">
                        <div className="flex items-start space-x-2">
                            <Checkbox
                                id="meet-driver"
                                checked={keyHandoffMethod === 'meet'}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        setKeyHandoffMethod('meet');
                                        setDriverNotes('');
                                    } else {
                                        setKeyHandoffMethod('');
                                    }
                                }}
                                className="mt-0.5"
                            />
                            <label
                                htmlFor="meet-driver"
                                className="text-sm text-gray-700 cursor-pointer select-none"
                            >
                                I'll meet the driver
                            </label>
                        </div>

                        <div className="flex items-start space-x-2">
                            <Checkbox
                                id="other-handoff"
                                checked={keyHandoffMethod === 'other'}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        setKeyHandoffMethod('other');
                                    } else {
                                        setKeyHandoffMethod('');
                                        setDriverNotes('');
                                    }
                                }}
                                className="mt-0.5"
                            />
                            <label
                                htmlFor="other-handoff"
                                className="text-sm text-gray-700 cursor-pointer select-none"
                            >
                                Other
                            </label>
                        </div>

                        {keyHandoffMethod === 'other' && (
                            <div>
                                <Textarea
                                    placeholder="Please provide instructions for key handoff (e.g., keys will be with front desk, in lockbox, etc.)"
                                    value={driverNotes}
                                    onChange={(e) => setDriverNotes(e.target.value)}
                                    className={`resize-none ${!driverNotes.trim() ? 'border-orange-400' : ''}`}
                                    rows={3}
                                    required
                                />
                                {!driverNotes.trim() && (
                                    <p className="text-xs text-orange-600 mt-1">
                                        * Required: Please provide key handoff instructions
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </Card>

                {/* Order Auzo Driver Button */}
                <div className="pt-4">
                    <Button
                        className="w-full h-12 text-base font-semibold"
                        onClick={handleRequestDriver}
                        disabled={isLoadingCards || (!selectedCardId && creditCards.length === 0) || !keyHandoffMethod || (keyHandoffMethod === 'other' && !driverNotes.trim())}
                    >
                        {isLoadingCards ? 'Loading...' : 'Order Auzo Driver'}
                    </Button>
                    {creditCards.length === 0 && !isLoadingCards && (
                        <p className="text-xs text-red-600 mt-2 text-center">
                            Please add a credit card to continue
                        </p>
                    )}
                    {!keyHandoffMethod && creditCards.length > 0 && !isLoadingCards && (
                        <p className="text-xs text-orange-600 mt-2 text-center">
                            Please select how you will hand off the keys
                        </p>
                    )}
                    {keyHandoffMethod === 'other' && !driverNotes.trim() && !isLoadingCards && (
                        <p className="text-xs text-orange-600 mt-2 text-center">
                            Please provide key handoff instructions
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ConfirmBookingPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col min-h-screen bg-gray-50">
                <div className="border-b bg-white px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Link href="/select-vehicle" className="p-1">
                            <ArrowLeft className="w-6 h-6 text-gray-600" />
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-lg font-semibold text-gray-900">Confirm Booking</h1>
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-gray-500">Loading...</div>
                </div>
            </div>
        }>
            <ConfirmBookingContent />
        </Suspense>
    );
}