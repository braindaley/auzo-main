
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, LifeBuoy, Wallet, List, ChevronRight, Gift, ShieldCheck, Leaf, Users } from 'lucide-react';
import Image from 'next/image';

const AccountPage = () => {
  const menuItems = [
    { icon: LifeBuoy, label: 'Help' },
    { icon: Wallet, label: 'Wallet' },
    { icon: List, label: 'Activity' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
        <main className="flex-1 bg-background pb-24">
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Katie Gasper</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <Star className="w-4 h-4 text-primary fill-primary" />
                            <span className="font-semibold">5.00</span>
                            <Badge variant="secondary">Not verified</Badge>
                        </div>
                    </div>
                    <Avatar className="w-16 h-16">
                        <AvatarImage src="https://picsum.photos/100" data-ai-hint="person" />
                        <AvatarFallback>KG</AvatarFallback>
                    </Avatar>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {menuItems.map((item) => (
                        <Card key={item.label} className="p-4 flex flex-col items-center justify-center gap-2 border-none">
                           <item.icon className="w-6 h-6 text-foreground" />
                           <span className="text-sm font-medium">{item.label}</span>
                        </Card>
                    ))}
                </div>

                <div className="space-y-4">
                     <Card className="overflow-hidden border">
                        <div className="p-4 flex items-center justify-between">
                            <div>
                                <p className="font-bold">Try Auzo One free</p>
                                <p className="text-sm text-muted-foreground">5 months free of 6% Auzo One credits on rides</p>
                            </div>
                             <Image src="https://picsum.photos/80/80" data-ai-hint="gift box" alt="gift box" width={60} height={60} className="rounded-lg" />
                        </div>
                    </Card>
                     <Card className="overflow-hidden border">
                        <div className="p-4 flex items-center justify-between">
                            <div>
                                <p className="font-bold">Safety checkup</p>
                                <p className="text-sm text-muted-foreground">Learn ways to make rides safer</p>
                            </div>
                            <div className="relative w-16 h-16">
                                <svg className="w-full h-full" viewBox="0 0 36 36">
                                    <path
                                        className="text-border"
                                        d="M18 2.0845
                                        a 15.9155 15.9155 0 0 1 0 31.831
                                        a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                    />
                                    <path
                                        className="text-primary"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeDasharray="14, 100"
                                        d="M18 2.0845
                                        a 15.9155 15.9155 0 0 1 0 31.831
                                        a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                 <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-sm font-bold">1/7</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                     <Card className="overflow-hidden border">
                        <div className="p-4 flex items-center justify-between">
                            <p className="font-bold">Estimated CO₂ saved</p>
                            <div className="flex items-center gap-2">
                                <Leaf className="w-5 h-5 text-green-500" />
                                <span className="font-bold">0 g</span>
                            </div>
                        </div>
                    </Card>
                    <Card className="overflow-hidden border">
                         <div className="p-4 flex items-center justify-between">
                            <div>
                                <p className="font-bold">Invite friends to Auzo</p>
                                <p className="text-sm text-muted-foreground">You will get 50% off 2 rides</p>
                            </div>
                            <Image src="https://picsum.photos/120/80" data-ai-hint="people friends" alt="Invite friends" width={100} height={60} className="rounded-lg" />
                        </div>
                    </Card>
                </div>
                 <div className="space-y-2">
                     <button className="w-full flex items-center justify-between p-4 bg-card rounded-lg border">
                        <div className="flex items-center gap-4">
                            <Users className="w-5 h-5 text-foreground" />
                            <div>
                                <p className="font-semibold text-left">Family</p>
                                <p className="text-sm text-muted-foreground text-left">Manage a family profile</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </button>
                 </div>
            </div>
        </main>
    </div>
  );
};

export default AccountPage;
