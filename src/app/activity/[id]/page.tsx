"use client";

import { useState, useEffect, use } from 'react';
import { ArrowLeft, MapPin, Car, Clock, DollarSign, User, Phone } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { transactionStorage, Transaction } from '@/lib/transaction-storage';

interface TransactionDetailPageProps {
    params: Promise<{ id: string }>;
}

export default function TransactionDetailPage({ params }: TransactionDetailPageProps) {
    const { id } = use(params);
    const [transaction, setTransaction] = useState<Transaction | null>(null);

    useEffect(() => {
        const loadedTransaction = transactionStorage.getTransactionById(id);
        setTransaction(loadedTransaction);
    }, [id]);

    const handleStatusClick = () => {
        if (!transaction) return;
        
        const statusOrder = ['requested', 'matched', 'in_progress', 'completed'];
        const currentIndex = statusOrder.indexOf(transaction.status);
        const nextIndex = (currentIndex + 1) % statusOrder.length;
        const nextStatus = statusOrder[nextIndex];
        
        // Update the transaction with new status
        const updatedTransaction = {
            ...transaction,
            status: nextStatus
        };
        
        // Update in storage
        transactionStorage.updateTransaction(id, updatedTransaction);
        
        // Update local state
        setTransaction(updatedTransaction);
    };

    if (!transaction) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <div className="border-b bg-white px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Link href="/activity" className="p-1">
                            <ArrowLeft className="w-6 h-6 text-gray-600" />
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-lg font-semibold text-gray-900">Transaction Not Found</h1>
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-500">Transaction not found</p>
                </div>
            </div>
        );
    }

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long', 
            day: 'numeric' 
        });
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit' 
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'requested': return 'text-blue-600 bg-blue-50';
            case 'matched': return 'text-green-600 bg-green-50';
            case 'in_progress': return 'text-orange-600 bg-orange-50';
            case 'completed': return 'text-green-700 bg-green-100';
            case 'cancelled': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'requested': return 'Driver Requested';
            case 'matched': return 'Driver Matched';
            case 'in_progress': return 'In Progress';
            case 'completed': return 'Completed';
            case 'cancelled': return 'Cancelled';
            default: return status;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="border-b bg-white px-4 py-4">
                <div className="flex items-center gap-4">
                    <Link href="/activity" className="p-1">
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-lg font-semibold text-gray-900">Trip Details</h1>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Order Info */}
                <Card className="p-4 bg-white">
                    <div className="space-y-3">
                        <div 
                            className={`px-3 py-1 rounded-full text-sm font-medium inline-block cursor-pointer transition-opacity hover:opacity-80 ${getStatusColor(transaction.status)}`}
                            onClick={handleStatusClick}
                        >
                            {getStatusText(transaction.status)}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Order #{transaction.orderNumber}</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {formatDate(transaction.timestamp)}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Route Information */}
                <Card className="p-4 bg-white">
                    <h2 className="text-sm font-semibold text-gray-900 mb-3">Route</h2>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 flex items-center justify-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 leading-none mb-0.5">From</p>
                                <p className="text-sm text-gray-900 font-medium leading-tight">
                                    {transaction.status === 'completed' 
                                        ? '1234 Main Street, Phoenix, AZ 85001' 
                                        : transaction.pickupLocation}
                                </p>
                            </div>
                        </div>
                        
                        <div className="border-l border-gray-200 ml-3 h-2"></div>
                        
                        <div className="flex items-start gap-3">
                            <MapPin className="w-6 h-6 text-blue-500" />
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 leading-none mb-0.5">To</p>
                                <p className="text-sm text-gray-900 font-medium leading-tight">
                                    {transaction.destination}
                                    {(transaction.status === 'completed' || transaction.status === 'in_progress') && (
                                        <span className="block text-xs text-gray-500 mt-0.5">
                                            789 Commerce Way, Phoenix, AZ 85004
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Vehicle Information */}
                <Card className="p-4 bg-white">
                    <div className="flex items-start gap-3">
                        <Car className="w-6 h-6 text-gray-600" />
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 leading-none mb-0.5">Vehicle</p>
                            <p className="text-sm text-gray-900 font-medium leading-tight">
                                {transaction.vehicle.year} {transaction.vehicle.make} {transaction.vehicle.model}
                            </p>
                            <p className="text-sm text-gray-500">{transaction.vehicle.color}</p>
                        </div>
                    </div>
                </Card>

                {/* Timing Information */}
                <Card className="p-4 bg-white">
                    <div className="flex items-start gap-3">
                        <Clock className="w-6 h-6 text-gray-600" />
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 leading-none mb-0.5">Pickup Time</p>
                            <p className="text-sm text-gray-900 font-medium leading-tight">
                                {transaction.isScheduled 
                                    ? `${transaction.scheduledDate} at ${transaction.scheduledTime}`
                                    : 'ASAP'
                                }
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Requested: {formatTime(transaction.timestamp)}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Driver Information (if available) */}
                {transaction.driverName && (
                    <Card className="p-4 bg-white">
                        <h2 className="text-sm font-semibold text-gray-900 mb-3">Driver</h2>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-900">{transaction.driverName}</span>
                            </div>
                            {transaction.driverPhone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-900">{transaction.driverPhone}</span>
                                </div>
                            )}
                            {transaction.estimatedArrival && (
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-900">ETA: {transaction.estimatedArrival}</span>
                                </div>
                            )}
                        </div>
                    </Card>
                )}

                {/* Cost Information */}
                <Card className="p-4 bg-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                            <DollarSign className="w-6 h-6 text-gray-600" />
                            <div>
                                <p className="text-xs text-gray-500 leading-none mb-0.5">Service Cost</p>
                                <p className="text-sm text-gray-900 font-medium leading-tight">{transaction.serviceType}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold text-gray-900">${transaction.cost.toFixed(2)}</p>
                        </div>
                    </div>
                </Card>

                {/* Action Buttons */}
                {transaction.status === 'requested' && (
                    <div className="pt-4">
                        <Button 
                            className="w-full h-12 text-base font-semibold mb-2"
                            variant="outline"
                        >
                            Track Order
                        </Button>
                        <Button 
                            className="w-full h-12 text-base"
                            variant="outline"
                        >
                            Cancel Order
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}