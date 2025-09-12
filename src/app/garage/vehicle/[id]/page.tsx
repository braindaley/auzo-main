"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Car, Trash2, Settings, FileText, Calendar, Image, Gauge, Edit, Save, X } from 'lucide-react';
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
    const [isEditing, setIsEditing] = useState(false);
    const [editableVehicle, setEditableVehicle] = useState<Vehicle | null>(null);
    const [isLoading, setIsLoading] = useState(false);

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

    const handleEdit = () => {
        setEditableVehicle({ ...vehicle! });
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setEditableVehicle(null);
        setIsEditing(false);
    };

    const handleSave = async () => {
        if (!editableVehicle) return;
        
        setIsLoading(true);
        try {
            vehicleStorage.updateVehicle(vehicleId, editableVehicle);
            setVehicle(editableVehicle);
            setIsEditing(false);
            setEditableVehicle(null);
        } catch (error) {
            console.error('Failed to update vehicle:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: keyof Vehicle, value: string | number) => {
        if (!editableVehicle) return;
        setEditableVehicle(prev => ({ ...prev!, [field]: value }));
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
                    {!isEditing ? (
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleEdit}
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={handleCancelEdit}
                                disabled={isLoading}
                            >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                            <Button 
                                size="sm" 
                                onClick={handleSave}
                                disabled={isLoading}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {isLoading ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    )}
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
                            {!isEditing ? (
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
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="year">Year</Label>
                                        <Input
                                            id="year"
                                            type="text"
                                            value={editableVehicle?.year || ''}
                                            onChange={(e) => handleInputChange('year', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="make">Make</Label>
                                        <Input
                                            id="make"
                                            type="text"
                                            value={editableVehicle?.make || ''}
                                            onChange={(e) => handleInputChange('make', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="model">Model</Label>
                                        <Input
                                            id="model"
                                            type="text"
                                            value={editableVehicle?.model || ''}
                                            onChange={(e) => handleInputChange('model', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="color">Color</Label>
                                        <Input
                                            id="color"
                                            type="text"
                                            value={editableVehicle?.color || ''}
                                            onChange={(e) => handleInputChange('color', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Additional Vehicle Details */}
                            <div className="space-y-4">
                                {/* VIN */}
                                {!isEditing ? (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <FileText className="w-5 h-5 text-gray-600" />
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">VIN</p>
                                            <p className="font-medium text-gray-900">
                                                {vehicle.vin || 'Not provided'}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Label htmlFor="vin" className="flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            VIN
                                        </Label>
                                        <Input
                                            id="vin"
                                            type="text"
                                            value={editableVehicle?.vin || ''}
                                            onChange={(e) => handleInputChange('vin', e.target.value)}
                                            placeholder="Enter VIN"
                                        />
                                    </div>
                                )}

                                {/* License Plate */}
                                {!isEditing ? (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Car className="w-5 h-5 text-gray-600" />
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">License Plate</p>
                                            <p className="font-medium text-gray-900">
                                                {vehicle.licensePlate || 'Not provided'}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Label htmlFor="licensePlate" className="flex items-center gap-2">
                                            <Car className="w-4 h-4" />
                                            License Plate
                                        </Label>
                                        <Input
                                            id="licensePlate"
                                            type="text"
                                            value={editableVehicle?.licensePlate || ''}
                                            onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                                            placeholder="Enter license plate"
                                        />
                                    </div>
                                )}

                                {/* Purchase Date */}
                                {!isEditing ? (
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
                                ) : (
                                    <div className="space-y-2">
                                        <Label htmlFor="purchaseDate" className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Purchase Date
                                        </Label>
                                        <Input
                                            id="purchaseDate"
                                            type="date"
                                            value={editableVehicle?.purchaseDate ? editableVehicle.purchaseDate.split('T')[0] : ''}
                                            onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                                        />
                                    </div>
                                )}

                                {/* Mileage */}
                                {!isEditing ? (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Gauge className="w-5 h-5 text-gray-600" />
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Mileage</p>
                                            <p className="font-medium text-gray-900">
                                                {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} miles` : 'Not provided'}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Label htmlFor="mileage" className="flex items-center gap-2">
                                            <Gauge className="w-4 h-4" />
                                            Mileage
                                        </Label>
                                        <Input
                                            id="mileage"
                                            type="number"
                                            value={editableVehicle?.mileage || ''}
                                            onChange={(e) => handleInputChange('mileage', parseInt(e.target.value) || 0)}
                                            placeholder="Enter mileage"
                                        />
                                    </div>
                                )}

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