
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

export default function OpeningScreen() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <h1 className="heading-1 mb-4">Auzo</h1>
            <p className="body-large text-muted-foreground max-w-md mx-auto">
                Your car, serviced with ease. Get pickups, drop-offs, and services scheduled in minutes.
            </p>
        </div>

        <div className="p-4 pb-10 flex flex-col gap-[10px]">
          <Link href={"/user-signup"} passHref>
            <Button size="lg" className="w-full h-14">
              Sign up
            </Button>
          </Link>
          <Link href={"/user-signup?flow=login"} passHref>
            <Button variant="secondary" size="lg" className="w-full h-14">
              Log in
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
