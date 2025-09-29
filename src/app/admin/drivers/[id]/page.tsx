"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, TrendingUp, DollarSign, Route, UserCog } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { adminStorage } from '@/lib/admin-storage';
import { DriverDetail, AdminRole } from '@/lib/types/admin';

const DriverDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const driverId = params.id as string;

  const [driver, setDriver] = useState<DriverDetail | null>(null);
  const [role, setRole] = useState<AdminRole>(AdminRole.SUPPORT);

  useEffect(() => {
    const data = adminStorage.getDriver(driverId);
    setDriver(data || null);
    setRole(adminStorage.getAdminRole());
  }, [driverId]);

  const formatPhone = (phone: string) => {
    if (phone.length === 10) {
      return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
    }
    return phone;
  };

  const handleToggleStatus = () => {
    if (!driver || role === AdminRole.SUPPORT) return;

    const newStatus = driver.status === 'active' ? 'disabled' : 'active';
    adminStorage.updateDriver(driverId, { status: newStatus });
    setDriver({ ...driver, status: newStatus });
  };

  const handleImpersonate = () => {
    if (!driver) return;

    adminStorage.setImpersonation('driver', driver.id, `${driver.firstName} ${driver.lastName}`);
    router.push('/drive');
  };

  if (!driver) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="icon" onClick={() => router.push('/admin/drivers')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Driver Not Found</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push('/admin/drivers')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {driver.firstName} {driver.lastName}
            </h1>
            <p className="text-sm text-gray-600">{formatPhone(driver.phone)}</p>
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

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 border-gray-300 text-gray-700"
            onClick={handleImpersonate}
          >
            <UserCog className="w-4 h-4 mr-2" />
            Impersonate
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-gray-300 text-gray-700"
            onClick={handleToggleStatus}
            disabled={role === AdminRole.SUPPORT}
          >
            {driver.status === 'active' ? 'Disable' : 'Enable'} Account
          </Button>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Route className="w-4 h-4" />
                <span className="text-xs">Total Trips</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{driver.totalTrips}</div>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs">Earnings</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">${driver.totalEarnings.toFixed(0)}</div>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs">Avg/Trip</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                ${driver.totalTrips > 0 ? (driver.totalEarnings / driver.totalTrips).toFixed(2) : '0.00'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Driver Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <div className="text-sm text-gray-600">Phone</div>
              <div className="font-medium text-gray-900">{formatPhone(driver.phone)}</div>
            </div>
            {driver.email && (
              <div>
                <div className="text-sm text-gray-600">Email</div>
                <div className="font-medium text-gray-900">{driver.email}</div>
              </div>
            )}
            <div>
              <div className="text-sm text-gray-600">Joined</div>
              <div className="font-medium text-gray-900">
                {new Date(driver.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Trips */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Route className="w-5 h-5" />
              Recent Trips ({driver.trips.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {driver.trips.length === 0 ? (
              <p className="text-sm text-gray-500">No trips yet</p>
            ) : (
              driver.trips.map((trip) => (
                <div key={trip.id} className="p-3 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        {trip.pickup}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                        {trip.dropoff}
                      </div>
                      <div className="text-xs text-gray-500">
                        {trip.customer} • {new Date(trip.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-semibold text-gray-900">${trip.earnings.toFixed(2)}</div>
                      {trip.rating && (
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Star className="w-3 h-3 fill-gray-400 text-gray-400" />
                          {trip.rating}
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">
                    {trip.status}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Payout History */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Payout History ({driver.payouts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {driver.payouts.length === 0 ? (
              <p className="text-sm text-gray-500">No payouts yet</p>
            ) : (
              driver.payouts.map((payout) => (
                <div key={payout.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-gray-900">${payout.amount.toFixed(2)}</div>
                    <Badge
                      variant={payout.status === 'completed' ? 'default' : 'outline'}
                      className={
                        payout.status === 'completed'
                          ? 'bg-black text-white'
                          : payout.status === 'pending'
                          ? 'text-gray-700 border-gray-300'
                          : 'text-gray-600 border-gray-300'
                      }
                    >
                      {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">{payout.method}</div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                    <span>{new Date(payout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    {payout.transactionId && <span>{payout.transactionId}</span>}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverDetailPage;