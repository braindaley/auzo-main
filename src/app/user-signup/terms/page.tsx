
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const termsSchema = z.object({
  terms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions.",
  }),
});

export default function TermsOfServicePage() {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const provider = searchParams.get('provider');


  const form = useForm({
    resolver: zodResolver(termsSchema),
    defaultValues: {
      terms: false,
    },
  });

  const onSubmit = (values: z.infer<typeof termsSchema>) => {
    console.log("Terms accepted for provider:", provider);
    toast({
        title: "Signup Successful!",
        description: "Welcome to Auzo.",
    });
    router.push('/home');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isTransparent={false}>
         <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft />
         </Button>
      </Header>
      <main className="flex-1 flex flex-col p-4 md:p-8">
        <div className="flex-1 flex flex-col justify-center">
          <div className="w-full max-w-sm mx-auto">
             <div className="mb-8">
                <h1 className="text-2xl font-bold">Review our Terms</h1>
                <p className="text-muted-foreground text-sm mt-1">Please review and accept our terms to continue.</p>
              </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                 <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                    <FormItem className="pt-4">
                         <div className="rounded-md border p-4">
                            <div className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                    I agree to the Auzo{" "}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                        <span className="text-primary hover:underline cursor-pointer">
                                            Terms of Service
                                        </span>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Terms of Service</DialogTitle>
                                            <DialogDescription>
                                            Last updated: {new Date().toLocaleDateString()}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <ScrollArea className="h-72 w-full rounded-md border p-4">
                                            <p className="text-sm text-muted-foreground">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                            </p>
                                        </ScrollArea>
                                        </DialogContent>
                                    </Dialog>
                                    .
                                    </FormLabel>
                                </div>
                            </div>
                         </div>
                        <FormMessage className="pt-2" />
                    </FormItem>
                    )}
                />
                <Button type="submit" className="w-full h-12 text-lg !mt-12" disabled={!form.formState.isValid}>Continue</Button>
              </form>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
}
