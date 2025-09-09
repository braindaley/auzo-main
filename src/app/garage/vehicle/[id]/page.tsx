"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Car, Trash2, Settings, FileText, Calendar, Image } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { vehicleStorage } from '@/lib/vehicle-storage';
import { useEffect, useState, use } from 'react';
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

interface VehicleDetailPageProps {
    params: Promise<{ id: string }>;
}

const VehicleDetailPage = ({ params }: VehicleDetailPageProps) => {
    const router = useRouter();
    const { id: vehicleId } = use(params);
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
                    <Card className="border-none shadow-none">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-4">
                                <Car className="w-12 h-12 text-primary" />
                                <div className="flex-1">
                                    <CardTitle className="text-2xl">
                                        {vehicle.year} {vehicle.make} {vehicle.model}
                                    </CardTitle>
                                    <p className="text-muted-foreground">
                                        {vehicle.color} • {vehicle.make} • {vehicle.year}
                                    </p>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <Settings className="w-5 h-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete Vehicle
                                                </DropdownMenuItem>
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
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Basic Vehicle Info */}
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

                            {/* Additional Vehicle Details */}
                            <div className="space-y-4">
                                {/* VIN */}
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <FileText className="w-5 h-5 text-gray-600" />
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">VIN</p>
                                        <p className="font-medium text-gray-900">
                                            {vehicle.vin || 'Not provided'}
                                        </p>
                                    </div>
                                </div>

                                {/* License Plate */}
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Car className="w-5 h-5 text-gray-600" />
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">License Plate</p>
                                        <p className="font-medium text-gray-900">
                                            {vehicle.licensePlate || 'Not provided'}
                                        </p>
                                    </div>
                                </div>

                                {/* Purchase Date */}
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Calendar className="w-5 h-5 text-gray-600" />
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">Purchase Date</p>
                                        <p className="font-medium text-gray-900">
                                            {vehicle.purchaseDate ? new Date(vehicle.purchaseDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            }) : 'Not provided'}
                                        </p>
                                    </div>
                                </div>

                                {/* Photo Gallery */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Image className="w-5 h-5 text-gray-600" />
                                        <p className="text-sm text-gray-500 font-medium">Photo Gallery</p>
                                    </div>
                                    {vehicle.photos && vehicle.photos.length > 0 ? (
                                        <div className="grid grid-cols-3 gap-2">
                                            {vehicle.photos.map((photo, index) => (
                                                <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                                    <img 
                                                        src={photo} 
                                                        alt={`Vehicle photo ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-6 bg-gray-50 rounded-lg text-center">
                                            <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-500">No photos added</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetailPage;