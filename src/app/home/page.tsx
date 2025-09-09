
"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Car, Droplet, Wrench, Gauge, Cog, Sparkles, PaintBucket, Settings, Search, Calendar, Fuel, Waves } from 'lucide-react';
import Link from 'next/link';

const personalServices = [];

const additionalServices = [
    { name: "Quick Lube", icon: Droplet },
    { name: "Car Wash", icon: Waves },
    { name: "Fuel Fill", icon: Fuel },
    { name: "Dealer Service Center", icon: Car },
    { name: "Tire & Wheel Service", icon: Cog },
    { name: "Brake & Muffler Service", icon: Gauge },
    { name: "Transmission Service", icon: Settings },
    { name: "Body & Glass Service", icon: PaintBucket },
    { name: "General Repair Service", icon: Wrench }
];

const HomePage = () => {
    const [pickupTime, setPickupTime] = useState<'now' | 'later'>('now');

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div className="mt-4">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Deliver your car</label>
                    <div className="relative">
                        <Link href={`/deliver?pickup=${pickupTime}`} className="no-underline">
                            <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg p-3 gap-3 cursor-pointer hover:bg-gray-100 transition-colors">
                                <Search className="w-5 h-5 text-gray-400" />
                                <span className="flex-1 text-gray-400">Where to?</span>
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setPickupTime(pickupTime === 'now' ? 'later' : 'now');
                                    }}
                                    className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors"
                                >
                                    <Calendar className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm text-gray-700">
                                        {pickupTime === 'now' ? 'Now' : 'Later'}
                                    </span>
                                </button>
                            </div>
                        </Link>
                    </div>
                </div>
                
                <div className="mt-6">
                    <h2 className="heading-2 mb-4">Services</h2>
                    <div className="grid grid-cols-4 gap-3">
                        {additionalServices.map((service) => (
                            <button key={service.name} className="flex flex-col items-center justify-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <service.icon className="w-8 h-8 text-gray-700 mb-2" />
                                <p className="text-xs text-center text-gray-600 leading-tight">{service.name}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="heading-2 mb-4">Promotions</h2>
                    <Card className="bg-white hover:bg-gray-50 transition-colors border">
                        <CardContent className="p-0">
                            {/* Promotional Image */}
                            <div className="h-32 bg-gray-200 rounded-t-lg flex items-center justify-center">
                                <div className="text-gray-600 text-center">
                                    <Droplet className="w-12 h-12 mx-auto mb-2 opacity-80" />
                                    <p className="text-sm font-medium">Oil Change Special</p>
                                </div>
                            </div>
                            
                            {/* Promotion Details */}
                            <div className="p-4 space-y-1">
                                <p className="text-lg font-bold text-gray-900">$10 off Oil Change</p>
                                <p className="text-sm text-gray-700 font-medium">Oilstop</p>
                                <p className="text-sm text-gray-600">33-Points Service</p>
                                <p className="text-xs text-gray-500">Round Trip Auzo Service Included</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-[10px] mt-8">
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
        </div>
    );
};

export default HomePage;
