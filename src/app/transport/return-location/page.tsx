
"use client";

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Info } from 'lucide-react';
import Stepper from '@/components/stepper';

const transportSteps = [
    { name: "Locations" },
    { name: "Vehicle" },
    { name: "Schedule" },
    { name: "Review" },
];

function ReturnLocationInfoContent() {
    const router = useRouter();
    
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
                        <CardHeader className="text-center items-center space-y-4">
                            <Info className="w-12 h-12 text-primary" />
                            <CardTitle>Round-trip Service Information</CardTitle>
                            <CardDescription className="text-base text-center">
                                For round-trip bookings, the driver stays with the car for the entire duration of the service.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-center">
                           <p className="text-muted-foreground">If your service will take longer than an hour, please book a separate one-way ride when your car is ready for pickup.</p>
                           <Button onClick={() => router.push('/home')} className="w-full h-12 text-lg">
                                Understood, back to Home
                           </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}

export default function ReturnLocationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <ReturnLocationInfoContent />
    </Suspense>
  );
}
