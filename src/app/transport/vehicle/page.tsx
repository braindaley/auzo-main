
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
import { ArrowLeft } from 'lucide-react';

const vehicleSchema = z.object({
  year: z.string().regex(/^\d{4}$/, "Must be a 4-digit year."),
  make: z.string().min(2, "Make is required."),
  model: z.string().min(1, "Model is required."),
});


function VehicleDetailsForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof vehicleSchema>>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      year: searchParams.get('year') || "",
      make: searchParams.get('make') || "",
      model: searchParams.get('model') || "",
    },
  });

  const onSubmit = (values: z.infer<typeof vehicleSchema>) => {
    const queryParams = new URLSearchParams(searchParams.toString());
    queryParams.set('year', values.year);
    queryParams.set('make', values.make);
    queryParams.set('model', values.model);
    router.push(`/transport/review?${queryParams.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
        <Header>
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft />
            </Button>
        </Header>
        <main className="flex-1 flex flex-col p-4 md:p-8 pb-24">
            <div className="flex-1 flex flex-col">
                <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">Enter Vehicle Details</h1>
                    <p className="text-muted-foreground">Tell us about the car being transported.</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Year</FormLabel>
                            <FormControl>
                            <Input placeholder="YYYY" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="make"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Make</FormLabel>
                            <FormControl>
                            <Input placeholder="e.g., Honda" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="model"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Model</FormLabel>
                            <FormControl>
                            <Input placeholder="e.g., Civic" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </form>
                </Form>
                </div>
            </div>
        </main>
        
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
            <div className="w-full max-w-md mx-auto px-8">
                <Button onClick={form.handleSubmit(onSubmit)} className="w-full h-12 text-lg">
                    Continue to Review
                </Button>
            </div>
        </div>
    </div>
  )
}

export default function VehicleDetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VehicleDetailsForm />
    </Suspense>
  );
}
