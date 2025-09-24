
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function OpeningScreen() {
  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center min-h-0">
        <div className="flex flex-col items-center justify-center max-w-md mx-auto">
          <h1 className="heading-1 mb-4">Auzo</h1>
          <p className="body-large text-muted-foreground">
            Your car, serviced with ease. Get pickups, drop-offs, and services scheduled in minutes.
          </p>
        </div>
      </div>

      <div className="p-4 pb-20 flex flex-col gap-3 shrink-0">
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
    </div>
  );
}
