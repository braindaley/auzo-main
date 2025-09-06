
"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
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

function ScheduleTimeContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dateStr = searchParams.get('date');
    
    if (!dateStr) {
        return (
            <div className="text-center p-8">
                <p>No date selected. Please go back and select a date.</p>
                 <Link href="/transport/schedule-date" passHref>
                    <Button className="mt-4">
                        <ArrowLeft className="mr-2" /> Select a Date
                    </Button>
                </Link>
            </div>
        );
    }

    const selectedDate = new Date(dateStr);

    if (isNaN(selectedDate.getTime())) {
        return (
            <div className="text-center p-8">
                <p>Invalid date selected. Please go back and try again.</p>
                <Link href="/transport/schedule-date" passHref>
                    <Button className="mt-4">
                        <ArrowLeft className="mr-2" /> Select a Date
                    </Button>
                </Link>
            </div>
        );
    }

    const handleTimeSelect = (time: string) => {
        const queryParams = new URLSearchParams(searchParams.toString());
        queryParams.set('time', time);
        router.push(`/transport/review?${queryParams.toString()}`);
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
                <div className="flex-1 flex flex-col justify-center">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center text-xl">
                                Select a Time for {format(selectedDate, 'MMMM d, yyyy')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {timeSlots.map(time => (
                                    <Button 
                                        key={time}
                                        variant="outline"
                                        className="h-14 text-lg"
                                        onClick={() => handleTimeSelect(time)}
                                    >
                                        {time}
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}

export default function ScheduleTimePage() {
  return (
      <Suspense fallback={<div>Loading...</div>}>
          <ScheduleTimeContent />
      </Suspense>
  );
}
