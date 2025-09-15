'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Star, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getOrder, updateOrder } from '@/lib/services/order-service';
import { Order } from '@/lib/types/order';
import { transactionStorage } from '@/lib/transaction-storage';

interface RatePageProps {
    params: Promise<{ orderId: string }>;
}

export default function RatePage({ params }: RatePageProps) {
    const router = useRouter();
    const { orderId } = use(params);
    
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState<number>(0);
    const [tipAmount, setTipAmount] = useState<number>(0);

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
            }
        } catch (error) {
            console.error('Error loading order:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRatingClick = (selectedRating: number) => {
        setRating(selectedRating);
    };

    const handleTipSelect = (amount: number) => {
        setTipAmount(amount);
    };

    const handleSubmit = async () => {
        if (!order || rating === 0) return;

        try {
            // Update the order with rating and tip information
            const updatedOrder: Order = {
                ...order,
                driverInfo: {
                    ...order.driverInfo,
                    rating,
                    tip: tipAmount > 0 ? tipAmount : undefined,
                    ratedAt: new Date().toISOString()
                }
            };

            // Update order in Firestore
            await updateOrder(orderId, updatedOrder);

            // Find and update the transaction in localStorage
            const transactions = transactionStorage.getTransactions();
            const transaction = transactions.find(t => t.orderId === orderId);
            if (transaction) {
                transactionStorage.updateTransactionRating(transaction.id, rating, tipAmount);
            }

            // Navigate back to the order page
            router.push(`/order/${orderId}`);
        } catch (error) {
            console.error('Error submitting rating:', error);
            // Still navigate back even if there's an error
            router.push(`/order/${orderId}`);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Order not found</p>
                    <Button onClick={() => router.push('/home')}>
                        Back to Home
                    </Button>
                </div>
            </div>
        );
    }

    const deliveryTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const deliveryDate = new Date().toLocaleDateString();

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white px-4 py-4 border-b flex items-center gap-3">
                <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => router.push(`/order/${orderId}`)}
                    className="p-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-lg font-semibold">Your Auzo Service</h1>
            </div>

            <div className="flex-1 p-4 space-y-6">
                {/* Service Summary */}
                <Card className="p-4 bg-white">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>Time delivered: {deliveryTime}, {deliveryDate}</span>
                        </div>
                    </div>
                </Card>

                {/* Map Placeholder */}
                <Card className="p-0 bg-white overflow-hidden">
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <MapPin className="w-12 h-12 mx-auto mb-2" />
                            <p className="text-sm">Route Map</p>
                        </div>
                    </div>
                </Card>

                {/* Rating Section */}
                <Card className="p-6 bg-white">
                    <h2 className="text-lg font-semibold mb-4 text-center">Rate Trip</h2>
                    <div className="flex justify-center gap-2 mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => handleRatingClick(star)}
                                className="p-1 transition-colors"
                            >
                                <Star 
                                    className={`w-8 h-8 ${
                                        star <= rating 
                                            ? 'text-yellow-400 fill-current' 
                                            : 'text-gray-300'
                                    }`}
                                />
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Order Details */}
                <Card className="p-4 bg-white">
                    <h2 className="text-lg font-semibold mb-4">Order Details</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Driver</span>
                            <span className="font-medium">{order.driverInfo?.name || 'John Smith'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Vehicle</span>
                            <span className="font-medium">
                                {order.vehicleInfo ? 
                                    `${order.vehicleInfo.year} ${order.vehicleInfo.make} ${order.vehicleInfo.model}` :
                                    '2023 Honda Civic'
                                }
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">From</span>
                            <span className="font-medium text-right">{order.pickupLocation || 'Current Location'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">To</span>
                            <span className="font-medium text-right">{order.dropoffLocation || 'AutoZone Pro Service Center'}</span>
                        </div>
                    </div>
                </Card>

                {/* Tip Section */}
                <Card className="p-4 bg-white">
                    <h2 className="text-lg font-semibold mb-4">Add Tip (Optional)</h2>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                        {[5, 10, 15, 20].map((amount) => (
                            <Button
                                key={amount}
                                variant={tipAmount === amount ? "default" : "outline"}
                                onClick={() => handleTipSelect(amount)}
                                className="text-sm"
                            >
                                ${amount}
                            </Button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Custom amount"
                            value={tipAmount > 20 ? tipAmount : ''}
                            onChange={(e) => setTipAmount(Number(e.target.value) || 0)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                        <span className="flex items-center text-gray-500 text-sm">USD</span>
                    </div>
                </Card>

                {/* Submit Button */}
                <div className="pb-6">
                    <Button 
                        className="w-full h-12 text-base font-semibold"
                        onClick={handleSubmit}
                        disabled={rating === 0}
                    >
                        {tipAmount > 0 ? `Submit Rating & Tip $${tipAmount}` : 'Submit Rating'}
                    </Button>
                </div>
            </div>
        </div>
    );
}