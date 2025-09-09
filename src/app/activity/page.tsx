
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Car, List, MapPin, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { transactionStorage, Transaction } from '@/lib/transaction-storage';


const ActivityPage = () => {
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        // Load transactions from storage (newest first)
        const loadedTransactions = transactionStorage.getTransactions();
        setTransactions(loadedTransactions);
    }, []);

    const handleTransactionClick = (transaction: Transaction) => {
        router.push(`/activity/${transaction.id}`);
    };

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

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <main className="flex-1 pb-24">
                <div className="p-6">
                    <h1 className="text-3xl font-bold mb-6">Activity</h1>
                    {transactions.length > 0 ? (
                        <div className="space-y-3">
                            {transactions.map((transaction) => (
                                <Card 
                                    key={transaction.id} 
                                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => handleTransactionClick(transaction)}
                                >
                                    <CardContent className="p-4">
                                        <div className="space-y-2">
                                            {/* Row 1: Location */}
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-gray-500" />
                                                <span className="font-medium text-gray-900">
                                                    {transaction.destination}
                                                </span>
                                            </div>
                                            
                                            {/* Row 2: Vehicle */}
                                            <div className="flex items-center gap-2">
                                                <Car className="w-4 h-4 text-gray-500" />
                                                <span className="text-gray-700">
                                                    {transaction.vehicle.year} {transaction.vehicle.make} {transaction.vehicle.model}
                                                </span>
                                            </div>
                                            
                                            {/* Row 3: Date/Time */}
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-gray-500" />
                                                <span className="text-gray-600">
                                                    {formatDate(transaction.timestamp)} at {formatTime(transaction.timestamp)}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center text-muted-foreground pt-24">
                            <List className="w-16 h-16 mb-4" />
                            <h2 className="text-xl font-bold">No Past Activity</h2>
                            <p className="max-w-xs mt-2">Your completed services will appear here.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ActivityPage;
