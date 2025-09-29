'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Clock, MapPin, Car, CheckCircle, Truck, Navigation, Package, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getOrder, updateOrderStatus, cancelOrder } from '@/lib/services/order-service';
import { Order, OrderStatus, OrderStatusLabels } from '@/lib/types/order';
import { transactionStorage, Transaction } from '@/lib/transaction-storage';

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

    // Find transaction by orderId and update its status
    const syncTransactionStatus = (newOrderStatus: OrderStatus) => {
        const transactions = transactionStorage.getTransactions();
        console.log('Looking for transaction with orderId:', orderId);
        console.log('All transactions:', transactions.map(t => ({ id: t.id, orderId: t.orderId, status: t.status })));
        
        const transaction = transactions.find(t => t.orderId === orderId);
        if (transaction) {
            console.log('Syncing transaction status:', {
                transactionId: transaction.id,
                orderId,
                oldStatus: transaction.status,
                newStatus: newOrderStatus
            });
            transactionStorage.updateTransactionStatus(transaction.id, newOrderStatus);
        } else {
            console.log('Transaction not found for orderId:', orderId);
            console.log('Available orderIds:', transactions.filter(t => t.orderId).map(t => t.orderId));
        }
    };

    const handleStatusClick = async () => {
        if (!order) return;

        let nextStatus: OrderStatus;

        if (order.isRoundTrip) {
            // Round-trip flow (full-service)
            switch (order.status) {
                case OrderStatus.SCHEDULED:
                    nextStatus = OrderStatus.FINDING_DRIVER;
                    break;
                case OrderStatus.FINDING_DRIVER:
                    nextStatus = OrderStatus.DRIVER_ON_WAY;
                    break;
                case OrderStatus.DRIVER_ON_WAY:
                    nextStatus = OrderStatus.CAR_AT_SERVICE;
                    break;
                case OrderStatus.CAR_AT_SERVICE:
                    nextStatus = OrderStatus.DRIVER_RETURNING;
                    break;
                case OrderStatus.DRIVER_RETURNING:
                    nextStatus = OrderStatus.CAR_DELIVERED;
                    break;
                case OrderStatus.CAR_DELIVERED:
                case OrderStatus.CANCELLED:
                    return;
                default:
                    return;
            }
        } else {
            // One-way flow
            switch (order.status) {
                case OrderStatus.SCHEDULED:
                    nextStatus = OrderStatus.FINDING_DRIVER;
                    break;
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
                    return;
                default:
                    return;
            }
        }

        try {
            await updateOrderStatus(orderId, nextStatus);
            await loadOrder(); // Reload to get updated order

            // Sync the transaction status in localStorage
            syncTransactionStatus(nextStatus);
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
            
            // Sync the transaction status in localStorage
            syncTransactionStatus(OrderStatus.CANCELLED);
        } catch (error) {
            console.error('Error cancelling order:', error);
        }
    };

    const getStatusIcon = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.SCHEDULED:
                return <Clock className="w-4 h-4" />;
            case OrderStatus.FINDING_DRIVER:
                return <Navigation className="w-4 h-4" />;
            case OrderStatus.DRIVER_ON_WAY:
                return <Car className="w-4 h-4" />;
            case OrderStatus.CAR_IN_TRANSIT:
                return <Truck className="w-4 h-4" />;
            case OrderStatus.CAR_AT_SERVICE:
                return <Package className="w-4 h-4" />;
            case OrderStatus.DRIVER_RETURNING:
                return <Car className="w-4 h-4" />;
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
            case OrderStatus.SCHEDULED:
                return "outline";
            case OrderStatus.FINDING_DRIVER:
                return "secondary";
            case OrderStatus.DRIVER_ON_WAY:
                return "default";
            case OrderStatus.CAR_IN_TRANSIT:
                return "default";
            case OrderStatus.CAR_AT_SERVICE:
                return "secondary";
            case OrderStatus.DRIVER_RETURNING:
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
            case OrderStatus.SCHEDULED:
                return "Your service is scheduled and will begin at the selected time";
            case OrderStatus.FINDING_DRIVER:
                return "We're finding the perfect driver for your vehicle";
            case OrderStatus.DRIVER_ON_WAY:
                return "Your driver is on the way";
            case OrderStatus.CAR_IN_TRANSIT:
                return "Your vehicle is being transported to the destination";
            case OrderStatus.CAR_AT_SERVICE:
                return "Your vehicle is being serviced";
            case OrderStatus.DRIVER_RETURNING:
                return "Your driver is bringing your vehicle back";
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
            case OrderStatus.SCHEDULED:
                return order?.scheduledDate && order?.scheduledTime
                    ? `Scheduled for ${order.scheduledDate} at ${order.scheduledTime}`
                    : "Scheduled service";
            case OrderStatus.CAR_IN_TRANSIT:
                return "Arrives in 20 minutes";
            case OrderStatus.CAR_AT_SERVICE:
                return "Service in progress";
            case OrderStatus.DRIVER_RETURNING:
                return "Arrives in 15 minutes";
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
                        className={`flex items-center gap-1 px-3 py-2 text-sm transition-all ${
                            order.status !== OrderStatus.CAR_DELIVERED && order.status !== OrderStatus.CANCELLED
                                ? 'cursor-pointer hover:scale-105 hover:shadow-lg active:scale-95'
                                : ''
                        }`}
                        onClick={handleStatusClick}
                        title={
                            order.status !== OrderStatus.CAR_DELIVERED && order.status !== OrderStatus.CANCELLED
                                ? 'Click to advance to next status'
                                : ''
                        }
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
                    {order.status === OrderStatus.DRIVER_ON_WAY && (
                        <p className="text-lg font-medium text-blue-600">
                            ETA: 12 minutes
                        </p>
                    )}
                    {getArrivalTime(order.status) && (
                        <p className="text-lg font-medium text-blue-600">
                            {getArrivalTime(order.status)}
                        </p>
                    )}
                </div>
            </div>

            {/* Driver Info (when available) - Moved here after status message */}
            {order.status >= OrderStatus.DRIVER_ON_WAY && (
                <div className="bg-white px-4 py-4 border-b">
                    <div className="flex items-center gap-3">
                        {/* Driver Picture */}
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        
                        {/* Driver Info */}
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">Driver Information</h3>
                            <div className="space-y-1 text-sm">
                                <p className="text-gray-700">
                                    <span className="font-medium">Name:</span> {order.driverInfo?.name || 'John Smith'}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-medium">Phone:</span> {order.driverInfo?.phone || '(555) 123-4567'}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Driver Review Request or Rating Display - Only show when car is delivered */}
                    {order.status === OrderStatus.CAR_DELIVERED && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            {order.driverInfo?.rating ? (
                                // Show submitted rating and tip
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-700">
                                        {order.driverInfo?.name || 'John Smith'} was your driver
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-gray-900">
                                            {order.driverInfo.rating}.0
                                        </span>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star 
                                                    key={star}
                                                    className={`w-4 h-4 ${
                                                        star <= order.driverInfo!.rating! 
                                                            ? 'text-yellow-400 fill-current' 
                                                            : 'text-gray-300'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-600">Your Rating</span>
                                    </div>
                                    {order.driverInfo.tip && order.driverInfo.tip > 0 && (
                                        <p className="text-sm text-gray-700">
                                            Tip: <span className="font-semibold">${order.driverInfo.tip.toFixed(2)}</span>
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500">
                                        Rated on {order.driverInfo.ratedAt ? (() => {
                                            try {
                                                const date = typeof order.driverInfo.ratedAt === 'string' 
                                                    ? new Date(order.driverInfo.ratedAt)
                                                    : order.driverInfo.ratedAt.toDate ? order.driverInfo.ratedAt.toDate()
                                                    : new Date(order.driverInfo.ratedAt);
                                                return date.toLocaleDateString();
                                            } catch (e) {
                                                return 'today';
                                            }
                                        })() : 'today'}
                                    </p>
                                </div>
                            ) : (
                                // Show review request
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-700">
                                        {order.driverInfo?.name || 'John Smith'} was your driver
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-gray-900">4.9</span>
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span className="text-sm text-gray-600">Rating</span>
                                    </div>
                                    <Button 
                                        className="w-full mt-3 bg-black hover:bg-gray-800 text-white"
                                        onClick={() => router.push(`/order/${orderId}/rate`)}
                                    >
                                        Rate or Tip
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            <div className="flex-1 p-4 space-y-4">
                {/* Order Progress */}
                <Card className="p-4 bg-white">
                    <h2 className="text-sm font-semibold text-gray-900 mb-4">Order Progress</h2>
                    <div className="space-y-3">
                        {/* Show special case for scheduled orders */}
                        {order.status === OrderStatus.SCHEDULED && (
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900">
                                        Scheduled for {order.scheduledDate} at {order.scheduledTime}
                                    </p>
                                </div>
                            </div>
                        )}
                        
                        {/* Show special case for cancelled orders */}
                        {order.status === OrderStatus.CANCELLED && (
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-500 text-white">
                                    <X className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900">
                                        Order Cancelled
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Show regular progress flow (excluding scheduled and cancelled) */}
                        {order.status !== OrderStatus.SCHEDULED && order.status !== OrderStatus.CANCELLED && (
                            <>
                                {order.isRoundTrip ? (
                                    // Round-trip flow
                                    [OrderStatus.FINDING_DRIVER, OrderStatus.DRIVER_ON_WAY, OrderStatus.CAR_AT_SERVICE, OrderStatus.DRIVER_RETURNING, OrderStatus.CAR_DELIVERED].map((status) => {
                                        const isCompleted = order.status >= status;
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
                                                        {OrderStatusLabels[status]}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    // One-way flow
                                    [OrderStatus.FINDING_DRIVER, OrderStatus.DRIVER_ON_WAY, OrderStatus.CAR_IN_TRANSIT, OrderStatus.CAR_DELIVERED].map((status) => {
                                        const isCompleted = order.status >= status;
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
                                                        {OrderStatusLabels[status]}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </>
                        )}
                    </div>
                </Card>

                {/* Order Details */}
                <Card className="p-4 bg-white">
                    <h2 className="text-sm font-semibold text-gray-900 mb-3">Order Details</h2>
                    
                    {order.isRoundTrip ? (
                        /* Full-Service (Round Trip) Layout */
                        <div className="space-y-2">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 leading-none mb-1">From</p>
                                    <p className="text-sm text-gray-900 font-medium leading-tight mb-1">My location</p>
                                    <p className="text-xs text-gray-600 leading-tight">{order.pickupLocation || '1234 Market Street, San Francisco, CA 94103'}</p>
                                </div>
                            </div>
                            
                            <div className="border-l border-gray-200 ml-3 h-2"></div>
                            
                            <div className="flex items-start gap-3">
                                <MapPin className="w-6 h-6 text-blue-500" />
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 leading-none mb-1">To</p>
                                    <p className="text-sm text-gray-900 font-medium leading-tight mb-1">
                                        {order.dropoffLocation || 'Jiffy Lube'}
                                    </p>
                                    <p className="text-xs text-gray-600 leading-tight">
                                        789 Mission Street, San Francisco, CA 94103
                                    </p>
                                    <p className="text-xs text-blue-600 font-medium mt-1">Auzo Service</p>
                                </div>
                            </div>

                            <div className="border-l border-gray-200 ml-3 h-2"></div>
                            
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 leading-none mb-1">Back to</p>
                                    <p className="text-sm text-gray-900 font-medium leading-tight mb-1">My location</p>
                                    <p className="text-xs text-gray-600 leading-tight">{order.pickupLocation || '1234 Market Street, San Francisco, CA 94103'}</p>
                                </div>
                            </div>

                            {order.vehicleInfo && (
                                <>
                                    <div className="border-t border-gray-100 pt-3 mt-4">
                                        <div className="flex items-start gap-2">
                                            <Car className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500 mb-1">Vehicle</p>
                                                <p className="text-sm text-gray-900">
                                                    {order.vehicleInfo.year} {order.vehicleInfo.make} {order.vehicleInfo.model}
                                                </p>
                                                {order.vehicleInfo.licensePlate && (
                                                    <p className="text-xs text-gray-500">{order.vehicleInfo.licensePlate}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {order.notes && (
                                <div className="border-t border-gray-100 pt-3 mt-4">
                                    <div className="flex items-start gap-2">
                                        <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 mb-1">Notes</p>
                                            <p className="text-sm text-gray-900">{order.notes}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Regular One-Way Layout */
                        <div className="space-y-3">
                            <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 mb-1">Pickup Location</p>
                                    <p className="text-sm text-gray-900">{order.pickupLocation || 'Current Location'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2">
                                <Package className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 mb-1">Destination</p>
                                    <p className="text-sm text-gray-900">{order.dropoffLocation || 'AutoZone Pro Service Center'}</p>
                                </div>
                            </div>

                            {order.vehicleInfo && (
                                <div className="flex items-start gap-2">
                                    <Car className="w-4 h-4 text-gray-400 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 mb-1">Vehicle</p>
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
                                        <p className="text-xs text-gray-500 mb-1">Notes</p>
                                        <p className="text-sm text-gray-900">{order.notes}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </Card>



                {/* Order Number */}
                <Card className="p-4 bg-white">
                    <div className="text-center">
                        <p className="text-sm text-gray-500 mb-1">Order Number</p>
                        <p className="text-xl font-bold text-gray-900">
                            #{orderId.slice(-6).toUpperCase()}
                        </p>
                    </div>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-2 pt-4">
                    {order.status === OrderStatus.CAR_DELIVERED && (
                        <Button 
                            className="w-full h-12 text-base font-semibold"
                            onClick={() => {
                                // Set order pickup flag for add-on popup
                                sessionStorage.setItem('isOrderPickup', 'true');
                                sessionStorage.removeItem('hasShownAddOnPopup'); // Reset popup flag
                                
                                // Store pickup details for later use in confirm-booking
                                sessionStorage.setItem('orderPickupDetails', JSON.stringify({
                                    vehicleId: order.vehicleInfo?.id || 'default',
                                    destination: order.pickupLocation || 'Current Location',
                                    pickupLocation: order.dropoffLocation
                                }));
                                
                                // Navigate to one-way-service to show add-on popup first
                                router.push('/one-way-service');
                            }}
                        >
                            <Package className="w-4 h-4 mr-2" />
                            Order Pickup
                        </Button>
                    )}
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