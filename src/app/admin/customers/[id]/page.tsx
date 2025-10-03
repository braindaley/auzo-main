"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Car, CreditCard, ShoppingBag, UserCog, DollarSign, Calendar, RefreshCw, ChevronDown, ChevronUp, AlertCircle, Clock } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { adminStorage } from '@/lib/admin-storage';
import { CustomerDetail, AdminRole } from '@/lib/types/admin';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const CustomerDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [role, setRole] = useState<AdminRole>(AdminRole.SUPPORT);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);

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

  const handleRefundClick = (order: any) => {
    setSelectedOrder(order);
    setRefundAmount(order.cost.toString());
    setRefundReason('');
    setRefundDialogOpen(true);
  };

  const processRefund = async () => {
    if (!selectedOrder || !customer) return;

    setIsProcessingRefund(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Update the order with refund information
    const updatedOrders = customer.orders.map(order => {
      if (order.id === selectedOrder.id) {
        return {
          ...order,
          refundAmount: parseFloat(refundAmount),
          refundDate: new Date(),
          refundReason: refundReason,
          status: 'Refunded'
        };
      }
      return order;
    });

    const updatedCustomer = { ...customer, orders: updatedOrders };
    adminStorage.updateCustomer(customerId, updatedCustomer);
    setCustomer(updatedCustomer);

    setIsProcessingRefund(false);
    setRefundDialogOpen(false);
    setSelectedOrder(null);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'refunded':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!customer) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-6xl mx-auto">
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
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push('/admin/customers')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {customer.firstName} {customer.lastName}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{formatPhone(customer.phone)}</span>
              {customer.email && <span>{customer.email}</span>}
              <span>Customer ID: {customer.id}</span>
            </div>
          </div>
          <Badge
            variant={customer.status === 'active' ? 'default' : 'outline'}
            className={customer.status === 'active' ? 'bg-black text-white' : 'text-gray-700 border-gray-300'}
          >
            {customer.status === 'active' ? 'Active' : 'Disabled'}
          </Badge>
        </div>

        {/* Account Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-8 h-8 text-gray-400" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{customer.orders.length}</div>
                  <div className="text-sm text-gray-600">Total Orders</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-gray-400" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${customer.orders.reduce((sum, order) => sum + order.cost - (order.refundAmount || 0), 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Car className="w-8 h-8 text-gray-400" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{customer.vehicles.length}</div>
                  <div className="text-sm text-gray-600">Vehicles</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-gray-400" />
                <div>
                  <div className="text-xl font-bold text-gray-900">
                    {new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                  <div className="text-sm text-gray-600">Member Since</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 border-gray-300 text-gray-700"
            onClick={handleImpersonate}
          >
            <UserCog className="w-4 h-4 mr-2" />
            Impersonate Customer
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transactions / Order History */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Transactions & Orders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {customer.orders.length === 0 ? (
                  <p className="text-sm text-gray-500">No transactions</p>
                ) : (
                  customer.orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div
                        className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-semibold text-gray-900">{order.orderNumber}</span>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                              {order.refundAmount && (
                                <Badge className="bg-red-100 text-red-800">
                                  <RefreshCw className="w-3 h-3 mr-1" />
                                  Refunded ${order.refundAmount.toFixed(2)}
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Service: </span>
                                <span className="font-medium text-gray-900">{order.service}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Vehicle: </span>
                                <span className="font-medium text-gray-900">{order.vehicle}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Date: </span>
                                <span className="font-medium text-gray-900">
                                  {new Date(order.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600">Total: </span>
                                <span className="font-bold text-gray-900">${order.cost.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {expandedOrderId === order.id ? (
                              <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>

                      {expandedOrderId === order.id && (
                        <div className="p-4 bg-white border-t border-gray-200">
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <div className="text-gray-600 mb-1">Payment Method</div>
                                <div className="font-medium text-gray-900">
                                  {order.paymentMethod || 'Visa •••• 4242'}
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-600 mb-1">Transaction ID</div>
                                <div className="font-medium text-gray-900 font-mono text-xs">
                                  {order.id}
                                </div>
                              </div>
                            </div>

                            {order.refundAmount ? (
                              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                  <div className="flex-1">
                                    <div className="font-semibold text-red-900 mb-1">
                                      Refund Issued
                                    </div>
                                    <div className="text-sm text-red-700 space-y-1">
                                      <div>Amount: ${order.refundAmount.toFixed(2)}</div>
                                      {order.refundDate && (
                                        <div>Date: {new Date(order.refundDate).toLocaleDateString()}</div>
                                      )}
                                      {order.refundReason && (
                                        <div>Reason: {order.refundReason}</div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1"
                                  onClick={() => handleRefundClick(order)}
                                  disabled={order.status === 'Refunded'}
                                >
                                  <RefreshCw className="w-4 h-4 mr-2" />
                                  Issue Refund
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1"
                                  onClick={() => router.push(`/admin/orders/${order.id}`)}
                                >
                                  View Full Details
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
                    {new Date(customer.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Last Activity</div>
                  <div className="font-medium text-gray-900">
                    {customer.orders.length > 0
                      ? new Date(customer.orders[0].date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })
                      : 'No activity'
                    }
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
                      <div className="text-xs text-gray-500 mt-1">ID: {vehicle.id}</div>
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
                    <div key={pm.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">
                            {pm.brand} •••• {pm.last4}
                          </div>
                          {pm.isDefault && (
                            <Badge variant="outline" className="text-xs text-gray-600 border-gray-300 mt-1">
                              Default
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Refund Dialog */}
      <Dialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Issue Refund</DialogTitle>
            <DialogDescription>
              Process a refund for order {selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="refund-amount">Refund Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="refund-amount"
                  type="number"
                  step="0.01"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  className="pl-8"
                  max={selectedOrder?.cost}
                />
              </div>
              <p className="text-sm text-gray-600">
                Original amount: ${selectedOrder?.cost.toFixed(2)}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="refund-reason">Reason for Refund</Label>
              <Textarea
                id="refund-reason"
                placeholder="Enter the reason for this refund..."
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                rows={3}
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <div className="font-semibold mb-1">Important</div>
                  <div>This action cannot be undone. The refund will be processed immediately to the customer's original payment method.</div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRefundDialogOpen(false)}
              disabled={isProcessingRefund}
            >
              Cancel
            </Button>
            <Button
              onClick={processRefund}
              disabled={isProcessingRefund || !refundAmount || parseFloat(refundAmount) <= 0 || parseFloat(refundAmount) > (selectedOrder?.cost || 0)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isProcessingRefund ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Issue Refund
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerDetailPage;