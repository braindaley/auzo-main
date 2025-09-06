
import type {Metadata} from 'next';
import './globals.css';
import { ToasterClient } from "@/components/toaster-client";
import { MapProvider } from '@/components/map-provider';

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
      <body className="font-body antialiased bg-background text-foreground">
        <MapProvider>
            <main className="min-h-screen max-w-md mx-auto bg-background flex flex-col">
                {children}
            </main>
        </MapProvider>
        <ToasterClient />
      </body>
    </html>
  );
}
