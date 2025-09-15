"use client";

import { useState } from 'react';
import { X, Car, Fuel, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

// Car wash options
const carWashOptions = [
    { id: 'basic', name: 'Basic Wash', price: '$15', description: 'Exterior wash and dry' },
    { id: 'premium', name: 'Premium Wash', price: '$25', description: 'Wash, wax, and interior vacuum' },
    { id: 'deluxe', name: 'Deluxe Wash', price: '$35', description: 'Full detail service' }
];

// Fuel fill options
const fuelFillOptions = [
    { id: 'regular', name: 'Regular', price: '$3.20/gallon', description: '87 octane' },
    { id: 'mid-grade', name: 'Mid-Grade', price: '$3.60/gallon', description: '89 octane' },
    { id: 'premium', name: 'Premium', price: '$4.25/gallon', description: '93 octane' },
    { id: 'diesel', name: 'Diesel', price: '$3.95/gallon', description: 'Diesel fuel' }
];

interface AddOnServicesPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onContinue: (selections: {
        carWash?: { id: string; name: string; price: string; description: string };
        fuelFill?: { id: string; name: string; price: string; description: string };
    }) => void;
}

export function AddOnServicesPopup({ isOpen, onClose, onContinue }: AddOnServicesPopupProps) {
    const [carWashSelected, setCarWashSelected] = useState(false);
    const [fuelFillSelected, setFuelFillSelected] = useState(false);
    const [selectedCarWash, setSelectedCarWash] = useState<any>(null);
    const [selectedFuelFill, setSelectedFuelFill] = useState<any>(null);
    const [showCarWashOptions, setShowCarWashOptions] = useState(false);
    const [showFuelFillOptions, setShowFuelFillOptions] = useState(false);

    if (!isOpen) return null;

    const handleCarWashToggle = (checked: boolean) => {
        setCarWashSelected(checked);
        if (checked) {
            setShowCarWashOptions(true);
            setShowFuelFillOptions(false);
        } else {
            setShowCarWashOptions(false);
            setSelectedCarWash(null);
        }
    };

    const handleFuelFillToggle = (checked: boolean) => {
        setFuelFillSelected(checked);
        if (checked) {
            setShowFuelFillOptions(true);
            setShowCarWashOptions(false);
        } else {
            setShowFuelFillOptions(false);
            setSelectedFuelFill(null);
        }
    };

    const handleCarWashOptionSelect = (option: any) => {
        setSelectedCarWash(option);
        // Keep the car wash options open so user can see their selection
        // setShowCarWashOptions(false); // Removed this line
        
        // If fuel fill is also selected, show its options
        if (fuelFillSelected && !selectedFuelFill) {
            setShowFuelFillOptions(true);
        }
    };

    const handleFuelFillOptionSelect = (option: any) => {
        setSelectedFuelFill(option);
        // Keep the fuel fill options open so user can see their selection
        // setShowFuelFillOptions(false); // Removed this line
    };

    const handleContinue = () => {
        const selections: any = {};
        if (carWashSelected && selectedCarWash) {
            selections.carWash = selectedCarWash;
        }
        if (fuelFillSelected && selectedFuelFill) {
            selections.fuelFill = selectedFuelFill;
        }
        onContinue(selections);
    };

    const canContinue = () => {
        if (carWashSelected && !selectedCarWash) return false;
        if (fuelFillSelected && !selectedFuelFill) return false;
        return true;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full mx-auto" style={{ maxWidth: '356px' }}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Would you like to add on:
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Car Wash Option */}
                    <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="car-wash"
                                checked={carWashSelected}
                                onCheckedChange={handleCarWashToggle}
                            />
                            <button
                                onClick={() => handleCarWashToggle(!carWashSelected)}
                                className="flex items-center space-x-2 flex-1 text-left"
                            >
                                <Car className="w-5 h-5 text-gray-600" />
                                <span className="text-gray-900 font-medium">Car wash</span>
                            </button>
                            {selectedCarWash && (
                                <span className="text-sm text-gray-600">{selectedCarWash.name}</span>
                            )}
                        </div>

                        {/* Car Wash Options */}
                        {showCarWashOptions && (
                            <Card className="ml-6 p-3 bg-gray-50">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Select Car Wash option</h3>
                                <div className="space-y-2">
                                    {carWashOptions.map((option) => (
                                        <div
                                            key={option.id}
                                            onClick={() => handleCarWashOptionSelect(option)}
                                            className={`flex items-start justify-between p-2 rounded cursor-pointer transition-colors ${
                                                selectedCarWash?.id === option.id 
                                                    ? 'bg-blue-50 border border-blue-200' 
                                                    : 'hover:bg-white'
                                            }`}
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium text-gray-900">{option.name}</p>
                                                    {selectedCarWash?.id === option.id && (
                                                        <Check className="w-4 h-4 text-blue-600" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600">{option.description}</p>
                                            </div>
                                            <div className="ml-3">
                                                <p className="font-bold text-primary">{option.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Fuel Fill Option */}
                    <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="fuel-fill"
                                checked={fuelFillSelected}
                                onCheckedChange={handleFuelFillToggle}
                            />
                            <button
                                onClick={() => handleFuelFillToggle(!fuelFillSelected)}
                                className="flex items-center space-x-2 flex-1 text-left"
                            >
                                <Fuel className="w-5 h-5 text-gray-600" />
                                <span className="text-gray-900 font-medium">Fuel fill</span>
                            </button>
                            {selectedFuelFill && (
                                <span className="text-sm text-gray-600">{selectedFuelFill.name}</span>
                            )}
                        </div>

                        {/* Fuel Fill Options */}
                        {showFuelFillOptions && (
                            <Card className="ml-6 p-3 bg-gray-50">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Select Fuel Fill option</h3>
                                <div className="space-y-2">
                                    {fuelFillOptions.map((option) => (
                                        <div
                                            key={option.id}
                                            onClick={() => handleFuelFillOptionSelect(option)}
                                            className={`flex items-start justify-between p-2 rounded cursor-pointer transition-colors ${
                                                selectedFuelFill?.id === option.id 
                                                    ? 'bg-blue-50 border border-blue-200' 
                                                    : 'hover:bg-white'
                                            }`}
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium text-gray-900">{option.name}</p>
                                                    {selectedFuelFill?.id === option.id && (
                                                        <Check className="w-4 h-4 text-blue-600" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600">{option.description}</p>
                                            </div>
                                            <div className="ml-3">
                                                <p className="font-bold text-primary">{option.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t">
                    <Button
                        onClick={handleContinue}
                        disabled={!canContinue()}
                        className="w-full"
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    );
}