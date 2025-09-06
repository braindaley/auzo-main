
"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Stepper from '@/components/stepper';

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM'
];

const transportSteps = [
    { name: "Locations" },
    { name: "Vehicle" },
    { name: "Schedule" },
    { name: "Review" },
];

function ScheduleDateContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [selectedDate] = useState<Date | undefined>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(searchParams.get('time'));

    const handleContinue = () => {
        const queryParams = new URLSearchParams(searchParams.toString());
        if (selectedDate) queryParams.set('date', selectedDate.toISOString());
        if (selectedTime) queryParams.set('time', selectedTime);

        const serviceType = searchParams.get('serviceType');

        if (serviceType === 'oneway') {
            router.push(`/transport/review?${queryParams.toString()}`);
        } else {
            router.push(`/transport/return-location?${queryParams.toString()}`);
        }
    };
    
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header>
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft />
                </Button>
            </Header>
            <main className="flex-1 flex flex-col p-4 md:p-8">
                <Stepper steps={transportSteps} currentStep={2} />
                 <div className="flex-1 flex flex-col justify-center space-y-6">
                    <Card>
                        <CardContent className="space-y-6 pt-6">
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {timeSlots.map(time => (
                                    <Button 
                                        key={time}
                                        variant={selectedTime === time ? "default" : "outline"}
                                        onClick={() => setSelectedTime(time)}
                                    >
                                        {time}
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Button onClick={handleContinue} className="w-full h-12 text-lg" disabled={!selectedTime}>
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

