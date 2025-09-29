"use client";

import { useState, useEffect, use } from 'react';
import { ArrowLeft, MapPin, Car, Clock, DollarSign, User, Phone, Wrench, Settings, PaintBucket, Gauge, CircleDot, X, Star, Calendar as CalendarIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { transactionStorage, Transaction } from '@/lib/transaction-storage';
import { OrderStatus, OrderStatusLabels } from '@/lib/types/order';

interface TransactionDetailPageProps {
    params: Promise<{ id: string }>;
}

export default function TransactionDetailPage({ params }: TransactionDetailPageProps) {
    const { id } = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false);
    const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const timeSlots = [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
        '04:00 PM', '04:30 PM'
    ];

    const from = searchParams.get('from') || 'activity';
    
    const getBackPath = () => {
        switch (from) {
            case 'home':
                return '/home';
            case 'garage':
                return '/garage';
            case 'activity':
            default:
                return '/activity';
        }
    };

    useEffect(() => {
        const loadedTransaction = transactionStorage.getTransactionById(id);
        setTransaction(loadedTransaction);
    }, [id]);

    const handleStatusClick = () => {
        if (!transaction) return;
        
        const statusOrder: Array<OrderStatus> = [OrderStatus.SCHEDULED, OrderStatus.FINDING_DRIVER, OrderStatus.DRIVER_ON_WAY, OrderStatus.CAR_IN_TRANSIT, OrderStatus.CAR_DELIVERED];
        const currentIndex = statusOrder.indexOf(transaction.status);
        const nextIndex = (currentIndex + 1) % statusOrder.length;
        const nextStatus = statusOrder[nextIndex];
        
        // Update the transaction with new status
        const updatedTransaction: Transaction = {
            ...transaction,
            status: nextStatus
        };
        
        // Update in storage
        transactionStorage.updateTransaction(id, updatedTransaction);
        
        // Update local state
        setTransaction(updatedTransaction);
    };

    const handleCancelTransaction = () => {
        if (!transaction) return;

        // Close dialog
        setShowCancelDialog(false);

        // Cancel the transaction
        transactionStorage.cancelTransaction(id);

        // Update local state
        const updatedTransaction: Transaction = {
            ...transaction,
            status: OrderStatus.CANCELLED
        };
        setTransaction(updatedTransaction);
    };

    const handleRescheduleTransaction = () => {
        if (!transaction || !selectedDate || !selectedTime) return;

        const formattedDate = selectedDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });

        // Update the transaction with new schedule
        const updatedTransaction: Transaction = {
            ...transaction,
            scheduledDate: formattedDate,
            scheduledTime: selectedTime
        };

        // Update in storage
        transactionStorage.updateTransaction(id, updatedTransaction);

        // Close dialog and update local state
        setShowRescheduleDialog(false);
        setTransaction(updatedTransaction);
        setSelectedDate(undefined);
        setSelectedTime(null);
    };

    if (!transaction) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <div className="border-b bg-white px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Link href={getBackPath()} className="p-1">
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

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.SCHEDULED: return 'text-purple-600 bg-purple-50';
            case OrderStatus.FINDING_DRIVER: return 'text-blue-600 bg-blue-50';
            case OrderStatus.DRIVER_ON_WAY: return 'text-green-600 bg-green-50';
            case OrderStatus.CAR_IN_TRANSIT: return 'text-orange-600 bg-orange-50';
            case OrderStatus.CAR_DELIVERED: return 'text-green-700 bg-green-100';
            case OrderStatus.CANCELLED: return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getStatusText = (status: OrderStatus) => {
        return OrderStatusLabels[status];
    };

    const getServiceIcon = (serviceType: string | undefined) => {
        if (!serviceType) return Wrench;
        
        const serviceLower = serviceType.toLowerCase();
        if (serviceLower.includes('dealer')) return Car;
        if (serviceLower.includes('tire') || serviceLower.includes('wheel')) return CircleDot;
        if (serviceLower.includes('brake') || serviceLower.includes('muffler')) return Gauge;
        if (serviceLower.includes('transmission')) return Settings;
        if (serviceLower.includes('body') || serviceLower.includes('glass')) return PaintBucket;
        return Wrench;
    };

    const formatServiceType = (specificServiceType: string | undefined) => {
        if (!specificServiceType) return null;
        return specificServiceType.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="border-b bg-white px-4 py-4">
                <div className="flex items-center gap-4">
                    <Link href={getBackPath()} className="p-1">
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

                {/* Service Information */}
                {transaction.specificServiceType && (
                    <Card className="p-4 bg-white">
                        <div className="flex items-start gap-3">
                            {(() => {
                                const ServiceIcon = getServiceIcon(transaction.specificServiceType);
                                return <ServiceIcon className="w-6 h-6 text-gray-600" />;
                            })()}
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 leading-none mb-0.5">Service Type</p>
                                <p className="text-sm text-gray-900 font-medium leading-tight">
                                    {formatServiceType(transaction.specificServiceType)}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5 capitalize">
                                    {transaction.serviceType}
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Route Information */}
                <Card className="p-4 bg-white">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-semibold text-gray-900">Route</h2>
                        {transaction.isRoundTrip && (
                            <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">
                                Round Trip
                            </span>
                        )}
                    </div>
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
                                <p className="text-xs text-gray-500 leading-none mb-0.5">
                                    {transaction.isRoundTrip ? 'Service Location' : 'To'}
                                </p>
                                <p className="text-sm text-gray-900 font-medium leading-tight">
                                    {transaction.destination}
                                    {(transaction.status === 'completed' || transaction.status === 'in_progress') && (
                                        <span className="block text-xs text-gray-500 mt-0.5">
                                            789 Commerce Way, Phoenix, AZ 85004
                                        </span>
                                    )}
                                </p>
                                {transaction.isRoundTrip && (
                                    <p className="text-xs text-blue-600 font-medium mt-1">
                                        Auzo Service - Return trip included
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Show return trip for round trip bookings */}
                        {transaction.isRoundTrip && (
                            <>
                                <div className="border-l border-gray-200 ml-3 h-2"></div>
                                
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 leading-none mb-0.5">Back to</p>
                                        <p className="text-sm text-gray-900 font-medium leading-tight">
                                            {transaction.status === 'completed' 
                                                ? '1234 Main Street, Phoenix, AZ 85001' 
                                                : transaction.pickupLocation}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
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

                {/* Rating and Tip Information (if available) */}
                {transaction.rating && (
                    <Card className="p-4 bg-white">
                        <h2 className="text-sm font-semibold text-gray-900 mb-3">Your Rating</h2>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star 
                                            key={star}
                                            className={`w-4 h-4 ${
                                                star <= transaction.rating! 
                                                    ? 'text-yellow-400 fill-current' 
                                                    : 'text-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-semibold text-gray-900">
                                    {transaction.rating}.0
                                </span>
                            </div>
                            {transaction.tip && transaction.tip > 0 && (
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-900">
                                        Tip: <span className="font-semibold">${transaction.tip.toFixed(2)}</span>
                                    </span>
                                </div>
                            )}
                            {transaction.ratedAt && (
                                <p className="text-xs text-gray-500">
                                    Rated on {new Date(transaction.ratedAt).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </Card>
                )}

                {/* Support Link */}
                <div className="text-center py-2">
                    <p className="text-sm text-gray-600">
                        Need help?{' '}
                        <Link href="/account/support" className="text-blue-600 hover:text-blue-700 font-medium">
                            Contact support
                        </Link>
                    </p>
                </div>

                {/* Service Cost Information (for full-service orders) */}
                {transaction.serviceType === 'full service' && transaction.specificServiceType && (
                    <Card className="p-4 bg-white">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-start gap-3">
                                    <DollarSign className="w-6 h-6 text-gray-600" />
                                    <div>
                                        <p className="text-xs text-gray-500 leading-none mb-0.5">Delivery Fee</p>
                                        <p className="text-sm text-gray-900 font-medium leading-tight">Round trip service</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-semibold text-gray-900">$14.90</p>
                                </div>
                            </div>
                            
                            <div className="border-t pt-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start gap-3">
                                        {(() => {
                                            const ServiceIcon = getServiceIcon(transaction.specificServiceType);
                                            return <ServiceIcon className="w-6 h-6 text-gray-600" />;
                                        })()}
                                        <div>
                                            <p className="text-xs text-gray-500 leading-none mb-0.5">Service</p>
                                            <p className="text-sm text-gray-900 font-medium leading-tight">
                                                {formatServiceType(transaction.specificServiceType)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-semibold text-gray-900">$70.00</p>
                                    </div>
                                </div>
                            </div>
                            
                            {transaction.tip && transaction.tip > 0 && (
                                <div className="border-t pt-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className="w-6" />
                                            <div>
                                                <p className="text-xs text-gray-500 leading-none mb-0.5">Driver tip</p>
                                                <p className="text-sm text-gray-900 font-medium leading-tight">Thank you!</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-semibold text-gray-900">${transaction.tip.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div className="border-t pt-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6" />
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Total</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-gray-900">
                                            ${(84.90 + (transaction.tip || 0)).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Regular Cost Information (for non-full-service orders) */}
                {transaction.serviceType !== 'full service' && (
                    <Card className="p-4 bg-white">
                        <div className="flex items-start gap-3">
                            <DollarSign className="w-6 h-6 text-gray-600" />
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 leading-none mb-2">Service Cost</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-gray-900 font-medium">{transaction.serviceType}</p>
                                        <p className="text-sm font-semibold text-gray-900">${transaction.cost.toFixed(2)}</p>
                                    </div>
                                    {transaction.tip && transaction.tip > 0 && (
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-gray-700">Driver tip</p>
                                            <p className="text-sm font-semibold text-gray-900">${transaction.tip.toFixed(2)}</p>
                                        </div>
                                    )}
                                    {transaction.tip && transaction.tip > 0 && (
                                        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                            <p className="text-sm font-semibold text-gray-900">Total</p>
                                            <p className="text-xl font-bold text-gray-900">${(transaction.cost + transaction.tip).toFixed(2)}</p>
                                        </div>
                                    )}
                                    {(!transaction.tip || transaction.tip === 0) && (
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-gray-900">${transaction.cost.toFixed(2)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Action Buttons */}
                {(transaction.status === 'scheduled' || transaction.status === 'requested') && (
                    <div className="pt-4 space-y-2">
                        {transaction.status === 'scheduled' && transaction.isScheduled && (
                            <Button
                                variant="outline"
                                className="w-full h-12 text-base font-semibold"
                                onClick={() => setShowRescheduleDialog(true)}
                            >
                                <CalendarIcon className="w-4 h-4 mr-2" />
                                Reschedule
                            </Button>
                        )}
                        <Button
                            className="w-full h-12 text-base"
                            variant="destructive"
                            onClick={() => setShowCancelDialog(true)}
                        >
                            <X className="w-4 h-4 mr-2" />
                            Cancel Service
                        </Button>
                    </div>
                )}
            </div>

            {/* Cancel Service Dialog */}
            <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <AlertDialogContent className="max-w-[356px] max-h-[calc(100vh-2rem)] w-full mx-4">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Service</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to cancel this service? This action cannot be undone and you'll need to create a new order if you change your mind.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Keep Service</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleCancelTransaction}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            Cancel Service
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Reschedule Dialog */}
            <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
                <DialogContent className="max-w-[400px] max-h-[calc(100vh-2rem)] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Reschedule Service</DialogTitle>
                        <DialogDescription>
                            Choose a new date and time for your service
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <p className="text-sm font-medium mb-2">Current Schedule</p>
                            <p className="text-sm text-gray-600">
                                {transaction.scheduledDate} at {transaction.scheduledTime}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium mb-2">Select New Date</p>
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                className="rounded-md border"
                                disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                            />
                        </div>
                        <div>
                            <p className="text-sm font-medium mb-2">Select New Time</p>
                            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                                {timeSlots.map(time => (
                                    <Button
                                        key={time}
                                        variant={selectedTime === time ? "default" : "outline"}
                                        onClick={() => setSelectedTime(time)}
                                        className="text-xs"
                                    >
                                        {time}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRescheduleDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRescheduleTransaction}
                            disabled={!selectedDate || !selectedTime}
                        >
                            Confirm Reschedule
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}