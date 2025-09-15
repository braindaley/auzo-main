"use client";

import { useEffect, useState } from 'react';
import { Home, Clock, MapPin, Car, CalendarCheck, Bell, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { Vehicle } from '@/components/car-card';
import { transactionStorage, Transaction } from '@/lib/transaction-storage';
import { createOrder } from '@/lib/services/order-service';
import { Order, OrderStatus } from '@/lib/types/order';

export default function BookingScheduledPage() {
    const router = useRouter();
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [destination, setDestination] = useState<string>('');
    const [scheduledDate, setScheduledDate] = useState<string>('');
    const [scheduledTime, setScheduledTime] = useState<string>('');
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [isRoundTrip, setIsRoundTrip] = useState<boolean>(false);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const createScheduledOrder = async () => {
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

            if (storedDate) {
                setScheduledDate(storedDate);
            }

            if (storedTime) {
                setScheduledTime(storedTime);
            }

            // Save transaction if we have the required data
            if (vehicle && dest && storedDate && storedTime) {
                const savedTransaction = transactionStorage.saveTransaction({
                    vehicle,
                    destination: dest,
                    pickupTime: `${storedDate} at ${storedTime}`,
                    isScheduled: true,
                    scheduledDate: storedDate,
                    scheduledTime: storedTime,
                    isRoundTrip: roundTripFlag === 'true'
                });
                setTransaction(savedTransaction);
                
                console.log('Scheduled transaction saved:', savedTransaction);

                // Create order in Firestore with scheduled status
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
                            pickupLocation: 'Current Location',
                            dropoffLocation: dest,
                            vehicleInfo,
                            notes: `Scheduled for ${storedDate} at ${storedTime}`,
                            status: OrderStatus.SCHEDULED, // Set status as scheduled
                            scheduledDate: storedDate,
                            scheduledTime: storedTime,
                            isRoundTrip: roundTripFlag === 'true',
                        };

                        const newOrderId = await createOrder(orderData);
                        setOrderId(newOrderId);
                        console.log('Scheduled order created in Firestore:', newOrderId);
                    } catch (error) {
                        console.error('Error creating scheduled order:', error);
                    }
                }
            }
        };

        createScheduledOrder();
    }, []); // Empty dependency array to run only once

    const handleBackToHome = () => {
        // Clear session storage
        sessionStorage.removeItem('selectedVehicle');
        sessionStorage.removeItem('selectedDestination');
        sessionStorage.removeItem('selectedDate');
        sessionStorage.removeItem('selectedTime');
        sessionStorage.removeItem('isRoundTrip');
        sessionStorage.removeItem('selectedServiceCategory');
        sessionStorage.removeItem('selectedServiceOption');
        sessionStorage.removeItem('selectedCardId');
        sessionStorage.removeItem('driverNotes');
        
        router.push('/home');
    };

    const handleViewBookings = () => {
        router.push('/activity');
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Success Header */}
            <div className="bg-green-50 border-b border-green-200">
                <div className="px-4 py-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Scheduled!</h1>
                        <p className="text-sm text-gray-600">Your ride has been successfully scheduled</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-4 space-y-4">
                {/* Scheduled Time Card */}
                <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <CalendarCheck className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-base font-semibold text-gray-900 mb-1">Scheduled Pickup</h2>
                            <p className="text-lg font-bold text-blue-600">
                                {scheduledDate} at {scheduledTime}
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                                We'll find a driver 30 minutes before your scheduled time
                            </p>
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
                        <Badge variant="secondary" className="mt-2">
                            Status: Scheduled
                        </Badge>
                    </div>
                </Card>

                {/* Booking Details Summary */}
                <Card className="p-4 bg-white">
                    <h2 className="text-sm font-semibold text-gray-900 mb-3">Booking Details</h2>
                    
                    <div className="space-y-3">
                        <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-xs text-gray-500">
                                    {isRoundTrip ? 'Service Location (Round Trip)' : 'Destination'}
                                </p>
                                <p className="text-sm text-gray-900">{destination || 'Not specified'}</p>
                                {isRoundTrip && (
                                    <p className="text-xs text-blue-600 font-medium mt-1">
                                        Return to pickup location after service
                                    </p>
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
                    </div>
                </Card>

                {/* Reminder Settings */}
                <Card className="p-4 bg-yellow-50 border-yellow-200">
                    <div className="flex items-start gap-3">
                        <Bell className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">Reminder Set</h3>
                            <p className="text-sm text-gray-700">
                                You'll receive a notification 1 hour before your scheduled pickup
                            </p>
                        </div>
                    </div>
                </Card>

                {/* What's Next */}
                <Card className="p-4 bg-gray-50 border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">What happens next?</h3>
                    <ul className="space-y-1 text-sm text-gray-700">
                        <li>• We'll send you a reminder 1 hour before pickup</li>
                        <li>• A driver will be assigned 30 minutes before</li>
                        <li>• You can modify or cancel up to 1 hour before</li>
                        <li>• Track your booking status in the Activity tab</li>
                    </ul>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-2 pt-4">
                    <Button 
                        className="w-full h-12 text-base font-semibold"
                        variant="outline"
                        onClick={handleViewBookings}
                    >
                        View My Bookings
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