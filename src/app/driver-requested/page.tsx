"use client";

import { useEffect, useState } from 'react';
import { Home, Clock, MapPin, Car, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import { Vehicle } from '@/components/car-card';
import { transactionStorage, Transaction } from '@/lib/transaction-storage';
import { createOrder, updateOrderStatus } from '@/lib/services/order-service';
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
    const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false);

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
                            isRoundTrip: roundTripFlag === 'true',
                        };

                        // Only add scheduled fields if they have values
                        if (isScheduled && storedDate) {
                            orderData.scheduledDate = storedDate;
                        }
                        if (isScheduled && storedTime) {
                            orderData.scheduledTime = storedTime;
                        }

                        const newOrderId = await createOrder(orderData);
                        setOrderId(newOrderId);
                        console.log('Order created in Firestore:', newOrderId);
                        
                        // Link the transaction to the order
                        transactionStorage.updateTransactionOrderId(savedTransaction.id, newOrderId);

                        // Don't automatically redirect - stay on finding driver screen
                    } catch (error) {
                        console.error('Error creating order:', error);
                    }
                }
            }
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
        sessionStorage.removeItem('selectedCarWash');
        sessionStorage.removeItem('selectedFuelFill');
        
        router.push('/home');
    };

    const handleStatusClick = async () => {
        if (!orderId) return;
        
        try {
            // Update status to DRIVER_ON_WAY (next status after FINDING_DRIVER)
            await updateOrderStatus(orderId, OrderStatus.DRIVER_ON_WAY);
            // Navigate to the order page
            router.push(`/order/${orderId}`);
        } catch (error) {
            console.error('Error updating status:', error);
            // Still navigate even if update fails
            router.push(`/order/${orderId}`);
        }
    };

    const handleCancelService = async () => {
        // Close dialog and navigate to home
        setShowCancelDialog(false);
        
        // If we have an order ID, we could update it to cancelled status
        if (orderId) {
            try {
                await updateOrderStatus(orderId, OrderStatus.CANCELLED);
            } catch (error) {
                console.error('Error cancelling order:', error);
            }
        }
        
        // Clear session storage and navigate home
        sessionStorage.removeItem('selectedVehicle');
        sessionStorage.removeItem('selectedDestination');
        sessionStorage.removeItem('selectedDate');
        sessionStorage.removeItem('selectedTime');
        sessionStorage.removeItem('isRoundTrip');
        sessionStorage.removeItem('selectedCarWash');
        sessionStorage.removeItem('selectedFuelFill');
        
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
                
                {/* Status Badge - Clickable to advance to next status */}
                <div className="absolute top-4 right-4">
                    <Badge 
                        variant="secondary"
                        className={`flex items-center gap-1 px-3 py-2 text-sm transition-all ${
                            orderId ? 'cursor-pointer hover:scale-105 hover:shadow-lg active:scale-95' : ''
                        }`}
                        onClick={handleStatusClick}
                        title={orderId ? 'Click to advance to next status' : 'Creating order...'}
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
                {/* What's Next */}
                <Card className="p-4 bg-gray-50 border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">What happens next?</h3>
                    <ul className="space-y-1 text-sm text-gray-700">
                        <li>• We'll notify you when a driver is assigned</li>
                        <li>• You'll receive driver details and ETA</li>
                        <li>• Track your driver in real-time</li>
                    </ul>
                </Card>

                {/* Booking Details Summary */}
                <Card className="p-4 bg-white">
                    <h2 className="text-sm font-semibold text-gray-900 mb-3">Booking Details</h2>
                    
                    <div className="space-y-2">
                        <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 mb-1">
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
                                <p className="text-xs text-gray-500 mb-1">Vehicle</p>
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
                                <p className="text-xs text-gray-500 mb-1">Pickup Time</p>
                                <p className="text-sm text-gray-900">{pickupTime}</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Order Number */}
                <Card className="p-4 bg-white">
                    <div className="text-center">
                        <p className="text-sm text-gray-500 mb-1">Order Number</p>
                        <p className="text-xl font-bold text-gray-900">
                            {transaction ? `#${transaction.orderNumber}` : '#AZ-00000'}
                        </p>
                    </div>
                </Card>

                {/* Cancel Service Button */}
                <div className="pt-4">
                    <Button 
                        variant="destructive"
                        className="w-full h-12 text-base font-semibold"
                        onClick={() => setShowCancelDialog(true)}
                    >
                        Cancel Service
                    </Button>
                </div>

            </div>

            {/* Cancel Service Dialog */}
            <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <AlertDialogContent className="max-w-[356px] max-h-[calc(100vh-2rem)] w-full mx-4">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Service</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to cancel this service? This action cannot be undone and you'll need to create a new order if you change your mind.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Keep Service</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleCancelService}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            Cancel Service
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}