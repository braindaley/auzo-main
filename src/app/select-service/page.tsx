"use client";

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/header';
import { usePlacesAutocomplete } from '@/hooks/use-places-autocomplete';
import { MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Stepper from '@/components/stepper';

const transportSteps = [
    { name: "Locations" },
    { name: "Vehicle" },
    { name: "Schedule" },
    { name: "Review" },
];


function TransportLocationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [pickup, setPickup] = useState(searchParams.get('pickup') || 'Current Location');
    const [destination, setDestination] = useState(searchParams.get('destination') || '');

    const [isPickupFocused, setIsPickupFocused] = useState(false);
    const [isDestinationFocused, setIsDestinationFocused] = useState(false);

    const {
        placePredictions: pickupPredictions,
        getPlacePredictions: getPickupPredictions,
        isPlacePredictionsLoading: isPickupLoading,
    } = usePlacesAutocomplete({ debounce: 300 });

    const {
        placePredictions: destinationPredictions,
        getPlacePredictions: getDestinationPredictions,
        isPlacePredictionsLoading: isDestinationLoading,
    } = usePlacesAutocomplete({ debounce: 300 });

    const handlePickupFocus = () => {
        setIsPickupFocused(true);
        if (pickup === 'Current Location') {
            setPickup('');
        }
    };

    const handlePickupBlur = () => {
        setTimeout(() => setIsPickupFocused(false), 200)
        if (pickup === '') {
            setPickup('Current Location');
        }
    };

    const handlePickupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPickup(e.target.value);
        getPickupPredictions({ input: e.target.value });
    };

    const handlePickupSelect = (place: google.maps.places.AutocompletePrediction) => {
        setPickup(place.description);
        setIsPickupFocused(false);
    };

    const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDestination(e.target.value);
        getDestinationPredictions({ input: e.target.value });
    };
    
    const handleDestinationFocus = () => setIsDestinationFocused(true);
    const handleDestinationBlur = () => setTimeout(() => setIsDestinationFocused(false), 200);


    const handleDestinationSelect = (place: google.maps.places.AutocompletePrediction) => {
        setDestination(place.description);
        setIsDestinationFocused(false);
    };

    const handleConfirm = () => {
        const queryParams = new URLSearchParams(searchParams.toString());
        queryParams.set('pickup', pickup);
        queryParams.set('destination', destination);
        router.push(`/transport/vehicle?${queryParams.toString()}`);
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header>
                <Button variant="ghost" size="icon" onClick={() => router.push('/home')}>
                    <ArrowLeft />
                </Button>
            </Header>
            <main className="flex-1 flex flex-col p-4 md:p-8">
                 <Stepper steps={transportSteps} currentStep={0} />
                 <div className="flex-1 flex flex-col justify-center">
                    <div className="w-full max-w-md mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold">Transport Your Car</h1>
                            <p className="text-muted-foreground">Select pick-up and drop-off locations.</p>
                        </div>
                        <div className="relative">
                            <div className="absolute left-4 top-4 h-14 w-0.5 bg-muted-foreground/30 z-0" />
                            <div className="flex items-center gap-4 mb-2">
                                <div className="relative z-10 w-8 h-8 rounded-full bg-muted-foreground flex items-center justify-center ring-4 ring-background">
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                </div>
                                <div className="flex-1 relative">
                                    <label className="absolute left-3 -top-2.5 text-xs text-muted-foreground font-semibold bg-background px-1 z-10">Pick-up:</label>
                                    <Input
                                        className="flex-1 bg-muted border-none h-12"
                                        value={pickup}
                                        onChange={handlePickupChange}
                                        onFocus={handlePickupFocus}
                                        onBlur={handlePickupBlur}
                                    />
                                    {isPickupFocused && pickup.length > 2 && (
                                        <div className="absolute z-20 top-full w-full mt-2 bg-card border rounded-lg shadow-lg">
                                            {isPickupLoading && (
                                                <div className="p-2 space-y-2">
                                                <Skeleton className="h-10 w-full" />
                                                <Skeleton className="h-10 w-full" />
                                                </div>
                                            )}
                                            {!isPickupLoading && pickupPredictions.map(location => (
                                                <button key={location.place_id} onMouseDown={() => handlePickupSelect(location)} className="w-full flex items-start gap-4 p-3 text-left hover:bg-muted border-b last:border-b-0">
                                                    <div className="p-2 bg-muted rounded-full mt-1">
                                                        <MapPin className="w-5 h-5 text-muted-foreground" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">{location.structured_formatting.main_text}</p>
                                                        <p className="text-sm text-muted-foreground">{location.structured_formatting.secondary_text}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="relative z-10 w-8 h-8 rounded-full bg-foreground flex items-center justify-center ring-4 ring-background">
                                    <div className="w-3 h-3 bg-background" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}/>
                                </div>
                                <div className="flex-1 relative">
                                    <label className="absolute left-3 -top-2.5 text-xs text-muted-foreground font-semibold bg-background px-1 z-10">Drop-off:</label>
                                    <Input
                                        placeholder="Where should we drop your car off?"
                                        className="flex-1 bg-muted border-none h-12"
                                        value={destination}
                                        onChange={handleDestinationChange}
                                        onFocus={handleDestinationFocus}
                                        onBlur={handleDestinationBlur}
                                    />
                                    {isDestinationFocused && destination.length > 2 && (
                                        <div className="absolute z-20 top-full w-full mt-2 bg-card border rounded-lg shadow-lg">
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
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                         <Button className="w-full h-14 text-lg !mt-12" onClick={handleConfirm} disabled={!pickup || !destination || pickup === destination}>
                            Confirm Locations
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function TransportLocationPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TransportLocationContent />
        </Suspense>
    );
}