
"use client";

import { useState, Suspense, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';

import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Car, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
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

const signupSchema = z.object({
  phone: z.string().min(1, "Phone number is required."),
});

const socialSchema = z.object({
    emailOrPhone: z.string().min(1, "Email or phone number is required").refine((value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
        return emailRegex.test(value) || phoneRegex.test(value);
    }, "Please enter a valid email or phone number in the format (###) ###-####."),
    password: z.string().min(1, "Password is required."),
});


const AppleIcon = () => (
    <svg height="20" viewBox="0 0 16 16" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M13.438 11.625c-.02-2.149 1.583-3.122 1.623-3.162-.962-1.545-2.51-1.74-3.04-.199-.572 1.66-1.583 4.256 0 5.436 1.423 1.043 2.921.438 2.921.438s.079-1.513-1.504-2.513zm-3.08-.02c-.752.02-.633.418-.633.418s.06.458.673.438c.613-.02.693-.438.693-.438s-.04-.418-.733-.418zm-1.805-5.315c.513-.614 1.023-1.66 1.023-2.736 0-1.222-.871-1.483-.871-1.483s-1.844-.06-2.821 1.442c-.852 1.343-1.683 3.414-1.122 5.176.633 1.94 2.149 2.592 2.8 2.592.572 0 1.203-.4 1.203-.4s-.922-.458-1.023-1.583c-.12-.983.812-2.426.812-2.426z"/></svg>
)

const GoogleIcon = () => (
    <svg height="20" viewBox="0 0 24 24" width="20"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path><path d="M1 1h22v22H1z" fill="none"></path></svg>
)

const GoogleLogo = () => (
    <span className="text-2xl font-bold">
        <span style={{color: '#4285F4'}}>G</span>
        <span style={{color: '#EA4335'}}>o</span>
        <span style={{color: '#FBBC05'}}>o</span>
        <span style={{color: '#4285F4'}}>g</span>
        <span style={{color: '#34A853'}}>l</span>
        <span style={{color: '#EA4335'}}>e</span>
    </span>
);


function UserSignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSocialSignupOpen, setIsSocialSignupOpen] = useState(false);
  const [socialProvider, setSocialProvider] = useState<'apple' | 'google' | null>(null);

  const flow = searchParams.get('flow');
  const isLoginFlow = flow === 'login';

  const phoneForm = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      phone: "",
    },
  });

  const socialForm = useForm({
      resolver: zodResolver(socialSchema),
      defaultValues: {
          emailOrPhone: "",
          password: "",
      }
  });

  useEffect(() => {
    if (isLoginFlow && isSocialSignupOpen) {
        socialForm.setValue('emailOrPhone', 'test@gmail.com');
        socialForm.setValue('password', Math.random().toString(36).slice(-8));
    }
  }, [isLoginFlow, isSocialSignupOpen, socialForm]);


  const onPhoneSubmit = (values: z.infer<typeof signupSchema>) => {
    const params = new URLSearchParams();
    params.set('phone', values.phone);
    if (isLoginFlow) {
        params.set('flow', 'login');
    }
    router.push(`/user-signup/verify?${params.toString()}`);
  };

  const handleSocialLogin = (provider: 'apple' | 'google') => {
      setSocialProvider(provider);
      setIsSocialSignupOpen(true);
  }

  const onSocialSubmit = (values: z.infer<typeof socialSchema>) => {
    console.log("Social signup details:", values, "Provider:", socialProvider);
    setIsSocialSignupOpen(false);
    if (isLoginFlow) {
        router.push('/home');
    } else {
        router.push(`/user-signup/terms?provider=${socialProvider}`);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isTransparent={false} disableLogoLink={true} hideAccountIcon={true} />
      <main className="flex-1 flex flex-col p-4 md:p-8">
        <div className="flex-1 flex flex-col justify-center">
          <div className="w-full max-w-sm mx-auto">
             <div className="text-left mb-8">
                <h1 className="heading-1">{isLoginFlow ? 'Welcome Back' : 'Get started'}</h1>
                <p className="body-base text-muted-foreground mt-1">{isLoginFlow ? 'Enter your phone to log in.' : 'Enter your phone to get started.'}</p>
              </div>

            <Form {...phoneForm}>
              <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
                <FormField
                  control={phoneForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Mobile phone number</FormLabel>
                      <FormControl>
                        <Input 
                            placeholder="Mobile phone number" 
                            type="tel"
                            {...field}
                            onChange={(e) => {
                                const formatted = formatPhoneNumber(e.target.value);
                                field.onChange(formatted);
                            }}
                            className="bg-muted border-none h-14"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="lg" className="w-full">Continue</Button>
              </form>
            </Form>

            <div className="flex items-center my-6">
                <div className="flex-grow border-t border-muted"></div>
                <span className="flex-shrink mx-4 body-small text-muted-foreground">or</span>
                <div className="flex-grow border-t border-muted"></div>
            </div>

            <div className="space-y-3">
                <Button variant="secondary" size="lg" className="w-full justify-start" onClick={() => handleSocialLogin('apple')}>
                    <AppleIcon /> <span className="flex-1 text-center">Continue with Apple</span>
                </Button>
                <Button variant="secondary" size="lg" className="w-full justify-start" onClick={() => handleSocialLogin('google')}>
                    <GoogleIcon /> <span className="flex-1 text-center">Continue with Google</span>
                </Button>
            </div>

            <p className="caption text-center mt-8">
              By proceeding, you consent to get calls, WhatsApp or SMS messages, including by automated dialer, from Auzo and its affiliates to the number provided.
            </p>
          </div>
        </div>
      </main>

      <Dialog open={isSocialSignupOpen} onOpenChange={setIsSocialSignupOpen}>
        <DialogContent className="max-w-sm bg-background border-border">
            {socialProvider === 'apple' ? (
                <>
                <DialogHeader className="text-center pt-6 pb-4">
                    <div className="mx-auto mb-4">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-foreground">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                        </svg>
                    </div>
                    <DialogTitle className="heading-3">Sign in with your Apple ID</DialogTitle>
                    <p className="body-small text-muted-foreground mt-2">Use Touch ID or enter your password to sign in.</p>
                </DialogHeader>
                <div className="px-6 pb-6 space-y-4">
                    <div className="bg-muted border border-border rounded-lg p-4 text-center shadow-sm">
                        <div className="w-16 h-16 bg-secondary rounded-full mx-auto mb-3 flex items-center justify-center">
                            <span className="text-foreground text-xl font-medium">JD</span>
                        </div>
                        <p className="text-foreground font-medium">john.doe@icloud.com</p>
                        <p className="body-small text-muted-foreground">Apple ID</p>
                    </div>
                    <div className="space-y-3">
                        <Button 
                            size="lg"
                            className="w-full"
                            onClick={() => onSocialSubmit({ emailOrPhone: 'john.doe@icloud.com', password: 'demo' })}
                        >
                            Use Touch ID
                        </Button>
                        <Button 
                            variant="outline" 
                            size="lg"
                            className="w-full"
                            onClick={() => onSocialSubmit({ emailOrPhone: 'john.doe@icloud.com', password: 'demo' })}
                        >
                            Use Password
                        </Button>
                    </div>
                    <div className="pt-2">
                        <Link href="#" className="text-primary body-small hover:underline block text-center">
                            Use a different Apple ID
                        </Link>
                    </div>
                </div>
                </>
            ) : (
                <>
                <DialogHeader className="text-center pt-6 pb-4">
                    <div className="mx-auto mb-4">
                        <GoogleLogo />
                    </div>
                    <DialogTitle className="text-xl font-normal">Choose an account</DialogTitle>
                    <p className="text-sm text-gray-600 mt-2">to continue to Auzo</p>
                </DialogHeader>
                <div className="px-6 pb-6 space-y-4">
                    <div className="bg-gray-100 border-2 border-gray-400 rounded-lg p-4 text-left shadow-md hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer"
                         onClick={() => onSocialSubmit({ emailOrPhone: 'john.doe@gmail.com', password: 'demo' })}>
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">JD</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">John Doe</p>
                                <p className="text-sm text-gray-600">john.doe@gmail.com</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-100 border-2 border-gray-400 rounded-lg p-4 text-center hover:bg-gray-200 hover:border-blue-300 shadow-md hover:shadow-lg transition-all cursor-pointer"
                         onClick={() => onSocialSubmit({ emailOrPhone: 'different@gmail.com', password: 'demo' })}>
                        <div className="flex items-center justify-center space-x-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#5f6368"/>
                            </svg>
                            <span className="text-sm text-gray-700">Use another account</span>
                        </div>
                    </div>
                    <div className="pt-2 text-center">
                        <Link href="#" className="text-blue-600 text-sm hover:underline">
                            Privacy Policy
                        </Link>
                        <span className="text-gray-400 mx-2">•</span>
                        <Link href="#" className="text-blue-600 text-sm hover:underline">
                            Terms of Service
                        </Link>
                    </div>
                </div>
                </>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function UserSignupPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <UserSignupContent />
    </Suspense>
  );
}
