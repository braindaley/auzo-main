
"use client";

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

import Header from '@/components/header';
import ServiceMap from '@/components/service-map';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, Star, ChevronDown } from 'lucide-react';

function TrackDriverContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const pickup = searchParams.get('pickup') || '3430 Irvine Ave';

    const handleCancel = () => {
        // Here you would add logic to cancel the service
        console.log("Service cancelled");
        router.push('/home');
    }

    return (
        <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
            <Header isTransparent={false}/>
            
            <main className="flex-1 flex flex-col relative">
                <ServiceMap />
                <motion.div
                    key="tracker"
                    initial={{ opacity: 0, y: "100%" }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute bottom-0 left-0 right-0"
                >
                    <Card className="rounded-t-2xl border-none shadow-2xl bg-background">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold">Pickup at {pickup}</h3>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                        Show more <ChevronDown className="w-4 h-4" />
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="p-2 rounded-full bg-primary text-primary-foreground font-bold text-lg leading-none w-10 h-10 flex items-center justify-center">
                                        6
                                    </div>
                                    <p className="text-xs mt-1">min</p>
                                </div>
                            </div>


                            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <Avatar className="w-16 h-16 border-4 border-background bg-muted">
                                            <AvatarFallback>A</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-2 -right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-card shadow-md">
                                            <span className="font-bold text-sm">4.97</span>
                                            <Star className="w-4 h-4 text-amber-400 fill-amber-400"/>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-bold">Andrzej</p>
                                        <p className="text-sm text-primary">Highest rated driver</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="w-24 h-14 bg-muted rounded-md mb-2"></div>
                                    <p className="font-bold">AA 123AA</p>
                                    <p className="text-sm text-muted-foreground">Toyota Auris</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1 bg-white">Notes for pickup</Button>
                                <Button variant="outline" size="icon" className="bg-white"><Phone /></Button>
                            </div>
                            
                            <div className="flex gap-2 mt-2">
                                <Button variant="default" className="flex-1" onClick={() => router.push('/home')}>Done</Button>
                                <Button variant="outline" className="flex-1" onClick={handleCancel}>
                                    Cancel Service
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </main>
        </div>
    );
}

export default function TrackDriverPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TrackDriverContent />
        </Suspense>
    );
}
