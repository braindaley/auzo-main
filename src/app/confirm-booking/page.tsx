"use client";

import { useState, useEffect, Suspense } from 'react';
import { ArrowLeft, MapPin, Car, Calendar, Clock, DollarSign, CreditCard, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Vehicle } from '@/components/car-card';
import { CreditCardSelector } from '@/components/credit-card-selector';
import { CreditCard as CreditCardType, CreditCardFormData } from '@/lib/types/credit-card';
import { 
  getUserCreditCards, 
  addCreditCard,
  setDefaultCreditCard 
} from '@/lib/services/credit-card-service';

function ConfirmBookingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [destination, setDestination] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [creditCards, setCreditCards] = useState<CreditCardType[]>([]);
    const [selectedCardId, setSelectedCardId] = useState<string>('');
    const [isLoadingCards, setIsLoadingCards] = useState(true);
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [isRoundTrip, setIsRoundTrip] = useState<boolean>(false);
    const [selectedServiceCategory, setSelectedServiceCategory] = useState<string>('');
    const [selectedServiceOption, setSelectedServiceOption] = useState<any>(null);
    const isPickupLater = searchParams.get('pickup') === 'later';
    const deliveryFee = 14.90;

    useEffect(() => {
        // Only access sessionStorage if we're in the browser
        if (typeof window === 'undefined') return;

        // Get selected vehicle from sessionStorage
        const vehicleData = sessionStorage.getItem('selectedVehicle');
        if (vehicleData) {
            try {
                setSelectedVehicle(JSON.parse(vehicleData));
            } catch {
                // Handle parsing errors gracefully
            }
        }

        // Get destination from sessionStorage (if you store it)
        const storedDestination = sessionStorage.getItem('selectedDestination');
        if (storedDestination) {
            setDestination(storedDestination);
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

        // Load user's credit cards
        loadCreditCards();
    }, []);

    const loadCreditCards = async () => {
        try {
            setIsLoadingCards(true);
            // For now, using a dummy user ID. In a real app, this would come from auth context
            const userId = 'demo-user-123';
            const cards = await getUserCreditCards(userId);
            setCreditCards(cards);
            
            // Auto-select default card if available
            const defaultCard = cards.find(card => card.isDefault);
            if (defaultCard) {
                setSelectedCardId(defaultCard.id!);
            } else if (cards.length > 0) {
                setSelectedCardId(cards[0].id!);
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

    const handleAddCard = async (cardData: CreditCardFormData) => {
        try {
            setIsAddingCard(true);
            // For now, using a dummy user ID. In a real app, this would come from auth context
            const userId = 'demo-user-123';
            
            const cardInput = {
                cardNumber: cardData.cardNumber,
                cardholderName: cardData.cardholderName,
                expiryMonth: parseInt(cardData.expiryMonth),
                expiryYear: parseInt(cardData.expiryYear),
                cvv: cardData.cvv,
                nickname: cardData.nickname,
                billingAddress: cardData.billingAddress,
                isDefault: cardData.isDefault || creditCards.length === 0 // First card becomes default
            };

            const cardId = await addCreditCard(userId, cardInput);
            
            // Reload cards to get updated list
            await loadCreditCards();
            
            // Select the newly added card
            setSelectedCardId(cardId);
        } catch (error) {
            console.error('Error adding credit card:', error);
        } finally {
            setIsAddingCard(false);
        }
    };

    const handleRequestDriver = () => {
        // Validate that a credit card is selected
        if (!selectedCardId || creditCards.length === 0) {
            alert('Please add and select a credit card to continue.');
            return;
        }
        
        // Store selected card info for next page if needed
        sessionStorage.setItem('selectedCardId', selectedCardId);
        
        // Navigate to driver matching or confirmation page
        router.push('/driver-requested');
    };

    const formatDateTime = () => {
        if (isPickupLater && selectedDate && selectedTime) {
            return `${selectedDate} at ${selectedTime}`;
        }
        return 'ASAP';
    };

    const calculateServiceCost = () => {
        if (!selectedServiceOption?.price) return 0;
        
        // Extract numeric value from price string (e.g., "$70" -> 70)
        const priceStr = selectedServiceOption.price.replace(/[^0-9.]/g, '');
        const price = parseFloat(priceStr);
        
        // For fuel, we'll just show the per-gallon price, not calculate total
        if (selectedServiceOption.price.includes('gallon')) {
            return 0; // Fuel cost will be calculated at fill-up
        }
        
        return isNaN(price) ? 0 : price;
    };

    const calculateTotalCost = () => {
        const serviceCost = calculateServiceCost();
        return (deliveryFee + serviceCost).toFixed(2);
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
                                <p className="text-xs text-gray-500 leading-none mb-0.5">From</p>
                                <p className="text-sm text-gray-900 font-medium leading-tight">Current location</p>
                            </div>
                        </div>
                        
                        <div className="border-l border-gray-200 ml-3 h-2"></div>
                        
                        <div className="flex items-start gap-3">
                            <MapPin className="w-6 h-6 text-blue-500" />
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 leading-none mb-0.5">To</p>
                                <p className="text-sm text-gray-900 font-medium leading-tight">
                                    {destination || 'AutoZone Pro Service Center'}
                                </p>
                                {isRoundTrip && (
                                    <p className="text-xs text-blue-600 font-medium mt-1">Auzo Service</p>
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
                                        <p className="text-xs text-gray-500 leading-none mb-0.5">Back to</p>
                                        <p className="text-sm text-gray-900 font-medium leading-tight">Current location</p>
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
                        {isPickupLater ? (
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
                                    <p className="text-sm text-gray-900 font-medium leading-tight">Round trip service</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold text-gray-900">${deliveryFee.toFixed(2)}</p>
                            </div>
                        </div>
                        
                        {/* Service Cost (if applicable) */}
                        {isRoundTrip && selectedServiceOption && calculateServiceCost() > 0 && (
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
                                                ${calculateServiceCost().toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Total */}
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
                            </>
                        )}
                        
                        {/* Fuel Note */}
                        {isRoundTrip && selectedServiceOption && selectedServiceOption.price?.includes('gallon') && (
                            <div className="border-t pt-3">
                                <p className="text-xs text-gray-500 italic">
                                    * Fuel cost ({selectedServiceOption.price}) will be calculated based on gallons filled
                                </p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Payment Method Section */}
                <Card className="p-3 bg-white">
                    <div className="flex items-start gap-3 mb-3">
                        <CreditCard className="w-6 h-6 text-gray-600" />
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 leading-none mb-0.5">Payment Method</p>
                            <p className="text-sm text-gray-900 font-medium leading-tight">
                                {isLoadingCards ? 'Loading payment methods...' : 'Select a credit card'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="ml-9">
                        <CreditCardSelector
                            cards={creditCards}
                            selectedCardId={selectedCardId}
                            onCardSelect={handleCardSelect}
                            onAddCard={handleAddCard}
                            isLoading={isAddingCard}
                            required={true}
                        />
                    </div>
                </Card>

                {/* Order Auzo Driver Button */}
                <div className="pt-4">
                    <Button 
                        className="w-full h-12 text-base font-semibold"
                        onClick={handleRequestDriver}
                        disabled={isLoadingCards || (!selectedCardId && creditCards.length === 0)}
                    >
                        {isLoadingCards ? 'Loading...' : 'Order Auzo Driver'}
                    </Button>
                    {creditCards.length === 0 && !isLoadingCards && (
                        <p className="text-xs text-red-600 mt-2 text-center">
                            Please add a credit card to continue
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