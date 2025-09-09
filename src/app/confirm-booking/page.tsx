"use client";

import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Car, Calendar, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Vehicle } from '@/components/car-card';

export default function ConfirmBookingPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [destination, setDestination] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const isPickupLater = searchParams.get('pickup') === 'later';

    useEffect(() => {
        // Get selected vehicle from sessionStorage
        const vehicleData = sessionStorage.getItem('selectedVehicle');
        if (vehicleData) {
            setSelectedVehicle(JSON.parse(vehicleData));
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
    }, []);

    const handleRequestDriver = () => {
        // Navigate to driver matching or confirmation page
        router.push('/driver-requested');
    };

    const formatDateTime = () => {
        if (isPickupLater && selectedDate && selectedTime) {
            return `${selectedDate} at ${selectedTime}`;
        }
        return 'ASAP';
    };

    return (
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

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {/* From and To Section */}
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
                            </div>
                        </div>
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
                    <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                            <DollarSign className="w-6 h-6 text-gray-600" />
                            <div>
                                <p className="text-xs text-gray-500 leading-none mb-0.5">Service Cost</p>
                                <p className="text-sm text-gray-900 font-medium leading-tight">Delivery</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold text-gray-900">$14.90</p>
                        </div>
                    </div>
                </Card>

                {/* Order Auzo Driver Button */}
                <div className="pt-4">
                    <Button 
                        className="w-full h-12 text-base font-semibold"
                        onClick={handleRequestDriver}
                    >
                        Order Auzo Driver
                    </Button>
                </div>
            </div>
        </div>
    );
}