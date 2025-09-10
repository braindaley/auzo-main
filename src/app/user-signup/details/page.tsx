
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const detailsSchema = z.object({
  firstName: z.string().min(2, "First name is required."),
  lastName: z.string().min(2, "Last name is required."),
  terms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions.",
  }),
});

export default function UserDetailsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      terms: false,
    },
  });

  const onSubmit = (values: z.infer<typeof detailsSchema>) => {
    console.log("User details submitted:", values);
    toast({
        title: "Signup Successful!",
        description: "Welcome to Auzo. Let's get your car serviced.",
    });
    router.push('/home');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isTransparent={false}>
         <Button variant="ghost" size="icon" onClick={() => router.push('/user-signup/terms')}>
            <ArrowLeft />
         </Button>
      </Header>
      <main className="flex-1 flex flex-col p-4 md:p-8">
        <div className="flex-1 flex flex-col justify-center">
          <div className="w-full max-w-sm mx-auto">
             <div className="mb-8">
                <h1 className="text-2xl font-bold">What's your name?</h1>
                <p className="text-muted-foreground text-sm mt-1">Let us know how to properly address you.</p>
              </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="firstName" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="sr-only">First Name</FormLabel>
                        <FormControl>
                            <Input placeholder="First Name" {...field} className="bg-muted border-none h-14" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="lastName" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="sr-only">Last Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Last Name" {...field} className="bg-muted border-none h-14" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                    <FormItem className="pt-4">
                        <div className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                            <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>
                            Please accept our{" "}
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
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button type="submit" className="w-full h-12 text-lg !mt-12">Create Account</Button>
              </form>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
}
