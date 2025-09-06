
import BottomNav from '@/components/bottom-nav';
import Header from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Car, List } from 'lucide-react';
import Image from 'next/image';

const pastServices = [
  {
    id: 1,
    destination: 'Jiffy Lube, Costa Mesa',
    date: 'Aug 12, 2024',
    price: '$12.45',
    rideType: 'AuzoX',
    rideImage: 'https://picsum.photos/200/100',
    mapHint: 'map street',
  },
  {
    id: 2,
    destination: 'Honda Dealership, Costa Mesa',
    date: 'Jul 28, 2024',
    price: '$18.90',
    rideType: 'Priority',
    rideImage: 'https://picsum.photos/200/100',
    mapHint: 'map city',
  },
   {
    id: 3,
    destination: 'Southwest Airlines, SNA Airport',
    date: 'Jul 15, 2024',
    price: '$25.50',
    rideType: 'AuzoX',
    rideImage: 'https://picsum.photos/200/100',
    mapHint: 'map airport',
  },
];


const ActivityPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
        <Header isTransparent={false} />
        <main className="flex-1 pb-24">
            <div className="p-6">
                 <h1 className="text-3xl font-bold mb-6">Activity</h1>
                {pastServices.length > 0 ? (
                    <div className="space-y-4">
                        {pastServices.map((service) => (
                            <Card key={service.id} className="overflow-hidden bg-transparent border-none shadow-none">
                                <div className="flex items-center border-b pb-4">
                                    <div className="w-24 h-24 relative flex-shrink-0">
                                        <Image
                                            src={service.rideImage}
                                            alt={`Map to ${service.destination}`}
                                            fill
                                            className="object-cover rounded-lg"
                                            data-ai-hint={service.mapHint}
                                        />
                                    </div>
                                    <div className="p-4 flex-1">
                                        <p className="font-bold text-lg">{service.destination}</p>
                                        <p className="text-sm text-muted-foreground">{service.date} &middot; {service.price}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Car className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">{service.rideType}</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center text-muted-foreground pt-24">
                        <List className="w-16 h-16 mb-4" />
                        <h2 className="text-xl font-bold">No Past Activity</h2>
                        <p className="max-w-xs mt-2">Your completed services will appear here.</p>
                    </div>
                )}
            </div>
        </main>
        <BottomNav />
    </div>
  );
};

export default ActivityPage;
