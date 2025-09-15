
'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Star, Phone, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import ServiceMap from '@/components/service-map';
import { AnimatePresence, motion } from 'framer-motion';

const allLocations = [
  {
    name: 'Oil Stop',
    address: '3045 Bristol St, Costa Mesa, CA 92626',
    distance: 3.74,
    phone: '(714) 434-8350',
    hours: {
      monSat: '8:00 am - 6:00 pm',
      sun: 'Closed',
    },
    type: 'oilstop'
  },
  {
    name: 'Oil Stop',
    address: '1234 Main St, Newport Beach, CA 92660',
    distance: 5.2,
    phone: '(949) 123-4567',
    hours: {
      monSat: '8:00 am - 6:00 pm',
      sun: 'Closed',
    },
    type: 'oilstop'
  },
  {
    name: 'Jiffy Lube',
    address: '806 Avenida Pico, Suite E, San Clemente, CA 92673',
    distance: 11.17,
    phone: '(949) 555-1234',
    hours: {
      monSat: '9:00 am - 7:00 pm',
      sun: '10:00 am - 5:00 pm',
    },
    type: 'jiffy-lube'
  },
];

function ServiceLocationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const promotional = searchParams.get('promotional');
  const [expandedLocation, setExpandedLocation] = useState<string | null>(null);
  
  // Filter locations based on promotional flag
  const locations = promotional === 'true' 
    ? allLocations.filter(location => location.type === 'oilstop')
    : allLocations;

  const handleSelectLocation = (destination: string) => {
    router.push(
      `/oil-change/vehicle?service=Oil+Change&destination=${encodeURIComponent(
        destination
      )}`
    );
  };
  
  const toggleDetails = (name: string) => {
    setExpandedLocation(expandedLocation === name ? null : name);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex flex-col">
        <div className="relative h-64 bg-muted">
          <ServiceMap />
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          <Button variant="ghost" onClick={() => router.push('/home')} className="mb-4">
            <ArrowLeft className="mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold mb-4">
            Oil Change Options near me
          </h1>
          <div className="space-y-4">
            {locations.map((location) => {
              const isExpanded = expandedLocation === location.name;
              return (
              <Card key={location.name}>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {location.distance} miles
                      </p>
                      <h2 className="font-bold">{location.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        {location.address}
                      </p>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 mt-4 border-t space-y-4">
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            <span>{location.phone}</span>
                          </div>
                          <div className="text-sm">
                            <p><span className="font-semibold">Mon-Sat:</span> {location.hours.monSat}</p>
                            <p><span className="font-semibold">Sun:</span> {location.hours.sun}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center justify-end gap-4">
                    <Button variant="link" className="text-primary" onClick={() => toggleDetails(location.name)}>
                      {isExpanded ? 'HIDE DETAILS' : 'VIEW DETAILS'}
                    </Button>
                    <Button onClick={() => handleSelectLocation(location.name)}>
                      Select Location
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )})}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ServiceLocationsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ServiceLocationsContent />
    </Suspense>
  );
}
