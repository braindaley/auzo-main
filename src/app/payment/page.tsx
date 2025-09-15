
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState, useEffect } from 'react';

import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CreditCard, Building2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { User, UserRole } from '@/lib/types/user-management';

const paymentSchema = z.object({
  paymentMethod: z.enum(['credit_card', 'bill_to_owner']),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  nameOnCard: z.string().optional(),
  zipCode: z.string().optional(),
}).refine((data) => {
  if (data.paymentMethod === 'credit_card') {
    return data.cardNumber && data.expiryDate && data.cvv && data.nameOnCard && data.zipCode &&
           data.cardNumber.length >= 13 && data.cardNumber.length <= 19 &&
           /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(data.expiryDate) &&
           /^\d{3,4}$/.test(data.cvv) &&
           data.nameOnCard.length >= 2 &&
           /^\d{5}(?:[-\s]\d{4})?$/.test(data.zipCode);
  }
  return true;
}, {
  message: "Please fill in all credit card fields when paying with credit card",
  path: ["cardNumber"]
});

function PaymentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [ownerUser, setOwnerUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    // Mock current user for now - this would come from auth context
    const mockCurrentUser: User = {
      id: 'member-user-id',
      firstName: 'John',
      lastName: 'Doe', 
      phoneNumber: '(555) 123-4567',
      role: UserRole.MEMBER, // Change to OWNER to test owner flow
      ownerId: 'owner-user-id',
      status: 'active' as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockOwnerUser: User = {
      id: 'owner-user-id',
      firstName: 'Jane',
      lastName: 'Smith',
      phoneNumber: '(555) 987-6543',
      role: UserRole.OWNER,
      status: 'active' as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setCurrentUser(mockCurrentUser);
    if (mockCurrentUser.role === UserRole.MEMBER && mockCurrentUser.ownerId) {
      setOwnerUser(mockOwnerUser);
    }
    setIsLoading(false);
  }, []);

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: 'credit_card',
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      nameOnCard: "",
      zipCode: "",
    },
  });

  const paymentMethod = form.watch('paymentMethod');

  const onSubmit = (values: z.infer<typeof paymentSchema>) => {
    console.log("Payment details submitted:", values);
    
    const billingInfo = {
      userId: currentUser?.id,
      billedToUserId: values.paymentMethod === 'bill_to_owner' ? ownerUser?.id : currentUser?.id,
      paymentMethod: values.paymentMethod,
      ownerName: values.paymentMethod === 'bill_to_owner' ? `${ownerUser?.firstName} ${ownerUser?.lastName}` : undefined,
    };
    
    console.log("Billing info:", billingInfo);
    
    toast({
      title: "Order Confirmed!",
      description: values.paymentMethod === 'bill_to_owner' 
        ? `Order will be billed to ${ownerUser?.firstName} ${ownerUser?.lastName}`
        : "Payment processed successfully",
    });
    
    const queryParams = new URLSearchParams(searchParams.toString());
    router.push(`/track-driver?${queryParams.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <Button variant="ghost" onClick={() => {
        const queryParams = new URLSearchParams(searchParams.toString());
        const service = queryParams.get('service');
        
        // Check if this came from checkout (oil change with add-ons) or directly from review
        if (service?.toLowerCase().includes('oil change') && queryParams.has('addOnName')) {
          router.push(`/checkout?${queryParams.toString()}`);
        } else {
          router.push(`/review-details?${queryParams.toString()}`);
        }
      }} className="mb-4">
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

              {/* Payment Method Selection - only show for members */}
              {currentUser?.role === UserRole.MEMBER && ownerUser && (
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Payment Method</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="space-y-3"
                        >
                          <div className="flex items-center space-x-2 p-3 border rounded-lg">
                            <RadioGroupItem value="credit_card" id="credit_card" />
                            <Label htmlFor="credit_card" className="flex items-center space-x-2 cursor-pointer flex-1">
                              <CreditCard className="w-4 h-4" />
                              <span>Pay with Credit Card</span>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 border rounded-lg">
                            <RadioGroupItem value="bill_to_owner" id="bill_to_owner" />
                            <Label htmlFor="bill_to_owner" className="flex items-center space-x-2 cursor-pointer flex-1">
                              <Building2 className="w-4 h-4" />
                              <div>
                                <div>Bill to {ownerUser.firstName} {ownerUser.lastName}</div>
                                <div className="text-xs text-muted-foreground">
                                  This order will be charged to your owner's account
                                </div>
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Credit Card Form - only show when credit card is selected */}
              {paymentMethod === 'credit_card' && (
                <div className="space-y-6">
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
                </div>
              )}

              {/* Bill to Owner Confirmation */}
              {paymentMethod === 'bill_to_owner' && ownerUser && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-blue-900">
                    <Building2 className="w-5 h-5" />
                    <div>
                      <div className="font-medium">Billing to {ownerUser.firstName} {ownerUser.lastName}</div>
                      <div className="text-sm text-blue-700">
                        This order will be charged to your owner's account. No payment method required.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full h-12 text-lg">
                {paymentMethod === 'bill_to_owner' ? 'Confirm Order' : 'Confirm Payment'}
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
