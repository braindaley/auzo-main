"use client";

import { useState, useEffect } from 'react';
import { ArrowLeft, Car, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Vehicle } from '@/components/car-card';
import { vehicleStorage } from '@/lib/vehicle-storage';

export default function SelectVehiclePage() {
    const router = useRouter();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [previousPage, setPreviousPage] = useState('/deliver');

    useEffect(() => {
        setVehicles(vehicleStorage.getVehicles());
        
        // Determine where we came from based on service type
        const serviceType = sessionStorage.getItem('selectedServiceType');
        if (serviceType) {
            setPreviousPage(`/service?service=${encodeURIComponent(serviceType)}`);
        } else {
            setPreviousPage('/deliver');
        }
    }, []);

    const handleAddVehicle = () => {
        // Navigate to add vehicle flow with a return URL
        router.push('/garage/add-vehicle/year?returnTo=/select-vehicle');
    };

    const handleVehicleSelect = (vehicle: Vehicle) => {
        // Store selected vehicle
        sessionStorage.setItem('selectedVehicle', JSON.stringify(vehicle));
        
        // Check if this is an Auzo service flow (round trip)
        const isRoundTrip = sessionStorage.getItem('isRoundTrip') === 'true';
        
        if (isRoundTrip) {
            // Navigate to service selection for Auzo service
            const serviceType = sessionStorage.getItem('selectedServiceType');
            if (serviceType) {
                router.push(`/select-service-options?service=${encodeURIComponent(serviceType)}`);
            } else {
                router.push('/select-service-options');
            }
        } else {
            // Navigate directly to confirm-booking for regular transport
            router.push('/confirm-booking');
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <div className="border-b bg-white px-4 py-4">
                <div className="flex items-center gap-4">
                    <Link href={previousPage} className="p-1">
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-lg font-semibold text-gray-900">Select Vehicle</h1>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-4 space-y-4">
                {vehicles.length === 0 ? (
                    // No vehicles - only show add new option
                    <Card className="bg-card border-dashed border-2">
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                            <Car className="w-12 h-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground mb-4">No vehicles in your garage</p>
                            <Button 
                                className="flex items-center gap-2" 
                                onClick={handleAddVehicle}
                            >
                                <Plus className="w-4 h-4" />
                                Add Your Vehicle
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Show existing vehicles */}
                        <div className="space-y-3">
                            <h2 className="text-sm font-medium text-gray-700">Select from your garage</h2>
                            {vehicles.map((vehicle) => (
                                <Card 
                                    key={vehicle.id}
                                    className="cursor-pointer transition-all bg-card hover:bg-muted/80"
                                    onClick={() => handleVehicleSelect(vehicle)}
                                >
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <div className="flex-shrink-0">
                                            <Car className="w-8 h-8 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold">
                                                {vehicle.year} {vehicle.make} {vehicle.model}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {vehicle.color}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Add new vehicle option */}
                        <div className="pt-2">
                            <Button 
                                variant="outline" 
                                className="w-full flex items-center justify-center gap-2"
                                onClick={handleAddVehicle}
                            >
                                <Plus className="w-4 h-4" />
                                Add Different Vehicle
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}