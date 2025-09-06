
"use client";

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, User, ChevronDown, Clock, Calendar as CalendarIcon, MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Header from '@/components/header';
import { usePlacesAutocomplete } from '@/hooks/use-places-autocomplete';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import BottomNav from '@/components/bottom-nav';
import ServiceMap from '@/components/service-map';
import RideOptions from '@/components/ride-options';

const recentDestinations = [
    { name: "Southwest Airlines", address: "Terminal C, John Wayne Airport (SNA), Santa An...", distance: "1.9 mi" },
    { name: "68 Groveside Dr", address: "Aliso Viejo, CA", distance: "13 mi" },
    { name: "Synergy Oil", address: "1201 dove st #475, Newport Beach, CA", distance: "0.9 mi" },
    { name: "2373 Indian Creek Rd", address: "Diamond Bar, CA", distance: "29 mi" },
    { name: "15227 Bernard Ct", address: "Hacienda Heights, CA", distance: "30 mi" },
]

function ServiceRequestContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [pickup, setPickup] = useState('3430 Irvine Ave');
    const [destination, setDestination] = useState('');
    const [destinationError, setDestinationError] = useState('');
    const [isDestinationFocused, setIsDestinationFocused] = useState(false);
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);
    const [scheduleOption, setScheduleOption] = useState<'now' | 'later'>('now');

    const {
        placePredictions: destinationPredictions,
        getPlacePredictions: getDestinationPredictions,
        isPlacePredictionsLoading: isDestinationLoading,
    } = usePlacesAutocomplete({ debounce: 300 });

    const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDestination(e.target.value);
        if (e.target.value) {
            setDestinationError('');
        }
        getDestinationPredictions({ input: e.target.value });
    };

    const handleDestinationSelect = (place: google.maps.places.AutocompletePrediction | {name: string, address: string}) => {
        const newDestination = 'name' in place ? place.name : place.description;
        if (!newDestination) {
            setDestinationError('Please enter a destination.');
            return;
        }
        setDestination(newDestination);
        setDestinationError('');
        setIsDestinationFocused(false);
        
        const queryParams = new URLSearchParams(searchParams.toString());
        queryParams.set('pickup', pickup);
        queryParams.set('destination', newDestination);
        
        router.push(`/transport/schedule?${queryParams.toString()}`);
    };

    const handleScheduleModalNext = () => {
        if (!destination) {
            setDestinationError('Please enter a destination.');
            setIsScheduleOpen(false);
            return;
        }

        setDestinationError('');
        const queryParams = new URLSearchParams(searchParams.toString());
        queryParams.set('pickup', pickup);
        queryParams.set('destination', destination);

        router.push(`/transport/schedule?${queryParams.toString()}`);
        setIsScheduleOpen(false);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background relative">
            <Header isTransparent>
                 <Button variant="ghost" size="icon" className="text-white" onClick={() => router.back()}>
                    <ArrowLeft />
                 </Button>
            </Header>

            <main className="flex-1 flex flex-col relative -mt-16">
                 <ServiceMap />
            </main>

            <motion.div
                key="planner"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute bottom-0 left-0 right-0"
            >
                <Card className="rounded-t-2xl border-none shadow-2xl">
                    <CardHeader className="pt-6 px-6 pb-4">
                        <div className="flex items-center gap-2">
                             <Button variant="secondary" size="sm" onClick={() => setIsScheduleOpen(true)}>
                                <Clock className="w-4 h-4 mr-2" />
                                {scheduleOption === 'now' ? 'Pickup now' : 'Schedule'}
                                <ChevronDown className="w-4 h-4 ml-2"/>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="px-6 pb-6 space-y-4">
                        <div className="relative">
                            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-muted-foreground/30 z-0" />
                            <div className="flex items-center gap-4 mb-2">
                                <div className="relative z-10 w-8 h-8 rounded-full bg-muted-foreground flex items-center justify-center ring-4 ring-background">
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                </div>
                                <Input
                                    className="flex-1 bg-muted border-none h-12"
                                    value={pickup}
                                    onChange={(e) => setPickup(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="relative z-10 w-8 h-8 rounded-full bg-foreground flex items-center justify-center ring-4 ring-background">
                                    <div className="w-3 h-3 bg-background" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}/>
                                </div>
                                <div className="flex-1 relative">
                                    <Input
                                        placeholder="Where to?"
                                        className={cn(
                                            "flex-1 bg-muted border-none h-12",
                                            destinationError && "border-2 border-destructive"
                                        )}
                                        value={destination}
                                        onChange={handleDestinationChange}
                                        onFocus={() => setIsDestinationFocused(true)}
                                        onBlur={() => setTimeout(() => setIsDestinationFocused(false), 200)}
                                    />
                                    <AnimatePresence>
                                    {(isDestinationFocused && destination.length > 0) && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute bottom-full w-full mb-2 bg-card border rounded-lg shadow-lg max-h-60 overflow-y-auto z-20"
                                        >
                                            {isDestinationLoading && (
                                                <div className="p-2 space-y-2">
                                                <Skeleton className="h-10 w-full" />
                                                <Skeleton className="h-10 w-full" />
                                                </div>
                                            )}
                                            {!isDestinationLoading && destinationPredictions.map(location => (
                                                <button key={location.place_id} onMouseDown={() => handleDestinationSelect(location)} className="w-full flex items-start gap-4 p-3 text-left hover:bg-muted border-b last:border-b-0">
                                                    <div className="p-2 bg-muted rounded-full mt-1">
                                                        <MapPin className="w-5 h-5 text-muted-foreground" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">{location.structured_formatting.main_text}</p>
                                                        <p className="text-sm text-muted-foreground">{location.structured_formatting.secondary_text}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                    </AnimatePresence>
                                </div>
                            </div>
                            {destinationError && <p className="text-destructive text-sm mt-2 ml-12">{destinationError}</p>}
                        </div>

                         <div className="border-t pt-4 mt-4">
                            {recentDestinations.map((location, index) => (
                                <button key={index} onMouseDown={() => handleDestinationSelect(location)} className="w-full flex items-start gap-4 p-3 text-left hover:bg-muted rounded-lg">
                                    <div className="p-3 bg-muted rounded-full">
                                        <MapPin className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{location.name}</p>
                                        <p className="text-sm text-muted-foreground">{location.address}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
                <DialogContent className="max-w-sm rounded-t-2xl bottom-0 top-auto translate-y-0 p-0 border-none">
                     <DialogHeader>
                        <DialogTitle className="sr-only">Schedule your ride</DialogTitle>
                    </DialogHeader>
                    <div className="p-6">
                         <h3 className="text-xl font-bold text-center mb-6">When do you need a ride?</h3>
                         <div className="space-y-4">
                             <button onClick={() => setScheduleOption('now')} className={cn(
                                 "w-full p-4 rounded-lg border-2 flex items-center gap-4",
                                 scheduleOption === 'now' ? 'border-primary' : 'border-muted'
                             )}>
                                <Clock className="w-6 h-6 text-primary" />
                                <div>
                                    <p className="font-bold">Now</p>
                                    <p className="text-sm text-muted-foreground">Request a ride, hop in, and go</p>
                                </div>
                             </button>
                             <button onClick={() => setScheduleOption('later')} className={cn(
                                 "w-full p-4 rounded-lg border-2 flex items-center gap-4",
                                 scheduleOption === 'later' ? 'border-primary' : 'border-muted'
                             )}>
                                <CalendarIcon className="w-6 h-6 text-primary" />
                                <div>
                                    <p className="font-bold">Later</p>
                                    <p className="text-sm text-muted-foreground">Reserve for extra peace of mind</p>
                                </div>
                             </button>
                         </div>
                         <Button className="w-full h-12 text-lg mt-8" onClick={handleScheduleModalNext}>Next</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}


export default function PlanRidePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ServiceRequestContent />
        </Suspense>
    );
}
