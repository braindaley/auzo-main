
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';

import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';

const paymentSchema = z.object({
  cardNumber: z.string().min(13, "Please enter a valid card number.").max(19, "Please enter a valid card number."),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Please use MM/YY format."),
  cvv: z.string().regex(/^\d{3,4}$/, "Please enter a valid CVV."),
  nameOnCard: z.string().min(2, "Name is required."),
  zipCode: z.string().regex(/^\d{5}(?:[-\s]\d{4})?$/, "Please enter a valid ZIP code."),
});

function PaymentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const totalPrice = parseFloat(searchParams.get('totalPrice') || '0');
  
  const baseServicePrice = useMemo(() => {
    const servicePrice = parseFloat(searchParams.get('servicePrice') || '0');
    const ridePrice = parseFloat(searchParams.get('ridePrice') || '0');
    return servicePrice + ridePrice;
  }, [searchParams]);

  const addOns = useMemo(() => {
    const addOnNames = searchParams.getAll('addOnName');
    const addOnPrices = searchParams.getAll('addOnPrice').map(p => parseFloat(p));
    return addOnNames.map((name, index) => ({
      name,
      price: addOnPrices[index] || 0,
    }));
  }, [searchParams]);


  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      nameOnCard: "",
      zipCode: "",
    },
  });

  const onSubmit = (values: z.infer<typeof paymentSchema>) => {
    console.log("Payment details submitted:", values);
    toast({
      title: "Payment Successful!",
      description: "Your ride has been confirmed.",
    });
    
    const queryParams = new URLSearchParams(searchParams.toString());
    router.push(`/track-driver?${queryParams.toString()}`);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard />
            Payment Details
          </CardTitle>
          <CardDescription>Enter your credit card information to complete the booking.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2 text-sm p-4 bg-muted rounded-lg">
                  <div className="flex justify-between">
                      <span>Base Service</span>
                      <span>${baseServicePrice.toFixed(2)}</span>
                  </div>
                  {addOns.map((addOn, index) => (
                      <div key={index} className="flex justify-between text-muted-foreground">
                          <span>{addOn.name}</span>
                          <span>+${addOn.price.toFixed(2)}</span>
                      </div>
                  ))}
                  <Separator className="my-2" />
                   <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
              </div>

              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input placeholder="0000 0000 0000 0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expires</FormLabel>
                      <FormControl>
                        <Input placeholder="MM/YY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cvv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVV</FormLabel>
                      <FormControl>
                        <Input placeholder="123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="nameOnCard"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name on Card</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP / Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="90210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-12 text-lg">
                Confirm Payment
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

function PaymentContent() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isTransparent={false} />
      <main className="flex-1 flex flex-col p-4 md:p-8">
        <Suspense fallback={<div>Loading...</div>}>
          <PaymentForm />
        </Suspense>
      </main>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
