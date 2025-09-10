"use client";

import { useEffect, useState } from 'react';
import { Home, Clock, MapPin, Car, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { Vehicle } from '@/components/car-card';
import { transactionStorage, Transaction } from '@/lib/transaction-storage';
import { createOrder } from '@/lib/services/order-service';
import { Order, OrderStatus } from '@/lib/types/order';

export default function DriverRequestedPage() {
    const router = useRouter();
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [destination, setDestination] = useState<string>('');
    const [pickupTime, setPickupTime] = useState<string>('');
    const [message, setMessage] = useState<string>('Finding your driver');
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [isRoundTrip, setIsRoundTrip] = useState<boolean>(false);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const createFirestoreOrder = async () => {
            // Prevent multiple executions
            if (isInitialized) return;
            setIsInitialized(true);
            
            // Get booking details from sessionStorage
            const vehicleData = sessionStorage.getItem('selectedVehicle');
            const storedDestination = sessionStorage.getItem('selectedDestination');
            const storedDate = sessionStorage.getItem('selectedDate');
            const storedTime = sessionStorage.getItem('selectedTime');
            const roundTripFlag = sessionStorage.getItem('isRoundTrip');

            let vehicle: Vehicle | null = null;
            let dest = '';
            let pickup = '';
            let isScheduled = false;

            // Set round trip flag
            if (roundTripFlag === 'true') {
                setIsRoundTrip(true);
            }

            if (vehicleData) {
                vehicle = JSON.parse(vehicleData);
                setSelectedVehicle(vehicle);
            }

            if (storedDestination) {
                dest = storedDestination;
                setDestination(dest);
            }

            if (storedDate && storedTime) {
                pickup = `${storedDate} at ${storedTime}`;
                isScheduled = true;
                setPickupTime(pickup);
            } else {
                pickup = 'ASAP';
                setPickupTime(pickup);
            }

            // Save transaction if we have the required data
            if (vehicle && dest) {
                const savedTransaction = transactionStorage.saveTransaction({
                    vehicle,
                    destination: dest,
                    pickupTime: pickup,
                    isScheduled,
                    scheduledDate: storedDate || undefined,
                    scheduledTime: storedTime || undefined,
                    isRoundTrip: roundTripFlag === 'true'
                });
                setTransaction(savedTransaction);
                
                console.log('Transaction saved:', savedTransaction);

                // Create order in Firestore
                if (!isCreatingOrder) {
                    setIsCreatingOrder(true);
                    try {
                        const vehicleInfo: any = {
                            make: vehicle.make,
                            model: vehicle.model,
                            year: vehicle.year,
                        };
                        
                        // Only add licensePlate if it exists
                        if (vehicle.licensePlate) {
                            vehicleInfo.licensePlate = vehicle.licensePlate;
                        }

                        const orderData: Partial<Order> = {
                            pickupLocation: 'Current Location', // You can get actual location if needed
                            dropoffLocation: dest,
                            vehicleInfo,
                            notes: isScheduled ? `Scheduled for ${storedDate} at ${storedTime}` : 'ASAP Pickup',
                        };

                        const newOrderId = await createOrder(orderData);
                        setOrderId(newOrderId);
                        console.log('Order created in Firestore:', newOrderId);

                        // Redirect to the specific order page after a short delay
                        setTimeout(() => {
                            router.push(`/order/${newOrderId}`);
                        }, 3000);
                    } catch (error) {
                        console.error('Error creating order:', error);
                    }
                }
            }

            // Timer for message change
            const timer = setTimeout(() => {
                setMessage('Your driver will arrive in 12 minutes');
            }, 3000);

            return () => clearTimeout(timer);
        };

        createFirestoreOrder();
    }, []); // Empty dependency array to run only once

    const handleBackToHome = () => {
        // Clear session storage
        sessionStorage.removeItem('selectedVehicle');
        sessionStorage.removeItem('selectedDestination');
        sessionStorage.removeItem('selectedDate');
        sessionStorage.removeItem('selectedTime');
        sessionStorage.removeItem('isRoundTrip');
        
        router.push('/home');
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Map Placeholder */}
            <div className="h-64 bg-gray-200 flex items-center justify-center relative">
                <div className="text-center text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">Map loading...</p>
                </div>
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                    <Badge 
                        variant="secondary"
                        className="flex items-center gap-1 px-3 py-2 text-sm"
                    >
                        <Navigation className="w-4 h-4" />
                        Finding driver
                    </Badge>
                </div>
            </div>

            {/* Message Section */}
            <div className="bg-white px-4 py-6">
                <div className="text-center">
                    <h1 className="text-xl font-semibold text-gray-900">{message}</h1>
                    {isRoundTrip && (
                        <p className="text-sm text-blue-600 font-medium mt-2">Round Trip Auzo Service</p>
                    )}
                </div>
            </div>

            <div className="flex-1 p-4 space-y-4">
                {/* Order Number */}
                <Card className="p-4 bg-white">
                    <div className="text-center">
                        <p className="text-sm text-gray-500 mb-1">Order Number</p>
                        <p className="text-xl font-bold text-gray-900">
                            {transaction ? `#${transaction.orderNumber}` : '#AZ-00000'}
                        </p>
                    </div>
                </Card>

                {/* Booking Details Summary */}
                <Card className="p-4 bg-white">
                    <h2 className="text-sm font-semibold text-gray-900 mb-3">Booking Details</h2>
                    
                    <div className="space-y-2">
                        <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-xs text-gray-500">
                                    {isRoundTrip ? 'Service Location (Round Trip)' : 'Destination'}
                                </p>
                                <p className="text-sm text-gray-900">{destination || 'AutoZone Pro Service Center'}</p>
                                {isRoundTrip && (
                                    <p className="text-xs text-blue-600 font-medium mt-1">Return to pickup location after service</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <Car className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-xs text-gray-500">Vehicle</p>
                                {selectedVehicle ? (
                                    <p className="text-sm text-gray-900">
                                        {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-900">No vehicle selected</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-xs text-gray-500">Pickup Time</p>
                                <p className="text-sm text-gray-900">{pickupTime}</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* What's Next */}
                <Card className="p-4 bg-gray-50 border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">What happens next?</h3>
                    <ul className="space-y-1 text-sm text-gray-700">
                        <li>• We'll notify you when a driver is assigned</li>
                        <li>• You'll receive driver details and ETA</li>
                        <li>• Track your driver in real-time</li>
                    </ul>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-2 pt-4">
                    <Button 
                        className="w-full h-12 text-base font-semibold"
                        variant="outline"
                        onClick={() => router.push('/home')}
                    >
                        View Order Status
                    </Button>
                    
                    <Button 
                        className="w-full h-12 text-base font-semibold"
                        onClick={handleBackToHome}
                    >
                        <Home className="w-4 h-4 mr-2" />
                        Back to Home
                    </Button>
                </div>
            </div>
        </div>
    );
}