"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Car, Plus, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { CarCard, Vehicle } from '@/components/car-card';
import { vehicleStorage } from '@/lib/vehicle-storage';
import { transactionStorage, Transaction } from '@/lib/transaction-storage';
import { useEffect, useState } from 'react';

const GaragePage = () => {
    const router = useRouter();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        setVehicles(vehicleStorage.getVehicles());
        setTransactions(transactionStorage.getTransactions());
    }, []);

    const handleAddVehicle = () => {
        router.push('/garage/add-vehicle/year');
    };

    const handleCarClick = (vehicle: Vehicle) => {
        router.push(`/garage/vehicle/${vehicle.id}`);
    };

    const handleTransactionClick = (transaction: Transaction) => {
        router.push(`/activity/${transaction.id}`);
    };

    const getTransactionsForVehicle = (vehicleId: string): Transaction[] => {
        return transactions.filter(transaction => 
            transaction.vehicle.id === vehicleId
        ).slice(0, 3); // Show only the most recent 3 transactions
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit' 
        });
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
                        vehicles.map((vehicle) => {
                            const vehicleTransactions = getTransactionsForVehicle(vehicle.id);
                            
                            return (
                                <div key={vehicle.id} className="space-y-3">
                                    <CarCard 
                                        vehicle={vehicle} 
                                        onClick={handleCarClick}
                                    />
                                    
                                    {/* Transaction Cards for this vehicle */}
                                    {vehicleTransactions.length > 0 && (
                                        <div className="ml-4 space-y-2">
                                            <p className="text-sm font-medium text-gray-600">Recent Activity</p>
                                            {vehicleTransactions.map((transaction) => (
                                                <Card 
                                                    key={transaction.id} 
                                                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                                                    onClick={() => handleTransactionClick(transaction)}
                                                >
                                                    <CardContent className="p-3">
                                                        <div className="space-y-1">
                                                            {/* Row 1: Location */}
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="w-3 h-3 text-gray-500" />
                                                                <span className="text-sm font-medium text-gray-900">
                                                                    {transaction.destination}
                                                                </span>
                                                            </div>
                                                            
                                                            {/* Row 2: Vehicle (skip since it's the same as the parent) */}
                                                            
                                                            {/* Row 3: Date/Time */}
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="w-3 h-3 text-gray-500" />
                                                                <span className="text-xs text-gray-600">
                                                                    {formatDate(transaction.timestamp)} at {formatTime(transaction.timestamp)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default GaragePage;