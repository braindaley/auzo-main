'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Clock, MapPin, Car, CheckCircle, Truck, Navigation, Package, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getOrder, updateOrderStatus, cancelOrder } from '@/lib/services/order-service';
import { Order, OrderStatus, OrderStatusLabels } from '@/lib/types/order';

interface OrderPageProps {
    params: Promise<{ orderId: string }>;
}

export default function OrderPage({ params }: OrderPageProps) {
    const router = useRouter();
    const { orderId } = use(params);
    
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (orderId) {
            loadOrder();
        }
    }, [orderId]);

    useEffect(() => {
        // Auto-update status from Finding Driver to Driver on Way after 3 seconds
        if (order && order.status === OrderStatus.FINDING_DRIVER) {
            const timer = setTimeout(async () => {
                try {
                    await updateOrderStatus(orderId, OrderStatus.DRIVER_ON_WAY);
                    await loadOrder(); // Reload to get updated order
                } catch (error) {
                    console.error('Error auto-updating status:', error);
                }
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [order, orderId]);

    const loadOrder = async () => {
        setLoading(true);
        try {
            const fetchedOrder = await getOrder(orderId);
            if (fetchedOrder) {
                setOrder(fetchedOrder);
            } else {
                setError('Order not found');
            }
        } catch (error) {
            console.error('Error loading order:', error);
            setError('Failed to load order');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusClick = async () => {
        if (!order) return;

        let nextStatus: OrderStatus;
        switch (order.status) {
            case OrderStatus.FINDING_DRIVER:
                nextStatus = OrderStatus.DRIVER_ON_WAY;
                break;
            case OrderStatus.DRIVER_ON_WAY:
                nextStatus = OrderStatus.CAR_IN_TRANSIT;
                break;
            case OrderStatus.CAR_IN_TRANSIT:
                nextStatus = OrderStatus.CAR_DELIVERED;
                break;
            case OrderStatus.CAR_DELIVERED:
            case OrderStatus.CANCELLED:
                // Already delivered or cancelled, no next status
                return;
            default:
                return;
        }

        try {
            await updateOrderStatus(orderId, nextStatus);
            await loadOrder(); // Reload to get updated order
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleCancelOrder = async () => {
        if (!order) return;

        const confirmed = confirm('Are you sure you want to cancel this order?');
        if (!confirmed) return;

        try {
            await cancelOrder(orderId);
            await loadOrder(); // Reload to get updated order
        } catch (error) {
            console.error('Error cancelling order:', error);
        }
    };

    const getStatusIcon = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.FINDING_DRIVER:
                return <Navigation className="w-4 h-4" />;
            case OrderStatus.DRIVER_ON_WAY:
                return <Car className="w-4 h-4" />;
            case OrderStatus.CAR_IN_TRANSIT:
                return <Truck className="w-4 h-4" />;
            case OrderStatus.CAR_DELIVERED:
                return <CheckCircle className="w-4 h-4" />;
            case OrderStatus.CANCELLED:
                return <X className="w-4 h-4" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: OrderStatus): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case OrderStatus.FINDING_DRIVER:
                return "secondary";
            case OrderStatus.DRIVER_ON_WAY:
                return "default";
            case OrderStatus.CAR_IN_TRANSIT:
                return "default";
            case OrderStatus.CAR_DELIVERED:
                return "outline";
            case OrderStatus.CANCELLED:
                return "destructive";
            default:
                return "default";
        }
    };

    const getStatusMessage = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.FINDING_DRIVER:
                return "We're finding the perfect driver for your vehicle";
            case OrderStatus.DRIVER_ON_WAY:
                return "Your driver is on the way to pick up your vehicle";
            case OrderStatus.CAR_IN_TRANSIT:
                return "Your vehicle is being transported to the destination";
            case OrderStatus.CAR_DELIVERED:
                return "Your vehicle has been delivered successfully!";
            case OrderStatus.CANCELLED:
                return "This order has been cancelled";
            default:
                return "";
        }
    };

    const getArrivalTime = (status: OrderStatus): string | null => {
        switch (status) {
            case OrderStatus.DRIVER_ON_WAY:
                return "Arrives in 12 minutes";
            case OrderStatus.CAR_IN_TRANSIT:
                return "Arrives in 20 minutes";
            case OrderStatus.CAR_DELIVERED:
                // For demo purposes, show current time as delivery time
                return `Delivered at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            case OrderStatus.CANCELLED:
                return `Cancelled at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error || 'Order not found'}</p>
                    <Button onClick={() => router.push('/home')}>
                        <Home className="w-4 h-4 mr-2" />
                        Back to Home
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Map Placeholder */}
            <div className="h-64 bg-gray-200 flex items-center justify-center relative">
                <div className="text-center text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">Map loading...</p>
                </div>
                
                {/* Status Badge - Clickable for demo */}
                <div className="absolute top-4 right-4">
                    <Badge 
                        variant={getStatusColor(order.status)}
                        className="cursor-pointer flex items-center gap-1 px-3 py-2 text-sm"
                        onClick={handleStatusClick}
                    >
                        {getStatusIcon(order.status)}
                        {OrderStatusLabels[order.status]}
                    </Badge>
                </div>
            </div>

            {/* Status Message */}
            <div className="bg-white px-4 py-6 border-b">
                <div className="text-center">
                    <h1 className="text-xl font-semibold text-gray-900 mb-2">
                        {getStatusMessage(order.status)}
                    </h1>
                    {getArrivalTime(order.status) && (
                        <p className="text-lg font-medium text-blue-600 mb-2">
                            {getArrivalTime(order.status)}
                        </p>
                    )}
                    <p className="text-sm text-gray-500">Order #{orderId.slice(-6).toUpperCase()}</p>
                </div>
            </div>

            <div className="flex-1 p-4 space-y-4">
                {/* Order Progress */}
                <Card className="p-4 bg-white">
                    <h2 className="text-sm font-semibold text-gray-900 mb-4">Order Progress</h2>
                    <div className="space-y-3">
                        {Object.values(OrderStatus).filter(v => typeof v === 'number').map((status) => {
                            const isCompleted = order.status >= (status as number);
                            const isCurrent = order.status === status;
                            return (
                                <div key={status} className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                                    }`}>
                                        {isCompleted ? '✓' : status}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm ${isCurrent ? 'font-semibold' : ''} ${
                                            isCompleted ? 'text-gray-900' : 'text-gray-400'
                                        }`}>
                                            {OrderStatusLabels[status as OrderStatus]}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Order Details */}
                <Card className="p-4 bg-white">
                    <h2 className="text-sm font-semibold text-gray-900 mb-3">Order Details</h2>
                    
                    <div className="space-y-3">
                        <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-xs text-gray-500">Pickup Location</p>
                                <p className="text-sm text-gray-900">{order.pickupLocation || 'Current Location'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <Package className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-xs text-gray-500">Destination</p>
                                <p className="text-sm text-gray-900">{order.dropoffLocation || 'AutoZone Pro Service Center'}</p>
                            </div>
                        </div>

                        {order.vehicleInfo && (
                            <div className="flex items-start gap-2">
                                <Car className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500">Vehicle</p>
                                    <p className="text-sm text-gray-900">
                                        {order.vehicleInfo.year} {order.vehicleInfo.make} {order.vehicleInfo.model}
                                    </p>
                                    {order.vehicleInfo.licensePlate && (
                                        <p className="text-xs text-gray-500">{order.vehicleInfo.licensePlate}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {order.notes && (
                            <div className="flex items-start gap-2">
                                <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500">Notes</p>
                                    <p className="text-sm text-gray-900">{order.notes}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Driver Info (when available) */}
                {order.status >= OrderStatus.DRIVER_ON_WAY && (
                    <Card className="p-4 bg-blue-50 border-blue-200">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Driver Information</h3>
                        <div className="space-y-1 text-sm">
                            <p className="text-gray-700">
                                <span className="font-medium">Name:</span> {order.driverInfo?.name || 'John Smith'}
                            </p>
                            <p className="text-gray-700">
                                <span className="font-medium">Phone:</span> {order.driverInfo?.phone || '(555) 123-4567'}
                            </p>
                            <p className="text-gray-700">
                                <span className="font-medium">ETA:</span> 12 minutes
                            </p>
                        </div>
                    </Card>
                )}

                {/* Demo Instructions */}
                <Card className="p-4 bg-yellow-50 border-yellow-200">
                    <p className="text-xs text-yellow-800">
                        <span className="font-semibold">Demo Mode:</span> Click the status badge above to manually progress through order statuses.
                    </p>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-2 pt-4">
                    {order.status === OrderStatus.FINDING_DRIVER && (
                        <Button 
                            variant="destructive"
                            className="w-full h-12 text-base font-semibold"
                            onClick={handleCancelOrder}
                        >
                            <X className="w-4 h-4 mr-2" />
                            Cancel Service
                        </Button>
                    )}
                    <Button 
                        className="w-full h-12 text-base font-semibold"
                        onClick={() => router.push('/home')}
                    >
                        <Home className="w-4 h-4 mr-2" />
                        Back to Home
                    </Button>
                </div>
            </div>
        </div>
    );
}