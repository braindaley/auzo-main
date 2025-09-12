import { Vehicle } from '@/components/car-card';

const VEHICLES_KEY = 'auzo_vehicles';

export const vehicleStorage = {
  getVehicles(): Vehicle[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(VEHICLES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveVehicle(vehicle: Omit<Vehicle, 'id'>): Vehicle {
    const vehicles = this.getVehicles();
    const newVehicle: Vehicle = {
      ...vehicle,
      id: Date.now().toString()
    };
    
    vehicles.push(newVehicle);
    localStorage.setItem(VEHICLES_KEY, JSON.stringify(vehicles));
    
    return newVehicle;
  },

  deleteVehicle(id: string): void {
    const vehicles = this.getVehicles();
    const filtered = vehicles.filter(v => v.id !== id);
    localStorage.setItem(VEHICLES_KEY, JSON.stringify(filtered));
  },

  getVehicle(id: string): Vehicle | undefined {
    const vehicles = this.getVehicles();
    return vehicles.find(v => v.id === id);
  },

  updateVehicle(id: string, updatedVehicle: Partial<Vehicle>): void {
    const vehicles = this.getVehicles();
    const index = vehicles.findIndex(v => v.id === id);
    
    if (index !== -1) {
      vehicles[index] = { ...vehicles[index], ...updatedVehicle };
      localStorage.setItem(VEHICLES_KEY, JSON.stringify(vehicles));
    }
  }
};