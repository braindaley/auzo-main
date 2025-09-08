
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, MapPin } from 'lucide-react';
import Header from '@/components/header';
import { useState, Suspense } from 'react';
import { usePlacesAutocomplete } from '@/hooks/use-places-autocomplete';
import { Skeleton } from '@/components/ui/skeleton';

function OilChangeLocationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [isFocused, setIsFocused] = useState(false);

  const {
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesAutocomplete({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    getPlacePredictions({ input: e.target.value });
  };
  
  const handleSelectLocation = (place: google.maps.places.AutocompletePrediction) => {
    setQuery(place.description);
    setIsFocused(false);
  };

  const handleSearch = () => {
    if (query) {
      router.push(`/service-locations?query=${encodeURIComponent(query)}`);
    }
  };

  const handleUseMyLocation = () => {
    setQuery('Current Location');
    router.push(`/service-locations?query=Current+Location`);
  };

  return (
    <div className="w-full max-w-md">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2" />
        Back
      </Button>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tighter">
            Oil Change Near Me
          </CardTitle>
          <CardDescription>TO ORDER, SELECT A LOCATION</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <Input
                id="location"
                placeholder="Enter your location"
                value={query}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                autoComplete="off"
              />
              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
               {isFocused && query.length > 2 && (
                    <div className="absolute z-20 top-full w-full mt-2 bg-card border rounded-lg shadow-lg">
                        {isPlacePredictionsLoading && (
                            <div className="p-2 space-y-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            </div>
                        )}
                        {!isPlacePredictionsLoading && placePredictions.map(location => (
                            <button key={location.place_id} onMouseDown={() => handleSelectLocation(location)} className="w-full flex items-start gap-4 p-3 text-left hover:bg-muted border-b last:border-b-0">
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
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            className="w-full h-12"
            onClick={handleSearch}
            disabled={!query}
          >
            SEARCH
          </Button>
          <Button
            variant="outline"
            className="w-full h-12"
            onClick={handleUseMyLocation}
          >
            USE MY LOCATION
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function OilChangeLocationPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <Suspense fallback={
          <div className="w-full max-w-md">
            <Skeleton className="h-[500px] w-full" />
          </div>
        }>
          <OilChangeLocationContent />
        </Suspense>
      </main>
    </div>
  );
}
