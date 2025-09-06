
"use client";

import { Suspense, useState }from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Car, CheckCircle, Clock, Wrench, Info, ArrowRight, RotateCcw } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';


function TransportScheduleContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [serviceType, setServiceType] = useState<'oneway' | 'roundtrip'>(searchParams.get('serviceType') as any || 'oneway');
    const [scheduleOption, setScheduleOption] = useState<'now' | 'later' | null>(searchParams.get('scheduleOption') as any || null);
    const [moreThanOneHour, setMoreThanOneHour] = useState<'yes' | 'no' | null>(searchParams.get('moreThanOneHour') as any || null);
    const [showRoundTripInfo, setShowRoundTripInfo] = useState(false);


    const handleContinue = () => {
        const queryParams = new URLSearchParams(searchParams.toString());
        queryParams.set('serviceType', serviceType);
        
        if (serviceType === 'oneway') {
            router.push(`/transport/vehicle?${queryParams.toString()}`);
            return;
        }

        if (serviceType === 'roundtrip' && moreThanOneHour) {
            queryParams.set('moreThanOneHour', moreThanOneHour);
            if (moreThanOneHour === 'yes') {
                queryParams.set('scheduleOption', 'later'); // It's a long round trip, so schedule it.
                router.push(`/transport/schedule-date?${queryParams.toString()}`);
            } else { // moreThanOneHour === 'no'
                queryParams.set('scheduleOption', 'now');
                router.push(`/transport/vehicle?${queryParams.toString()}`);
            }
        }
    };

    const isContinueDisabled = () => {
        if (serviceType === 'roundtrip' && !moreThanOneHour) {
            return true;
        }
        return false;
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header>
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft />
                </Button>
            </Header>
            <main className="flex-1 flex flex-col p-4 md:p-8 pb-24">
                 <div className="flex-1 flex flex-col">
                    <div className="w-full max-w-md mx-auto space-y-8">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold">Transport Type</h1>
                        </div>
                        
                        <div>
                            <ToggleGroup type="single" value={serviceType} onValueChange={(value) => {
                                if (value) setServiceType(value as any);
                                if (value === 'oneway') setMoreThanOneHour(null);
                                if (value === 'roundtrip') setScheduleOption(null);
                            }} className="w-full grid grid-cols-1 gap-2">
                                <ToggleGroupItem value="oneway" className="h-14 text-lg data-[state=on]:bg-primary data-[state=on]:text-primary-foreground flex items-center gap-2">
                                    <ArrowRight className="w-5 h-5" />
                                    One-Way
                                </ToggleGroupItem>
                                <ToggleGroupItem value="roundtrip" className="h-14 text-lg data-[state=on]:bg-primary data-[state=on]:text-primary-foreground flex items-center gap-2">
                                    <RotateCcw className="w-5 h-5" />
                                    Roundtrip
                                </ToggleGroupItem>
                            </ToggleGroup>
                        </div>
                        

                        {serviceType === 'roundtrip' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Will your car be at this location for more than 1 hr?</CardTitle>
                                </CardHeader>
                                <CardContent>
                                     <ToggleGroup type="single" value={moreThanOneHour || ""} onValueChange={(value) => {
                                        if (value) {
                                            if (value === 'yes') {
                                                setShowRoundTripInfo(true);
                                            } else {
                                                setMoreThanOneHour(value as any);
                                            }
                                        }
                                    }} className="w-full grid grid-cols-2">
                                        <ToggleGroupItem value="yes" className="h-14 text-lg data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Yes</ToggleGroupItem>
                                        <ToggleGroupItem value="no" className="h-14 text-lg data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">No</ToggleGroupItem>
                                    </ToggleGroup>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
                <div className="w-full max-w-md mx-auto px-8">
                    <Button onClick={handleContinue} className="w-full h-12 text-lg" disabled={isContinueDisabled()}>
                        Continue
                    </Button>
                </div>
            </div>

            <Dialog open={showRoundTripInfo} onOpenChange={setShowRoundTripInfo}>
                <DialogContent className="max-w-sm bg-background border-border">
                    <DialogHeader className="text-center pt-6 pb-4">
                        <div className="mx-auto mb-4">
                            <div className="w-12 h-12 rounded-full border-2 border-foreground flex items-center justify-center">
                                <Info className="w-6 h-6 text-foreground" />
                            </div>
                        </div>
                        <DialogTitle className="heading-2">Round-trip Service Information</DialogTitle>
                        <DialogDescription className="body-base text-muted-foreground mt-4">
                            For round-trip bookings, the driver stays with the car for the entire duration of the service.
                        </DialogDescription>
                        <DialogDescription className="body-base text-muted-foreground mt-4">
                            If your service will take longer than an hour, please book a separate one-way ride when your car is ready for pickup.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="px-6 pb-6">
                        <Button 
                            className="w-full"
                            onClick={() => {
                                setShowRoundTripInfo(false);
                                const queryParams = new URLSearchParams(searchParams.toString());
                                queryParams.set('serviceType', 'oneway');
                                router.push(`/transport/vehicle?${queryParams.toString()}`);
                            }}
                        >
                            Continue booking one-way
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function TransportSchedulePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransportScheduleContent />
    </Suspense>
  );
}
