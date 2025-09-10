
"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { ArrowLeft } from 'lucide-react';
import Stepper from '@/components/stepper';

const oilChangeSteps = [
    { name: "Location" },
    { name: "Vehicle" },
    { name: "Schedule" },
    { name: "Review" },
];

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM'
];

function ScheduleDateContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialDateStr = searchParams.get('date');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        initialDateStr ? new Date(initialDateStr) : new Date()
    );
    const [selectedTime, setSelectedTime] = useState<string | null>(searchParams.get('time'));

    const handleContinue = () => {
        if (selectedDate && selectedTime) {
            const queryParams = new URLSearchParams(searchParams.toString());
            queryParams.set('date', selectedDate.toISOString());
            queryParams.set('time', selectedTime);
            router.push(`/transport/vehicle?${queryParams.toString()}`);
        }
    };
    
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
                <Stepper steps={oilChangeSteps} currentStep={2} />
                <div className="flex-1 flex flex-col justify-center space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center text-xl">Select a Date and Time</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                className="rounded-md border mx-auto"
                                disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                            />
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
                    <Button onClick={handleContinue} className="w-full h-12 text-lg" disabled={!selectedDate || !selectedTime}>
                        Continue
                    </Button>
                </div>
            </main>
        </div>
    );
}

export default function ScheduleDatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <ScheduleDateContent />
    </Suspense>
  );
}
