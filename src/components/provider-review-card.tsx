"use client";

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Car, Check, ChevronDown, Clock, MapPin } from 'lucide-react';

import Header from '@/components/header';
import ServiceMap from '@/components/service-map';
import RideOptions from '@/components/ride-options';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const steps = {
  INITIAL: 'initial',
  PLANNING: 'planning',
  CONFIRMING: 'confirming',
};

const ServiceHomePage = () => {
  const [currentStep, setCurrentStep] = useState(steps.INITIAL);
  const [serviceType, setServiceType] = useState('pickup'); // pickup, dropoff, roundtrip

  const renderInitialContent = () => (
    <motion.div
      key="initial"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="absolute bottom-0 left-0 right-0"
    >
      <Card className="rounded-t-2xl border-none shadow-2xl">
        <div className="p-6">
          <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted p-1">
            <Button
              variant={serviceType === 'pickup' ? 'default' : 'ghost'}
              className="rounded-md"
              onClick={() => setServiceType('pickup')}
            >
              Pick-up
            </Button>
            <Button
              variant={serviceType === 'dropoff' ? 'default' : 'ghost'}
              className="rounded-md"
              onClick={() => setServiceType('dropoff')}
            >
              Drop-off
            </Button>
            <Button
              variant={serviceType === 'roundtrip' ? 'default' : 'ghost'}
              className="rounded-md"
              onClick={() => setServiceType('roundtrip')}
            >
              Roundtrip
            </Button>
          </div>
          <div className="mt-6">
            <Button
              className="w-full h-14 text-lg"
              onClick={() => setCurrentStep(steps.PLANNING)}
            >
              Request a Service
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const renderPlanningContent = () => (
    <motion.div
      key="planning"
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute top-0 left-0 right-0 bottom-0 bg-background flex flex-col"
    >
      <div className="p-4 flex items-center gap-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => setCurrentStep(steps.INITIAL)}>
          <ArrowLeft />
        </Button>
        <h2 className="text-xl font-bold">Plan your service</h2>
      </div>
      <div className="p-6 space-y-4 flex-1">
        <div className="flex gap-4">
            <Button variant="secondary" className="flex-1">
                <Clock className="mr-2" />
                <span>Service Now</span>
                <ChevronDown className="ml-auto" />
            </Button>
             <Button variant="secondary" className="flex-1">
                <Car className="mr-2" />
                <span>My Car</span>
                <ChevronDown className="ml-auto" />
            </Button>
        </div>
        <div className="relative">
            <div className="absolute left-4 top-4 bottom-16 w-0.5 bg-muted-foreground/50" />
            <div className="flex items-center gap-4 mb-2">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center ring-8 ring-background">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                </div>
                <p className="font-semibold">Current Location</p>
            </div>
             <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center ring-8 ring-background">
                    <MapPin className="text-primary" />
                </div>
                <p className="text-muted-foreground">Where is your car going?</p>
            </div>
        </div>
      </div>
      <div className="p-4 border-t">
         <RideOptions onConfirm={() => setCurrentStep(steps.CONFIRMING)} />
      </div>
    </motion.div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <Header />
      
      <main className="flex-1 flex flex-col relative">
        <ServiceMap />
        <AnimatePresence mode="wait">
          {currentStep === steps.INITIAL && renderInitialContent()}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {currentStep === steps.PLANNING && renderPlanningContent()}
      </AnimatePresence>
    </div>
  );
};

export default ServiceHomePage;
