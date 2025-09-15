"use client";

import React, { useState, useEffect } from 'react';
import { Car, ChevronDown } from 'lucide-react';
import { Vehicle } from '@/components/car-card';
import { vehicleStorage } from '@/lib/vehicle-storage';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DefaultVehicleSelectorProps {
  onVehicleChange?: (vehicle: Vehicle | null) => void;
}

export const DefaultVehicleSelector: React.FC<DefaultVehicleSelectorProps> = ({ onVehicleChange }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  
  useEffect(() => {
    const loadedVehicles = vehicleStorage.getVehicles();
    setVehicles(loadedVehicles);
    
    // Set first vehicle as default if available
    if (loadedVehicles.length > 0 && !selectedVehicleId) {
      const defaultVehicleId = localStorage.getItem('auzo_default_vehicle') || loadedVehicles[0].id;
      const vehicleExists = loadedVehicles.find(v => v.id === defaultVehicleId);
      const vehicleToSelect = vehicleExists ? defaultVehicleId : loadedVehicles[0].id;
      setSelectedVehicleId(vehicleToSelect);
      
      if (onVehicleChange) {
        const selectedVehicle = loadedVehicles.find(v => v.id === vehicleToSelect);
        onVehicleChange(selectedVehicle || null);
      }
    }
  }, []);
  
  const handleVehicleChange = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    localStorage.setItem('auzo_default_vehicle', vehicleId);
    
    if (onVehicleChange) {
      const selectedVehicle = vehicles.find(v => v.id === vehicleId);
      onVehicleChange(selectedVehicle || null);
    }
  };
  
  // Don't render if no vehicles
  if (vehicles.length === 0) {
    return null;
  }
  
  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);
  
  return (
    <div className="mt-4">
      <label className="text-sm font-medium text-gray-700 mb-2 block">Default vehicle</label>
      <div className="flex items-center bg-white border border-gray-300 rounded-lg p-3 gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
          {selectedVehicle?.photos && selectedVehicle.photos[0] ? (
            <img 
              src={selectedVehicle.photos[0]} 
              alt="Vehicle" 
              className="w-full h-full object-cover"
            />
          ) : (
            <Car className="w-4 h-4 text-gray-400" />
          )}
        </div>
        <div className="flex-1">
          <Select value={selectedVehicleId} onValueChange={handleVehicleChange}>
            <SelectTrigger className="border-0 h-auto p-0 focus:ring-0 focus:ring-offset-0">
              <SelectValue>
                {selectedVehicle && (
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                    </div>
                    <div className="text-xs text-gray-500">
                      {selectedVehicle.color}
                    </div>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {vehicles.map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {vehicle.photos && vehicle.photos[0] ? (
                        <img 
                          src={vehicle.photos[0]} 
                          alt={`${vehicle.make} ${vehicle.model}`} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Car className="w-3 h-3 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </div>
                      <div className="text-xs text-gray-500">
                        {vehicle.color}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};