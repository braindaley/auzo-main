
"use client";

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Car, MapPin, Wrench, RefreshCw, Pencil, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';


function TimelineGraphic() {
    return (
        <div className="p-4 bg-muted rounded-lg">
            <h4 className="text-md font-semibold text-center mb-4">Estimated Timeline</h4>
            <div className="flex items-start w-full text-center">
                <div className="flex flex-col items-center w-1/4">
                    <div className="w-8 h-8 mb-2 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Clock className="w-5 h-5"/></div>
                    <p className="text-xs font-semibold">Pickup</p>
                    <p className="text-xs text-muted-foreground">Now</p>
                </div>
                <div className="flex-1 h-0.5 bg-primary/50 mt-4"></div>
                <div className="flex flex-col items-center w-1/4">
                    <div className="w-8 h-8 mb-2 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Wrench className="w-5 h-5"/></div>
                    <p className="text-xs font-semibold">Servicing</p>
                    <p className="text-xs text-muted-foreground">~1 hr</p>
                </div>
                <div className="flex-1 h-0.5 bg-primary/50 mt-4"></div>
                <div className="flex flex-col items-center w-1/4">
                    <div className="w-8 h-8 mb-2 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><CheckCircle className="w-5 h-5"/></div>
                    <p className="text-xs font-semibold">Return</p>
                    <p className="text-xs text-muted-foreground">~1.5 hours</p>
                </div>
            </div>
        </div>
    )
}

function ReviewDetailsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Location
    const pickup = searchParams.get('pickup') || 'N/A';
    const destination = searchParams.get('destination') || 'N/A';
    const returnLocation = searchParams.get('returnLocation');

    // Vehicle
    const year = searchParams.get('year');
    const make = searchParams.get('make');
    const model = searchParams.get('model');
    const vehicle = year && make && model ? `${year} ${make} ${model}` : 'N/A';

    // Schedule & Type
    const serviceType = searchParams.get('serviceType');
    const scheduleOption = searchParams.get('scheduleOption');
    const moreThanOneHour = searchParams.get('moreThanOneHour');
    const date = searchParams.get('date');
    const time = searchParams.get('time');

    const getScheduleText = () => {
        if (scheduleOption === 'later' && date && time) {
            try {
                return `${format(new Date(date), 'MMM d, yyyy')} at ${time}`;
            } catch (e) {
                return 'Invalid Date';
            }
        }
        return 'Transport Now';
    };

    const getServiceTypeText = () => {
        if (serviceType === 'roundtrip') {
            return 'Round-trip';
        }
        return 'One-Way';
    }
    
    const handleEdit = (step: 'locations' | 'vehicle' | 'schedule') => {
        const queryParams = new URLSearchParams(searchParams.toString());
        let path = '/transport';
        if (step === 'vehicle') path = '/transport/vehicle';
        if (step === 'schedule') path = '/transport/schedule';
        router.push(`${path}?${queryParams.toString()}`);
    }

    const handleConfirm = () => {
        const queryParams = new URLSearchParams(searchParams.toString());
        router.push(`/transport/payment?${queryParams.toString()}`);
    };

    const price = serviceType === 'roundtrip' ? 100.00 : 50.00;

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header>
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft />
                </Button>
            </Header>
            <main className="flex-1 flex flex-col p-4 md:p-8 pb-24">
                <div className="flex-1 flex flex-col">
                    <div className="w-full max-w-md mx-auto space-y-6">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold">Review Your Details</h1>
                            <p className="text-muted-foreground">Please confirm your selections before payment.</p>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center">
                                    <MapPin className="w-5 h-5 mr-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Route</p>
                                        <p className="font-semibold">{pickup} to {destination}</p>
                                        {returnLocation && <p className="font-semibold text-sm">Return to: {returnLocation}</p>}
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleEdit('locations')}><Pencil className="w-4 h-4" /></Button>
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center">
                                    <Calendar className="w-5 h-5 mr-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Date & Time</p>
                                        <p className="font-semibold">{getScheduleText()}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleEdit('schedule')}><Pencil className="w-4 h-4" /></Button>
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                 <div className="flex items-center">
                                    <RefreshCw className="w-5 h-5 mr-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Transport Type</p>
                                        <p className="font-semibold">{getServiceTypeText()}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleEdit('schedule')}><Pencil className="w-4 h-4" /></Button>
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center">
                                    <Car className="w-5 h-5 mr-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Vehicle</p>
                                        <p className="font-semibold">{vehicle}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleEdit('vehicle')}><Pencil className="w-4 h-4" /></Button>
                            </div>
                        </div>
                        
                         {serviceType === 'roundtrip' && moreThanOneHour === 'no' && (
                            <TimelineGraphic />
                        )}
                        
                        <div className="flex justify-between items-center text-lg font-bold p-4 bg-muted rounded-lg">
                            <span>Total</span>
                            <span>${price.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </main>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
                <div className="w-full max-w-md mx-auto px-8">
                    <Button onClick={handleConfirm} className="w-full h-12 text-lg">
                        Confirm and Proceed to Payment
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default function ReviewDetailsPage() {
    return (
        <Suspense fallback={<div>Loading details...</div>}>
            <ReviewDetailsContent />
        </Suspense>
    );
}
