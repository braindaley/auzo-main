
"use client";

import { useState, Suspense, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';

import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Car, ArrowLeft } from 'lucide-react';


const verificationSchema = z.object({
  code: z.array(z.string()).length(4, "Code must be 4 digits.").refine(data => data.every(s => s.length === 1), "All fields must be filled"),
});

function VerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone');
  const flow = searchParams.get('flow');
  const isLoginFlow = flow === 'login';
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const form = useForm({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: ["", "", "", ""],
    },
  });
  
  const { control, handleSubmit, setValue, trigger } = form;

  const onSubmit = (values: z.infer<typeof verificationSchema>) => {
    const code = values.code.join('');
    console.log("Verification code submitted:", code);
    if (isLoginFlow) {
        router.push('/home');
    } else {
        router.push(`/user-signup/details?phone=${encodeURIComponent(phone || '')}`);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
     if (value.length === 1 && /^\d$/.test(value)) {
      setValue(`code.${index}`, value);
      trigger(`code.${index}`);
      if (index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !(e.target as HTMLInputElement).value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
       <Header isTransparent={false}>
          <Button variant="ghost" size="icon" onClick={() => {
              const params = new URLSearchParams();
              if (flow) params.set('flow', flow);
              router.push(`/user-signup${params.toString() ? '?' + params.toString() : ''}`);
            }}>
              <ArrowLeft />
          </Button>
       </Header>
      <main className="flex-1 flex flex-col p-4 md:p-8">
        <div className="flex-1 flex flex-col justify-center">
          <div className="w-full max-w-sm mx-auto">
             <div className="mb-8">
                <h1 className="text-2xl font-bold">Enter your code</h1>
                <p className="text-muted-foreground text-sm mt-2">
                    A 4-digit code was sent to {phone}. <Button variant="link" className="p-0 h-auto text-primary">Resend Code</Button>
                </p>
              </div>

            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Controller
                  control={control}
                  name="code"
                  render={({ field, fieldState }) => (
                    <div className="space-y-2">
                      <div className="flex justify-between gap-4">
                        {[0, 1, 2, 3].map(index => (
                           <FormControl key={index}>
                            <Input
                              ref={el => inputRefs.current[index] = el}
                              maxLength={1}
                              type="tel"
                              pattern="\d*"
                              className="w-16 h-16 text-2xl text-center bg-muted border-none"
                              onChange={(e) => handleInputChange(e, index)}
                              onKeyDown={(e) => handleKeyDown(e, index)}
                              value={field.value[index]}
                            />
                           </FormControl>
                        ))}
                      </div>
                       {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                    </div>
                  )}
                />
                
                <Button type="submit" className="w-full h-12 text-lg !mt-12">Continue</Button>
              </form>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function VerificationPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <VerificationContent />
    </Suspense>
  );
}
