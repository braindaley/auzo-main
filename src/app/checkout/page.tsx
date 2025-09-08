
"use client";

import { useMemo, useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, RefreshCw, Wind, Replace, PlusCircle, CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const addOnServices = [
    { id: 'tire-rotation', name: 'Tire Rotation', price: 25.00, icon: RefreshCw },
    { id: 'air-filter', name: 'Air Filter Replacement', price: 30.00, icon: Wind },
    { id: 'wiper-blades', name: 'Wiper Blade Replacement', price: 40.00, icon: Replace },
]

function AddOnsForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const service = searchParams.get('service');
  const isOilChangeService = service?.toLowerCase().includes('oil change');
  const basePrice = parseFloat(searchParams.get('totalPrice') || '0');

  useEffect(() => {
    if (!isOilChangeService) {
      // If not an oil change service, redirect directly to payment with existing params
      router.replace(`/payment?${searchParams.toString()}`);
    }
  }, [isOilChangeService, router, searchParams]);


  const addOnsPrice = useMemo(() => {
    return selectedAddOns.reduce((total, addOnId) => {
        const addOn = addOnServices.find(a => a.id === addOnId);
        return total + (addOn ? addOn.price : 0);
    }, 0);
  }, [selectedAddOns]);

  const totalPrice = basePrice + addOnsPrice;

  const handleContinue = () => {
    const queryParams = new URLSearchParams(searchParams.toString());
    queryParams.set('totalPrice', totalPrice.toFixed(2));
    selectedAddOns.forEach(id => {
        const addOn = addOnServices.find(a => a.id === id);
        if (addOn) {
            queryParams.append('addOnName', addOn.name);
            queryParams.append('addOnPrice', addOn.price.toFixed(2));
        }
    });
    router.push(`/payment?${queryParams.toString()}`);
  };

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns(prev => 
        prev.includes(addOnId)
            ? prev.filter(id => id !== addOnId)
            : [...prev, addOnId]
    );
  };
  
  if (!isOilChangeService) {
    return null; // Render nothing while redirecting
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2" />
        Back to Review
      </Button>

        <Card>
            <CardHeader>
                <CardTitle>Popular Add-ons</CardTitle>
                <CardDescription>Enhance your service with these popular options.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {addOnServices.map(addOn => {
                    const isSelected = selectedAddOns.includes(addOn.id);
                    return (
                        <Card key={addOn.id} className="bg-muted/50">
                            <CardContent className="p-4 flex items-center gap-4">
                                <addOn.icon className="w-8 h-8 text-primary" />
                                <div className="flex-1">
                                    <p className="font-semibold">{addOn.name}</p>
                                    <p className="text-sm text-muted-foreground">${addOn.price.toFixed(2)}</p>
                                </div>
                                <Button size="icon" variant={isSelected ? "default" : "outline"} onClick={() => toggleAddOn(addOn.id)}>
                                    {isSelected ? <CheckCircle className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
                                </Button>
                            </CardContent>
                        </Card>
                    )
                })}
            </CardContent>
        </Card>

        <div className="space-y-4">
             <div className="space-y-2 text-sm p-4 bg-muted rounded-lg">
                <div className="flex justify-between">
                    <span>Base Service</span>
                    <span>${basePrice.toFixed(2)}</span>
                </div>
                {selectedAddOns.map(addOnId => {
                    const addOn = addOnServices.find(a => a.id === addOnId);
                    return addOn ? (
                        <div key={addOnId} className="flex justify-between text-muted-foreground">
                            <span>{addOn.name}</span>
                            <span>+${addOn.price.toFixed(2)}</span>
                        </div>
                    ) : null
                })}
                <Separator className="my-2" />
                    <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                </div>
            </div>
            <Button onClick={handleContinue} className="w-full h-12 text-lg">
                Continue to Payment
            </Button>
        </div>
    </div>
  )
}

function CheckoutContent() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isTransparent={false} />
      <main className="flex-1 flex flex-col p-4 md:p-8">
        <Suspense fallback={<div>Loading...</div>}>
          <AddOnsForm />
        </Suspense>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
