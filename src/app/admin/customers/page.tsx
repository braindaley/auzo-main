"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { adminStorage } from '@/lib/admin-storage';
import { CustomerDetail, AdminRole } from '@/lib/types/admin';

const CustomersPage = () => {
  const router = useRouter();
  const [customers, setCustomers] = useState<CustomerDetail[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [role, setRole] = useState<AdminRole>(AdminRole.SUPPORT);

  useEffect(() => {
    loadCustomers();
    setRole(adminStorage.getAdminRole());
  }, []);

  const loadCustomers = () => {
    const data = adminStorage.getCustomers();
    setCustomers(data);
  };

  const filteredCustomers = customers.filter(customer =>
    `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery) ||
    customer.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPhone = (phone: string) => {
    if (phone.length === 10) {
      return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
    }
    return phone;
  };

  const handleCustomerClick = (customerId: string) => {
    router.push(`/admin/customers/${customerId}`);
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
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-gray-300"
          />
        </div>

        {/* Customer List */}
        <div className="space-y-3">
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No customers found</p>
            </div>
          ) : (
            filteredCustomers.map((customer) => (
              <Card
                key={customer.id}
                className="border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleCustomerClick(customer.id)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    {/* Row 1: Name and Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-700 font-medium">
                            {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {customer.firstName} {customer.lastName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatPhone(customer.phone)}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={customer.status === 'active' ? 'default' : 'outline'}
                        className={customer.status === 'active' ? 'bg-black text-white' : 'text-gray-700 border-gray-300'}
                      >
                        {customer.status === 'active' ? 'Active' : 'Disabled'}
                      </Badge>
                    </div>

                    {/* Row 2: Email */}
                    {customer.email && (
                      <div className="text-sm text-gray-600">
                        {customer.email}
                      </div>
                    )}

                    {/* Row 3: Stats */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{customer.orders.length} orders</span>
                      <span>•</span>
                      <span>{customer.vehicles.length} vehicles</span>
                      <span>•</span>
                      <span>Member since {new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    </div>

                    {/* Row 4: Recent Order (if any) */}
                    {customer.orders.length > 0 && (
                      <div className="pt-2 border-t border-gray-100">
                        <div className="text-xs text-gray-500">Recent: {customer.orders[0].service} - {customer.orders[0].vehicle}</div>
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
          Showing {filteredCustomers.length} of {customers.length} customers
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;