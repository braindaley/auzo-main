
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';

import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, PartyPopper } from 'lucide-react';
import Link from 'next/link';

const formatPhoneNumber = (value: string) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, '');
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

const contactSchema = z.object({
  firstName: z.string().min(2, "First name is required."),
  lastName: z.string().min(2, "Last name is required."),
  email: z.string().email("Invalid email address."),
  phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Please enter a valid 10-digit phone number."),
});

const businessSchema = z.object({
  automotiveServiceName: z.string().min(2, "Automotive Service Name is required."),
  serviceAddress: z.string().min(5, "Service Address is required."),
});

const verificationSchema = z.object({
  code: z.string().length(4, "Code must be 4 digits."),
  terms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions.",
  }),
});

const formSchemas = [contactSchema, businessSchema, verificationSchema, z.object({}), z.object({})];

export default function PartnerSignupPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchemas[currentStep]),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      automotiveServiceName: "",
      serviceAddress: "",
      code: "",
      terms: false,
    },
  });

  const formData = form.watch();

  const onSubmit = (values: any) => {
    console.log("Form values for step", currentStep, values);
     if (currentStep < formSchemas.length - 2) {
      setCurrentStep(currentStep + 1);
    } else {
        setCurrentStep(currentStep + 1);
        toast({
            title: "Registration Complete!",
            description: "Thank you for partnering with Auzo.",
        });
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: -50 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: 50 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  const isFinalStep = currentStep === formSchemas.length - 1;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isTransparent={false} />
      <main className="flex-1 flex flex-col p-4 md:p-8">
         <div className="flex-1 flex flex-col">
            <div className="w-full max-w-lg mx-auto">
              <div className="p-6">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold">Service Partner Signup</h1>
                  <p className="text-muted-foreground">Register your car service center with our platform.</p>
                </div>
              </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="p-6">
                    <div className="min-h-[350px]">
                        <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                            className="space-y-6"
                        >
                            {currentStep === 0 && (
                                <div className="space-y-6">
                                    <FormField control={form.control} name="firstName" render={({ field }) => (
                                        <FormItem><FormLabel>First Name</FormLabel><FormControl><Input placeholder="John" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="lastName" render={({ field }) => (
                                        <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input placeholder="Doe" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="email" render={({ field }) => (
                                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="phone" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="(123) 456-7890" 
                                                    {...field} 
                                                    onChange={(e) => {
                                                        const formatted = formatPhoneNumber(e.target.value);
                                                        field.onChange(formatted);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            )}
                            {currentStep === 1 && (
                                <>
                                    <FormField control={form.control} name="automotiveServiceName" render={({ field }) => (
                                        <FormItem><FormLabel>Automotive Service Name</FormLabel><FormControl><Input placeholder="Auto Excellence" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="serviceAddress" render={({ field }) => (
                                        <FormItem><FormLabel>Service Address</FormLabel><FormControl><Input placeholder="123 Main St, Anytown, USA" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </>
                            )}
                            {currentStep === 2 && (
                                <>
                                    <FormField control={form.control} name="code" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>4-Digit Code</FormLabel>
                                            <FormControl><Input placeholder="1234" maxLength={4} {...field} /></FormControl>
                                            <FormMessage />
                                            <p className="text-sm text-muted-foreground">A code has been sent to your phone number.</p>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="terms" render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>Accept Auzo's terms and review notice</FormLabel>
                                            </div>
                                        </FormItem>
                                    )} />
                                </>
                            )}
                            {currentStep === 3 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Confirm Your Information</h3>
                                    <div className="p-4 border rounded-lg space-y-2 bg-muted/50">
                                        <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                                        <p><strong>Contact:</strong> {formData.email} | {formData.phone}</p>
                                        <p><strong>Service Name:</strong> {formData.automotiveServiceName}</p>
                                        <p><strong>Service Address:</strong> {formData.serviceAddress}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Please review your information before completing your registration.</p>
                                </div>
                            )}
                            {isFinalStep && (
                            <div className="text-center flex flex-col items-center gap-4 py-8">
                                    <PartyPopper className="w-16 h-16 text-primary" />
                                    <h2 className="text-2xl font-bold">Registration Complete!</h2>
                                    <p className="text-muted-foreground max-w-sm">
                                        Welcome aboard! We're excited to partner with you. You'll receive an email with next steps shortly.
                                    </p>
                                    <Link href="/" passHref>
                                        <Button>Back to Home</Button>
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                        </AnimatePresence>
                    </div>
                    {!isFinalStep && (
                        <div className="flex justify-between mt-8">
                            <Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 0}>
                                <ArrowLeft />
                                Back
                            </Button>
                            <Button type="submit">
                                {currentStep === formSchemas.length - 3 ? 'Confirm Info' : 'Continue'}
                                <ArrowRight />
                            </Button>
                        </div>
                    )}
                </form>
              </Form>
            </div>
         </div>
      </main>
    </div>
  );
}
