"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Car, Trash2, Settings, FileText, Calendar, Image, Gauge, Camera } from 'lucide-react';
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
    const [isSaving, setIsSaving] = useState(false);

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

    const handleInputChange = async (field: keyof Vehicle, value: string | number) => {
        if (!vehicle) return;
        
        const updatedVehicle = { ...vehicle, [field]: value };
        setVehicle(updatedVehicle);
        
        // Auto-save with debouncing effect
        setIsSaving(true);
        try {
            vehicleStorage.updateVehicle(vehicleId, updatedVehicle);
            // Small delay to show saving state
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            console.error('Failed to update vehicle:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                const updatedVehicle = { 
                    ...vehicle!, 
                    photos: [result, ...(vehicle?.photos?.slice(1) || [])]
                };
                vehicleStorage.updateVehicle(vehicleId, updatedVehicle);
                setVehicle(updatedVehicle);
            };
            reader.readAsDataURL(file);
        }
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
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
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
                    {isSaving && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            Saving...
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <Card className="border-none shadow-none">
                        <CardHeader className="pb-4">
                            {/* Vehicle Profile Picture */}
                            <div className="flex flex-col items-center space-y-4 mb-6">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                        {vehicle.photos && vehicle.photos[0] ? (
                                            <img 
                                                src={vehicle.photos[0]} 
                                                alt="Vehicle Profile" 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Car className="w-12 h-12 text-gray-400" />
                                        )}
                                    </div>
                                    <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
                                        <Camera className="w-4 h-4" />
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={handleProfilePictureUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <p className="text-sm text-muted-foreground text-center">
                                    Click the camera icon to upload a vehicle photo
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <CardTitle className="text-2xl text-center">
                                        {vehicle.year} {vehicle.make} {vehicle.model}
                                    </CardTitle>
                                    <p className="text-muted-foreground text-center">
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
                            {/* Vehicle Details */}
                            <div className="space-y-4">
                                {/* VIN */}
                                <div className="space-y-2">
                                    <Label htmlFor="vin" className="flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        VIN
                                    </Label>
                                    <Input
                                        id="vin"
                                        type="text"
                                        value={vehicle?.vin || ''}
                                        onChange={(e) => handleInputChange('vin', e.target.value)}
                                        placeholder="Enter VIN"
                                        className="bg-white"
                                    />
                                </div>

                                {/* License Plate */}
                                <div className="space-y-2">
                                    <Label htmlFor="licensePlate" className="flex items-center gap-2">
                                        <Car className="w-4 h-4" />
                                        License Plate
                                    </Label>
                                    <Input
                                        id="licensePlate"
                                        type="text"
                                        value={vehicle?.licensePlate || ''}
                                        onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                                        placeholder="Enter license plate"
                                        className="bg-white"
                                    />
                                </div>

                                {/* Purchase Date */}
                                <div className="space-y-2">
                                    <Label htmlFor="purchaseDate" className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Purchase Date
                                    </Label>
                                    <Input
                                        id="purchaseDate"
                                        type="date"
                                        value={vehicle?.purchaseDate ? vehicle.purchaseDate.split('T')[0] : ''}
                                        onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                                        className="bg-white"
                                    />
                                </div>

                                {/* Mileage */}
                                <div className="space-y-2">
                                    <Label htmlFor="mileage" className="flex items-center gap-2">
                                        <Gauge className="w-4 h-4" />
                                        Mileage
                                    </Label>
                                    <Input
                                        id="mileage"
                                        type="number"
                                        value={vehicle?.mileage || ''}
                                        onChange={(e) => handleInputChange('mileage', parseInt(e.target.value) || 0)}
                                        placeholder="Enter mileage"
                                        className="bg-white"
                                    />
                                </div>

                                {/* Additional Photo Gallery (excluding profile picture) */}
                                {vehicle.photos && vehicle.photos.length > 1 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Image className="w-5 h-5 text-gray-600" />
                                            <p className="text-sm text-gray-500 font-medium">Additional Photos</p>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            {vehicle.photos.slice(1).map((photo, index) => (
                                                <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                                    <img 
                                                        src={photo} 
                                                        alt={`Vehicle photo ${index + 2}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetailPage;