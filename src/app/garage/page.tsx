"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Car, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { CarCard, Vehicle } from '@/components/car-card';
import { vehicleStorage } from '@/lib/vehicle-storage';
import { useEffect, useState } from 'react';

const GaragePage = () => {
    const router = useRouter();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    useEffect(() => {
        setVehicles(vehicleStorage.getVehicles());
    }, []);

    const handleAddVehicle = () => {
        router.push('/garage/add-vehicle/year');
    };

    const handleCarClick = (vehicle: Vehicle) => {
        router.push(`/garage/vehicle/${vehicle.id}`);
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div className="mt-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-left text-2xl font-semibold">My Garage</h1>
                    {vehicles.length > 0 && (
                        <Button size="sm" onClick={handleAddVehicle}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add
                        </Button>
                    )}
                </div>
                
                <div className="space-y-4">
                    {vehicles.length === 0 ? (
                        <Card className="bg-card hover:bg-muted/80 transition-colors border-dashed border-2">
                            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                                <Car className="w-12 h-12 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground mb-4">No vehicles added yet</p>
                                <Button className="flex items-center gap-2" onClick={handleAddVehicle}>
                                    <Plus className="w-4 h-4" />
                                    Add Your First Vehicle
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        vehicles.map((vehicle) => (
                            <CarCard 
                                key={vehicle.id} 
                                vehicle={vehicle} 
                                onClick={handleCarClick}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default GaragePage;