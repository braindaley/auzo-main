
"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { ArrowLeft } from 'lucide-react';

const allTimeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM'
];


function ScheduleDateContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [pickupDate, setPickupDate] = useState<Date | undefined>();
    const [pickupTime, setPickupTime] = useState<string | null>(null);

    const handleContinue = () => {
        if (pickupDate && pickupTime) {
            const queryParams = new URLSearchParams(searchParams.toString());
            queryParams.set('pickupDate', pickupDate.toISOString());
            queryParams.set('pickupTime', pickupTime);
            queryParams.set('date', pickupDate.toISOString()); // For compatibility with review page
            queryParams.set('time', pickupTime); // For compatibility with review page
            
            const destinationPage = searchParams.has('year') ? '/transport/review' : '/review-details';
            router.push(`${destinationPage}?${queryParams.toString()}`);
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
             <Header>
                <Button variant="ghost" size="icon" onClick={() => {
                    const queryParams = new URLSearchParams(searchParams.toString());
                    if (queryParams.has('year')) {
                        router.push(`/transport/vehicle?${queryParams.toString()}`);
                    } else {
                        router.push('/select-vehicle');
                    }
                }}>
                    <ArrowLeft />
                </Button>
            </Header>
            <main className="flex-1 flex flex-col p-4 md:p-8">
                <div className="w-full max-w-sm mx-auto flex flex-col flex-1 justify-center space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center text-xl">Select Pickup Time</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Calendar
                                mode="single"
                                selected={pickupDate}
                                onSelect={(date) => {
                                    setPickupDate(date);
                                    setPickupTime(null); // Reset time when date changes
                                }}
                                className="rounded-md border"
                                disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                            />
                             <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {allTimeSlots.map(time => (
                                    <Button 
                                        key={time}
                                        variant={pickupTime === time ? "default" : "outline"}
                                        onClick={() => {
                                            setPickupTime(time);
                                        }}
                                         disabled={!pickupDate}
                                    >
                                        {time}
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Button className="w-full h-12 text-lg" onClick={handleContinue} disabled={!pickupDate || !pickupTime}>
                        Continue
                    </Button>
                </div>
            </main>
        </div>
    );
}

export default function SchedulePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <ScheduleDateContent />
    </Suspense>
  );
}
