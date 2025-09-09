
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, ArrowRight, PartyPopper } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const locationSchema = z.object({
  location: z.string().min(2, "Location is required."),
});

const availabilitySchema = z.object({
  availability: z.enum(["asap", "later", "not-sure"], {
    required_error: "You need to select a start time.",
  }),
});

const ageSchema = z.object({
  age: z.enum(["18-24", "25+"], {
    required_error: "You need to select an age group.",
  }),
  consent: z.boolean().refine(val => val === true, {
    message: "You must agree to the background check.",
  }),
});

const formSchemas = [locationSchema, availabilitySchema, ageSchema, z.object({})];

export default function DriverSignupPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchemas[currentStep]),
    defaultValues: {
      location: "",
      availability: undefined,
      age: undefined,
      consent: false,
    },
  });

  const onSubmit = (values: any) => {
    console.log("Form values for step", currentStep, values);
    if (currentStep < formSchemas.length - 2) {
      setCurrentStep(currentStep + 1);
    } else {
        // Final step
        setCurrentStep(currentStep + 1);
        toast({
            title: "Signup Successful!",
            description: "Welcome to the Auzo team.",
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
        <div className="flex-1 flex flex-col justify-center">
          <div className="w-full max-w-lg mx-auto">
            <div className="p-6">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">Become a Driver</h1>
                <p className="text-muted-foreground">Join our team to pick up and deliver cars for service.</p>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
                <div className="min-h-[280px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      {currentStep === 0 && (
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg">Where would you like to earn?</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., San Francisco, CA" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      {currentStep === 1 && (
                        <FormField
                          control={form.control}
                          name="availability"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-lg">When do you plan to start earning?</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-2"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="asap" />
                                    </FormControl>
                                    <FormLabel className="font-normal">As soon as possible</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="later" />
                                    </FormControl>
                                    <FormLabel className="font-normal">At a later date</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="not-sure" />
                                    </FormControl>
                                    <FormLabel className="font-normal">I'm not sure yet</FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      {currentStep === 2 && (
                        <div className="space-y-6">
                          <FormField
                            control={form.control}
                            name="age"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel className="text-lg">What's your age?</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-2"
                                  >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl><RadioGroupItem value="18-24" /></FormControl>
                                      <FormLabel className="font-normal">18-24 years</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl><RadioGroupItem value="25+" /></FormControl>
                                      <FormLabel className="font-normal">25 years or older</FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                           <FormField
                            control={form.control}
                            name="consent"
                            render={({ field }) => (
                              <FormItem>
                                  <Alert>
                                      <AlertDescription>
                                          We partner with a third-party to run a background check on all drivers.
                                      </AlertDescription>
                                  </Alert>
                                  <div className="flex items-center space-x-2 mt-4">
                                      <FormControl>
                                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                      </FormControl>
                                      <label
                                          htmlFor="consent"
                                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                      >
                                      I agree and acknowledge the background check.
                                      </label>
                                  </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                      {isFinalStep && (
                          <div className="text-center flex flex-col items-center gap-4 py-8">
                              <PartyPopper className="w-16 h-16 text-primary" />
                              <h2 className="text-2xl font-bold">You're All Set!</h2>
                              <p className="text-muted-foreground max-w-sm">
                                  Thank you for signing up. We're reviewing your information and will be in touch soon.
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
                  <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 0}>
                          <ArrowLeft />
                          Back
                      </Button>
                      <Button type="submit">
                          Continue
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
