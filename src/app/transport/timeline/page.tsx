
"use client";

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Wrench, CheckCircle } from 'lucide-react';
import Stepper from '@/components/stepper';

const transportSteps = [
    { name: "Locations" },
    { name: "Vehicle" },
    { name: "Schedule" },
    { name: "Review" },
];

function TimelineGraphic() {
    return (
        <div className="p-4 bg-muted rounded-lg">
            <h4 className="text-md font-semibold text-center mb-4">Estimated Timeline</h4>
            <div className="flex items-start w-full text-center">
                <div className="flex flex-col items-center w-1/4">
                    <div className="w-10 h-10 mb-2 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Clock className="w-5 h-5"/></div>
                    <p className="text-xs font-semibold">Pickup</p>
                    <p className="text-xs text-muted-foreground">Now</p>
                </div>
                <div className="flex-1 h-0.5 bg-primary/50 mt-5"></div>
                <div className="flex flex-col items-center w-1/4">
                    <div className="w-10 h-10 mb-2 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Wrench className="w-5 h-5"/></div>
                    <p className="text-xs font-semibold">Servicing</p>
                    <p className="text-xs text-muted-foreground">~1 hr</p>
                </div>
                <div className="flex-1 h-0.5 bg-primary/50 mt-5"></div>
                <div className="flex flex-col items-center w-1/4">
                    <div className="w-10 h-10 mb-2 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><CheckCircle className="w-5 h-5"/></div>
                    <p className="text-xs font-semibold">Return</p>
                    <p className="text-xs text-muted-foreground">~3-4 hrs</p>
                </div>
            </div>
        </div>
    )
}


function TimelineContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleConfirm = () => {
        const queryParams = new URLSearchParams(searchParams.toString());
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
                    <Card className="w-full max-w-lg mx-auto shadow-lg">
                        <CardHeader className="text-center items-center">
                            <CardTitle className="text-3xl">Estimated Timeline</CardTitle>
                            <CardDescription>This is an estimate for immediate round-trip service.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                           <TimelineGraphic />
                            <Button onClick={handleConfirm} className="w-full h-12 text-lg">
                                Continue to Review
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}

export default function TimelinePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TimelineContent />
        </Suspense>
    );
}
