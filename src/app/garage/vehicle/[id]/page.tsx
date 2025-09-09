"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Car, Trash2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { vehicleStorage } from '@/lib/vehicle-storage';
import { useEffect, useState } from 'react';
import { Vehicle } from '@/components/car-card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const VehicleDetailPage = () => {
    const router = useRouter();
    const params = useParams();
    const vehicleId = params.id as string;
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);

    useEffect(() => {
        const foundVehicle = vehicleStorage.getVehicle(vehicleId);
        if (foundVehicle) {
            setVehicle(foundVehicle);
        } else {
            router.push('/garage');
        }
    }, [vehicleId, router]);

    const handleBack = () => {
        router.push('/garage');
    };

    const handleDelete = () => {
        vehicleStorage.deleteVehicle(vehicleId);
        router.push('/garage');
    };

    if (!vehicle) {
        return (
            <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center mb-6">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={handleBack}
                            className="mr-3"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <h1 className="text-2xl font-semibold">Vehicle Not Found</h1>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center mb-6">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleBack}
                        className="mr-3"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h1 className="text-2xl font-semibold">Vehicle Details</h1>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-4">
                                <Car className="w-12 h-12 text-primary" />
                                <div>
                                    <CardTitle className="text-2xl">
                                        {vehicle.year} {vehicle.make} {vehicle.model}
                                    </CardTitle>
                                    <p className="text-muted-foreground">
                                        {vehicle.color} • {vehicle.make} • {vehicle.year}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-4 gap-4 text-center">
                                <div>
                                    <p className="text-sm text-muted-foreground">Year</p>
                                    <p className="font-semibold">{vehicle.year}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Make</p>
                                    <p className="font-semibold">{vehicle.make}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Model</p>
                                    <p className="font-semibold">{vehicle.model}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Color</p>
                                    <p className="font-semibold">{vehicle.color}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" className="w-full">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Vehicle
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to delete your {vehicle.color} {vehicle.year} {vehicle.make} {vehicle.model}? 
                                            This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetailPage;