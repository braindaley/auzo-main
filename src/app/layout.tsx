
import type {Metadata} from 'next';
import './globals.css';
import { ToasterClient } from "@/components/toaster-client";
import { MapProvider } from '@/components/map-provider';
import BottomNav from '@/components/bottom-nav';

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-gray-100 min-h-screen flex items-center justify-center p-4">
        <MapProvider>
            <div className="transform scale-90 origin-center">
                <main className="h-[844px] w-[390px] bg-background flex flex-col shadow-xl rounded-[2.5rem] overflow-hidden border border-gray-300">
                    <div className="flex-1 overflow-y-auto">
                        {children}
                    </div>
                    <BottomNav />
                </main>
            </div>
        </MapProvider>
        <ToasterClient />
      </body>
    </html>
  );
}
