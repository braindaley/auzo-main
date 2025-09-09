
"use client";

import { Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Car, MapPin, Wrench, RefreshCw, Clock } from 'lucide-react';
import { format } from 'date-fns';

function ReviewDetailsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const ride = 'Standard'; // Removed priority selection
    const service = searchParams.get('service') || 'Not selected';
    const pickup = searchParams.get('pickup') || 'Current Location';
    const destination = searchParams.get('destination') || 'Jiffy Lube, Costa Mesa';
    const serviceType = searchParams.get('serviceType');
    
    const date = searchParams.get('date');
    const time = searchParams.get('time');
    
    const ridePrice = parseFloat(searchParams.get('ridePrice') || '15.86');
    const servicePrice = parseFloat(searchParams.get('servicePrice') || '85.00');
    
    const isOilChangeService = service?.toLowerCase().includes('oil change');

    const totalPrice = ridePrice + servicePrice;

    const getScheduleText = () => {
        if (date && time) {
            try {
                return `${format(new Date(date), 'MMM d, yyyy')} at ${time}`;
            } catch (e) {
                 return 'Invalid Date';
            }
        }
        return 'Pickup Now';
    };

    const getServiceTypeText = () => {
        if (serviceType === 'roundtrip' || isOilChangeService) {
            return 'Round-trip';
        }
        return 'One Way';
    }

    const handleConfirm = useCallback(() => {
        const queryParams = new URLSearchParams(searchParams.toString());
        queryParams.set('totalPrice', totalPrice.toFixed(2));
        queryParams.set('servicePrice', servicePrice.toFixed(2));
        queryParams.set('ridePrice', ridePrice.toFixed(2));
        router.push(`/checkout?${queryParams.toString()}`);
    }, [router, searchParams, totalPrice, servicePrice, ridePrice]);

    return (
        <div className="w-full max-w-lg mx-auto p-4 md:p-8">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="mr-2" />
                Back
            </Button>
            <Card className="w-full shadow-lg">
                <CardHeader className="text-center items-center">
                    <CardTitle className="text-3xl">Review Your Details</CardTitle>
                    <CardDescription>Please confirm your selections before payment.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="border-t border-b divide-y">
                         <div className="flex items-center justify-between p-4">
                            <div className="flex items-center">
                                <Wrench className="w-5 h-5 mr-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Service</p>
                                    <p className="font-semibold">{service}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center p-4">
                            <RefreshCw className="w-5 h-5 mr-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Service Type</p>
                                <p className="font-semibold">{getServiceTypeText()}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4">
                             <div className="flex items-center">
                                <Car className="w-5 h-5 mr-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Priority</p>
                                    <p className="font-semibold">{ride}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center p-4">
                            <MapPin className="w-5 h-5 mr-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Route</p>
                                <p className="font-semibold">{pickup} to {destination}</p>
                            </div>
                        </div>
                        <div className="flex items-center p-4">
                            <Calendar className="w-5 h-5 mr-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Date & Time</p>
                                <p className="font-semibold">{getScheduleText()}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
                 <CardFooter className="flex-col items-stretch space-y-4 pt-4">
                     <div className="flex justify-between items-center text-lg font-bold p-4 bg-muted rounded-lg">
                        <span>Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <Button onClick={handleConfirm} className="w-full h-12 text-lg">
                        Confirm and Proceed to Payment
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default function ReviewDetailsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header isTransparent={false} />
            <main className="flex-1 flex flex-col items-center justify-center">
                <Suspense fallback={<div>Loading details...</div>}>
                    <ReviewDetailsContent />
                </Suspense>
            </main>
        </div>
    );
}
