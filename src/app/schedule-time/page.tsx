"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { ArrowLeft } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';


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
    const [scheduleType, setScheduleType] = useState(searchParams.get('scheduleType') || 'pickup');


    const handleContinue = () => {
        if (selectedDate && selectedTime) {
            const queryParams = new URLSearchParams(searchParams.toString());
            queryParams.set('date', selectedDate.toISOString());
            queryParams.set('time', selectedTime);
            queryParams.set('scheduleType', scheduleType);
            
            const destinationPage = searchParams.has('year') ? '/transport/review' : '/review-details';
            router.push(`${destinationPage}?${queryParams.toString()}`);
        }
    }

    const handleScheduleTypeChange = (value: string) => {
        if (value) {
            setScheduleType(value);
            setSelectedDate(new Date());
            setSelectedTime(null);
        }
    }
    
    return (
        <div className="flex flex-col min-h-screen bg-background">
             <Header>
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft />
                </Button>
            </Header>
            <main className="flex-1 flex flex-col p-4 md:p-8">
                <div className="w-full max-w-sm mx-auto flex flex-col flex-1 justify-center space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-center mb-4">Choose a time</h1>
                        <ToggleGroup type="single" value={scheduleType} onValueChange={handleScheduleTypeChange} className="grid grid-cols-2 bg-muted p-1 rounded-lg mb-6">
                            <ToggleGroupItem value="pickup" className="data-[state=on]:bg-background data-[state=on]:shadow-sm rounded-md h-10">Pickup at</ToggleGroupItem>
                            <ToggleGroupItem value="dropoff" className="data-[state=on]:bg-background data-[state=on]:shadow-sm rounded-md h-10">Dropoff by</ToggleGroupItem>
                        </ToggleGroup>
                    </div>
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
                    <Button className="w-full h-12 text-lg" onClick={handleContinue} disabled={!selectedDate || !selectedTime}>
                        Next
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