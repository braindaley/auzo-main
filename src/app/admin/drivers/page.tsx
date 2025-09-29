"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Car, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { adminStorage } from '@/lib/admin-storage';
import { DriverDetail, AdminRole } from '@/lib/types/admin';

const DriversPage = () => {
  const router = useRouter();
  const [drivers, setDrivers] = useState<DriverDetail[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [role, setRole] = useState<AdminRole>(AdminRole.SUPPORT);

  useEffect(() => {
    loadDrivers();
    setRole(adminStorage.getAdminRole());
  }, []);

  const loadDrivers = () => {
    const data = adminStorage.getDrivers();
    setDrivers(data);
  };

  const filteredDrivers = drivers.filter(driver =>
    `${driver.firstName} ${driver.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.phone.includes(searchQuery) ||
    driver.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPhone = (phone: string) => {
    if (phone.length === 10) {
      return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
    }
    return phone;
  };

  const handleDriverClick = (driverId: string) => {
    router.push(`/admin/drivers/${driverId}`);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/admin')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Drivers</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search drivers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-gray-300"
          />
        </div>

        {/* Driver List */}
        <div className="space-y-3">
          {filteredDrivers.length === 0 ? (
            <div className="text-center py-8">
              <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No drivers found</p>
            </div>
          ) : (
            filteredDrivers.map((driver) => (
              <Card
                key={driver.id}
                className="border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleDriverClick(driver.id)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    {/* Row 1: Name, Rating, and Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-700 font-medium">
                            {driver.firstName.charAt(0)}{driver.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {driver.firstName} {driver.lastName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatPhone(driver.phone)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-gray-400 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">{driver.rating.toFixed(1)}</span>
                        </div>
                        <Badge
                          variant={driver.status === 'active' ? 'default' : 'outline'}
                          className={driver.status === 'active' ? 'bg-black text-white' : 'text-gray-700 border-gray-300'}
                        >
                          {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    {/* Row 2: Email */}
                    {driver.email && (
                      <div className="text-sm text-gray-600">
                        {driver.email}
                      </div>
                    )}

                    {/* Row 3: Stats */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{driver.totalTrips} trips</span>
                      <span>•</span>
                      <span>${driver.totalEarnings.toFixed(2)} earned</span>
                      <span>•</span>
                      <span>Joined {new Date(driver.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    </div>

                    {/* Row 4: Recent Activity */}
                    {driver.trips.length > 0 && (
                      <div className="pt-2 border-t border-gray-100">
                        <div className="text-xs text-gray-500">
                          Recent: {driver.trips[0].pickup} → {driver.trips[0].dropoff}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Summary */}
        <div className="text-center text-sm text-gray-500">
          Showing {filteredDrivers.length} of {drivers.length} drivers
        </div>
      </div>
    </div>
  );
};

export default DriversPage;