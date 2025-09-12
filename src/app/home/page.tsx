
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, Droplet, Wrench, Gauge, Cog, Sparkles, PaintBucket, Settings, Search, Calendar, Fuel, Waves, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { transactionStorage, Transaction } from '@/lib/transaction-storage';
import { OrderStatus, OrderStatusLabels } from '@/lib/types/order';

const personalServices: Array<{
    name: string;
    icon: React.ComponentType<any>;
    href: string;
    description?: string;
}> = [];

const additionalServices = [
    { name: "Quick Lube", icon: Droplet, href: "/service-explanation?service=quick%20lube" },
    { name: "Car Wash", icon: Waves, href: "/service-explanation?service=car%20wash" },
    { name: "Fuel Fill", icon: Fuel, href: "/service-explanation?service=fuel%20fill" },
    { name: "Dealer Service Center", icon: Car, href: "/service-explanation?service=dealer%20service%20center" },
    { name: "Tire & Wheel Service", icon: Cog, href: "/service-explanation?service=tire%20%26%20wheel%20service" },
    { name: "Brake & Muffler Service", icon: Gauge, href: "/service-explanation?service=brake%20%26%20muffler%20service" },
    { name: "Transmission Service", icon: Settings, href: "/service-explanation?service=transmission%20service" },
    { name: "Body & Glass Service", icon: PaintBucket, href: "/service-explanation?service=body%20%26%20glass%20service" },
    { name: "General Repair Service", icon: Wrench, href: "/service-explanation?service=general%20repair%20service" }
];

const HomePage = () => {
    const [pickupTime, setPickupTime] = useState<'now' | 'later'>('now');
    const [latestTransaction, setLatestTransaction] = useState<Transaction | null>(null);
    const router = useRouter();

    const loadLatestTransaction = () => {
        const transactions = transactionStorage.getTransactions();
        console.log('All transactions:', transactions);
        if (transactions.length > 0) {
            console.log('Latest transaction:', transactions[0]);
            setLatestTransaction(transactions[0]);
        }
    };

    // Temporary helper to clear all transactions for testing
    const clearAllTransactions = () => {
        transactionStorage.clearTransactions();
        setLatestTransaction(null);
        console.log('All transactions cleared');
    };

    useEffect(() => {
        // Load the latest transaction from storage on every mount
        loadLatestTransaction();

        // Set up an interval to periodically refresh (every 2 seconds)
        const interval = setInterval(() => {
            loadLatestTransaction();
        }, 2000);

        // Refresh transaction data when window gets focus (user returns to page)
        const handleFocus = () => {
            loadLatestTransaction();
        };

        window.addEventListener('focus', handleFocus);
        
        // Also listen for storage events in case data changes in another tab
        const handleStorage = () => {
            loadLatestTransaction();
        };
        
        window.addEventListener('storage', handleStorage);

        return () => {
            clearInterval(interval);
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('storage', handleStorage);
        };
    }, []);

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit' 
        });
    };

    const getStatusBadgeVariant = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.SCHEDULED:
                return 'outline';
            case OrderStatus.FINDING_DRIVER:
                return 'secondary';
            case OrderStatus.DRIVER_ON_WAY:
                return 'secondary';
            case OrderStatus.CAR_IN_TRANSIT:
                return 'secondary';
            case OrderStatus.CAR_DELIVERED:
                return 'default';
            case OrderStatus.CANCELLED:
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const getStatusLabel = (status: OrderStatus) => {
        return OrderStatusLabels[status];
    };

    const handleTransactionClick = (transaction: Transaction) => {
        console.log('Clicking transaction:', {
            transactionId: transaction.id,
            orderId: transaction.orderId,
            status: transaction.status
        });
        
        // If transaction has an orderId, link to the order page, otherwise use activity page
        if (transaction.orderId) {
            router.push(`/order/${transaction.orderId}`);
        } else {
            router.push(`/activity/${transaction.id}?from=home`);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div className="mt-4">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Deliver your car</label>
                    <div className="relative">
                        <Link href={`/deliver?pickup=${pickupTime}`} className="no-underline">
                            <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg p-3 gap-3 cursor-pointer hover:bg-gray-100 transition-colors">
                                <Search className="w-5 h-5 text-gray-400" />
                                <span className="flex-1 text-gray-400">Where to?</span>
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setPickupTime(pickupTime === 'now' ? 'later' : 'now');
                                    }}
                                    className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors"
                                >
                                    <Calendar className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm text-gray-700">
                                        {pickupTime === 'now' ? 'Now' : 'Later'}
                                    </span>
                                </button>
                            </div>
                        </Link>
                    </div>
                </div>
                
                {latestTransaction && (
                    <div className="mt-6">
                        <div className="mb-4">
                            <h2 className="heading-2">Latest Order</h2>
                        </div>
                        <Card className="hover:bg-gray-50 transition-colors">
                            <CardContent className="p-3 relative">
                                {/* Order Pickup CTA for completed orders - Top Right */}
                                {latestTransaction.status === OrderStatus.CAR_DELIVERED && !latestTransaction.isRoundTrip && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Navigate to confirm-booking with reversed locations
                                            const searchParams = new URLSearchParams({
                                                vehicleId: latestTransaction.vehicle.id,
                                                destination: latestTransaction.pickupLocation,
                                                pickupLocation: latestTransaction.destination
                                            });
                                            router.push(`/confirm-booking?${searchParams.toString()}`);
                                        }}
                                        className="absolute top-2 right-2 bg-black hover:bg-gray-800 text-white text-[10px] py-1 px-2 rounded text-center transition-colors"
                                    >
                                        Order Pickup
                                    </button>
                                )}
                                
                                <div 
                                    className="space-y-1 cursor-pointer pr-20"
                                    onClick={() => handleTransactionClick(latestTransaction)}
                                >
                                    {/* Row 1: Status Badge */}
                                    <div className="flex items-center">
                                        <Badge variant={getStatusBadgeVariant(latestTransaction.status)} className="text-xs py-0 px-2">
                                            {getStatusLabel(latestTransaction.status)}
                                        </Badge>
                                    </div>
                                    
                                    {/* Row 2: Location */}
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-3 h-3 text-gray-500" />
                                        <span className="text-sm font-medium text-gray-900">
                                            {latestTransaction.destination}
                                        </span>
                                    </div>
                                    
                                    {/* Row 3: Date/Time */}
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-3 h-3 text-gray-500" />
                                        <span className="text-xs text-gray-600">
                                            {formatDate(latestTransaction.timestamp)} at {formatTime(latestTransaction.timestamp)}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
                
                <div className="mt-6">
                    <h2 className="heading-2 mb-4">Services</h2>
                    <div className="grid grid-cols-4 gap-3">
                        {additionalServices.map((service) => (
                            service.href ? (
                                <Link key={service.name} href={service.href} style={{ textDecoration: 'none' }}>
                                    <button className="w-full h-full min-h-[100px] flex flex-col items-center justify-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                        <service.icon className="w-8 h-8 text-gray-700 mb-2" />
                                        <p className="text-xs text-center text-gray-600 leading-tight">{service.name}</p>
                                    </button>
                                </Link>
                            ) : (
                                <button key={service.name} className="w-full h-full min-h-[100px] flex flex-col items-center justify-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                    <service.icon className="w-8 h-8 text-gray-700 mb-2" />
                                    <p className="text-xs text-center text-gray-600 leading-tight">{service.name}</p>
                                </button>
                            )
                        ))}
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="heading-2 mb-4">Promotions</h2>
                    <Card className="bg-white hover:bg-gray-50 transition-colors border">
                        <CardContent className="p-0">
                            {/* Promotional Image */}
                            <div className="h-32 bg-gray-200 rounded-t-lg flex items-center justify-center">
                                <div className="text-gray-600 text-center">
                                    <Droplet className="w-12 h-12 mx-auto mb-2 opacity-80" />
                                    <p className="text-sm font-medium">Oil Change Special</p>
                                </div>
                            </div>
                            
                            {/* Promotion Details */}
                            <div className="p-4 space-y-1">
                                <p className="text-lg font-bold text-gray-900">$10 off Oil Change</p>
                                <p className="text-sm text-gray-700 font-medium">Oilstop</p>
                                <p className="text-sm text-gray-600">33-Points Service</p>
                                <p className="text-xs text-gray-500">Round Trip Auzo Service Included</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-[10px] mt-8">
                    {personalServices.map((service) => (
                        <Link href={service.href} key={service.name} passHref>
                            <Card className="bg-card hover:bg-muted/80 transition-colors h-full border">
                                <CardContent className="p-6 flex items-center gap-6">
                                    <service.icon className="w-10 h-10 text-primary" />
                                    <div>
                                        <p className="heading-3">{service.name}</p>
                                        {service.description && (
                                            <p className="body-small text-muted-foreground">{service.description}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
        </div>
    );
};

export default HomePage;
