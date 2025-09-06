
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, ClipboardList, Loader, Truck, UserCheck, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

const serviceSteps = [
  { name: 'Request Received', icon: ClipboardList, time: '10:30 AM', details: 'We have your request and are finding a driver.' },
  { name: 'Provider Assigned', icon: UserCheck, time: '10:32 AM', details: 'David is assigned to your service.' },
  { name: 'Provider En Route', icon: Truck, time: '10:35 AM', details: 'David is on the way to pick up your car. Est. arrival: 10:50 AM.' },
  { name: 'Servicing Car', icon: Wrench, time: '11:15 AM', details: 'Your car is now being serviced. Est. completion: 12:30 PM.' },
  { name: 'Service Complete', icon: CheckCircle, time: '12:25 PM', details: 'Service is complete! David is returning your car.' },
];

type ServiceTrackerProps = {
  isServiceActive: boolean;
};

const LiveMapGraphic = ({ progress }: { progress: number }) => {
    const carPath = "M20,110 A40,40 0 0,1 60,90 A60,60 0 0,0 120,70 A40,40 0 0,1 180,60 L240,60";

    return (
        <div className="relative w-full h-full bg-muted/30 rounded-lg overflow-hidden border">
            <svg viewBox="0 0 260 160" className="w-full h-full">
                {/* Roads */}
                <path d="M0,120 L20,115 L20,110 L60,90 L120,70 L180,60 L260,60" fill="none" stroke="hsl(var(--border))" strokeWidth="12" strokeLinecap="round" />
                <path d="M60,90 L65,160" fill="none" stroke="hsl(var(--border))" strokeWidth="12" strokeLinecap="round" />
                <path d="M120,0 L120,70" fill="none" stroke="hsl(var(--border))" strokeWidth="12" strokeLinecap="round" />
                <path d="M180,60 L175,0" fill="none" stroke="hsl(var(--border))" strokeWidth="12" strokeLinecap="round" />

                {/* Dashed line for path */}
                <path
                    d={carPath}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                />

                {/* Car Icon Animation */}
                <motion.g
                    initial={{ offsetDistance: "0%" }}
                    animate={{ offsetDistance: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                >
                    <motion.path
                        d={carPath}
                        fill="none"
                    >
                        <circle cx="0" cy="0" r="8" fill="hsl(var(--primary))" stroke="hsl(var(--primary-foreground))" strokeWidth="2" />
                    </motion.path>
                </motion.g>
                
                {/* Start and End points */}
                <circle cx="20" cy="110" r="5" fill="hsl(var(--foreground))" />
                <text x="25" y="125" fontSize="10" fill="hsl(var(--foreground))" className="font-semibold">Pickup</text>

                <circle cx="240" cy="60" r="5" fill="hsl(var(--foreground))" />
                <text x="190" y="55" fontSize="10" fill="hsl(var(--foreground))" className="font-semibold">Destination</text>
            </svg>
             <div className="absolute bottom-2 left-2 text-foreground p-2 rounded-md bg-background/70 backdrop-blur-sm text-xs">
                <h4 className="font-bold">Live Tracking</h4>
                <p className="opacity-80">Location updated just now</p>
            </div>
        </div>
    )
}


const ServiceTracker = ({ isServiceActive }: ServiceTrackerProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isServiceActive) {
      setCurrentStep(0);
      const timers = serviceSteps.map((_, index) =>
        setTimeout(() => {
          setCurrentStep(index + 1);
        }, (index + 1) * 2000) // Speed up for demo
      );
      return () => timers.forEach(clearTimeout);
    }
  }, [isServiceActive]);

  const mapProgress = currentStep > 2 ? 100 : (currentStep <= 2 ? 0 : 50);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Live Service Tracker</CardTitle>
        <CardDescription>Follow your car service status in real-time.</CardDescription>
      </CardHeader>
      <CardContent>
        {!isServiceActive ? (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-16">
            <ClipboardList className="w-12 h-12 mb-4" />
            <p>Your service status will appear here once you make a request.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative aspect-video">
               <LiveMapGraphic progress={mapProgress} />
            </div>
            <div className="relative">
              {serviceSteps.map((step, index) => {
                const isActive = index < currentStep;
                const isCurrent = index === currentStep - 1 && currentStep <= serviceSteps.length;
                
                return (
                  <div key={step.name} className="flex gap-4 pb-8">
                     {index < serviceSteps.length -1 && (
                        <div className="absolute left-5 top-1 h-full w-0.5 bg-border -translate-x-1/2" />
                     )}
                    <div className={cn(
                        "relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-300 shrink-0",
                        isActive ? "bg-primary border-primary text-primary-foreground" : "bg-card border-border text-muted-foreground"
                    )}>
                        {isCurrent ? <Loader className="animate-spin w-5 h-5" /> : <step.icon className="w-5 h-5"/>}
                    </div>
                    <div className="flex-1">
                        <p className={cn(
                            "font-semibold transition-colors duration-300",
                            isActive ? "text-primary" : "text-foreground"
                        )}>
                            {step.name}
                        </p>
                         <AnimatePresence>
                         {isActive && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <p className="text-sm text-muted-foreground mt-1">{step.details}</p>
                                <p className="text-xs text-muted-foreground/80 mt-1">{step.time}</p>
                            </motion.div>
                         )}
                         </AnimatePresence>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceTracker;
