"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Car, CreditCard, ShoppingBag, UserCog } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { adminStorage } from '@/lib/admin-storage';
import { CustomerDetail, AdminRole } from '@/lib/types/admin';

const CustomerDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [role, setRole] = useState<AdminRole>(AdminRole.SUPPORT);

  useEffect(() => {
    const data = adminStorage.getCustomer(customerId);
    setCustomer(data || null);
    setRole(adminStorage.getAdminRole());
  }, [customerId]);

  const formatPhone = (phone: string) => {
    if (phone.length === 10) {
      return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
    }
    return phone;
  };

  const handleToggleStatus = () => {
    if (!customer || role === AdminRole.SUPPORT) return;

    const newStatus = customer.status === 'active' ? 'disabled' : 'active';
    adminStorage.updateCustomer(customerId, { status: newStatus });
    setCustomer({ ...customer, status: newStatus });
  };

  const handleImpersonate = () => {
    if (!customer) return;

    adminStorage.setImpersonation('customer', customer.id, `${customer.firstName} ${customer.lastName}`);
    router.push('/home');
  };

  if (!customer) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="icon" onClick={() => router.push('/admin/customers')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Customer Not Found</h1>
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
          <Button variant="ghost" size="icon" onClick={() => router.push('/admin/customers')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {customer.firstName} {customer.lastName}
            </h1>
            <p className="text-sm text-gray-600">{formatPhone(customer.phone)}</p>
          </div>
          <Badge
            variant={customer.status === 'active' ? 'default' : 'outline'}
            className={customer.status === 'active' ? 'bg-black text-white' : 'text-gray-700 border-gray-300'}
          >
            {customer.status === 'active' ? 'Active' : 'Disabled'}
          </Badge>
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
            {customer.status === 'active' ? 'Disable' : 'Enable'} Account
          </Button>
        </div>

        {/* Contact Info */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <div className="text-sm text-gray-600">Phone</div>
              <div className="font-medium text-gray-900">{formatPhone(customer.phone)}</div>
            </div>
            {customer.email && (
              <div>
                <div className="text-sm text-gray-600">Email</div>
                <div className="font-medium text-gray-900">{customer.email}</div>
              </div>
            )}
            <div>
              <div className="text-sm text-gray-600">Member Since</div>
              <div className="font-medium text-gray-900">
                {new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicles */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Car className="w-5 h-5" />
              Vehicles ({customer.vehicles.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {customer.vehicles.length === 0 ? (
              <p className="text-sm text-gray-500">No vehicles</p>
            ) : (
              customer.vehicles.map((vehicle) => (
                <div key={vehicle.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-900">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </div>
                  <div className="text-sm text-gray-600">{vehicle.color}</div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Methods ({customer.paymentMethods.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {customer.paymentMethods.length === 0 ? (
              <p className="text-sm text-gray-500">No payment methods</p>
            ) : (
              customer.paymentMethods.map((pm) => (
                <div key={pm.id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{pm.brand} •••• {pm.last4}</div>
                    {pm.isDefault && (
                      <Badge variant="outline" className="text-xs text-gray-600 border-gray-300 mt-1">
                        Default
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Order History */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Order History ({customer.orders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {customer.orders.length === 0 ? (
              <p className="text-sm text-gray-500">No orders</p>
            ) : (
              customer.orders.map((order) => (
                <div key={order.id} className="p-3 bg-gray-50 rounded-lg space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900">{order.service}</div>
                    <div className="font-semibold text-gray-900">${order.cost.toFixed(2)}</div>
                  </div>
                  <div className="text-sm text-gray-600">{order.vehicle}</div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{order.orderNumber}</span>
                    <span>{new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">
                    {order.status}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDetailPage;