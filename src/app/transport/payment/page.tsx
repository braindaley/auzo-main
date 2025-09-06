
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const paymentSchema = z.object({
  cardNumber: z.string().min(13, "Please enter a valid card number.").max(19, "Please enter a valid card number."),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Please use MM/YY format."),
  cvv: z.string().regex(/^\d{3,4}$/, "Please enter a valid CVV."),
  nameOnCard: z.string().min(2, "Name is required."),
  zipCode: z.string().regex(/^\d{5}(?:[-\s]\d{4})?$/, "Please enter a valid ZIP code."),
});

const formatCardNumber = (value: string) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = matches && matches[0] || '';
  const parts = [];
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }
  if (parts.length) {
    return parts.join(' ').substring(0, 19); // Max 16 digits + 3 spaces
  } else {
    return v;
  }
};

const formatExpiryDate = (value: string) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  if (v.length >= 2) {
    return v.substring(0, 2) + '/' + v.substring(2, 4);
  }
  return v;
};

const formatCVV = (value: string) => {
  return value.replace(/[^0-9]/gi, '').substring(0, 4);
};

const formatZipCode = (value: string) => {
  const v = value.replace(/[^0-9]/gi, '');
  return v.substring(0, 5);
};

function PaymentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

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
      description: "Your transport service has been booked.",
    });
    
    const queryParams = new URLSearchParams(searchParams.toString());
    router.push(`/track-driver?${queryParams.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
        <Header>
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft />
            </Button>
        </Header>
        <main className="flex-1 flex flex-col p-4 md:p-8 pb-24">
            <div className="w-full max-w-md mx-auto space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
                        <CreditCard />
                        Payment Details
                    </h1>
                    <p className="text-muted-foreground">Enter your credit card information to complete the booking.</p>
                </div>
                
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="cardNumber"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Card Number</FormLabel>
                            <FormControl>
                            <Input 
                                placeholder="0000 0000 0000 0000" 
                                {...field}
                                onChange={(e) => {
                                    const formatted = formatCardNumber(e.target.value);
                                    field.onChange(formatted);
                                }}
                            />
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
                                <Input 
                                    placeholder="MM/YY" 
                                    {...field}
                                    onChange={(e) => {
                                        const formatted = formatExpiryDate(e.target.value);
                                        field.onChange(formatted);
                                    }}
                                />
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
                                <Input 
                                    placeholder="123" 
                                    {...field}
                                    onChange={(e) => {
                                        const formatted = formatCVV(e.target.value);
                                        field.onChange(formatted);
                                    }}
                                />
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
                            <Input 
                                placeholder="90210" 
                                {...field}
                                onChange={(e) => {
                                    const formatted = formatZipCode(e.target.value);
                                    field.onChange(formatted);
                                }}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </form>
                </Form>
            </div>
        </main>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
            <div className="w-full max-w-md mx-auto px-8">
                <Button onClick={form.handleSubmit(onSubmit)} className="w-full h-12 text-lg">
                    Confirm Payment
                </Button>
            </div>
        </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentForm />
    </Suspense>
  );
}
