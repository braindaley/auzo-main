
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Car, Droplet } from 'lucide-react';
import BottomNav from '@/components/bottom-nav';
import Link from 'next/link';
import Header from '@/components/header';

const personalServices = [
    { name: "Transport your car", description: "Get your car moved from A->B/B->A", icon: Car, href: "/service-request" },
    { name: "Oil Change", description: "Roundtrip service included", icon: Droplet, href: "/oil-change-location" }
];

const HomePage = () => {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header isTransparent={false} />
            <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
                <div className="text-center py-4">
                    <h1 className="heading-1">Welcome to Auzo</h1>
                    <p className="body-base text-muted-foreground">How can we help you today?</p>
                </div>
                 <div className="grid grid-cols-1 gap-[10px] mt-4">
                    {personalServices.map((service) => (
                        <Link href={service.href} key={service.name} passHref>
                            <Card className="bg-card hover:bg-muted/80 transition-colors h-full border">
                                <CardContent className="p-6 flex items-center gap-6">
                                    <service.icon className="w-10 h-10 text-primary" />
                                    <div>
                                        <p className="heading-3">{service.name}</p>
                                        {service.description && (
                                            <p className="body-small text-muted-foreground">{service.description}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </main>
            <BottomNav />
        </div>
    );
};

export default HomePage;
