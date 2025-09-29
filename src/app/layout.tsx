
import type {Metadata} from 'next';
import './globals.css';
import { ToasterClient } from "@/components/toaster-client";
import BottomNav from '@/components/bottom-nav';
import { ImpersonateBanner } from '@/components/impersonate-banner';

export const metadata: Metadata = {
  title: 'Auzo Wheels',
  description: 'Your car, serviced with ease.',
  icons: null,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ height: '100%', margin: 0, padding: 0 }}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-gray-100 sm:bg-gray-100" style={{ height: '100%', margin: 0, padding: 0, overflow: 'hidden' }}>
        <ImpersonateBanner />
        <div className="h-full w-full flex items-center justify-center sm:p-8" style={{ minHeight: '100vh' }}>
            <main className="h-full w-full sm:h-[844px] sm:w-[390px] sm:rounded-[2.5rem] sm:shadow-xl sm:border sm:border-gray-300 bg-background flex flex-col relative overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
                <BottomNav />
            </main>
        </div>
        <ToasterClient />
      </body>
    </html>
  );
}
