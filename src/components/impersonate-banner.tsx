"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { adminStorage } from '@/lib/admin-storage';

export const ImpersonateBanner = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [impersonation, setImpersonation] = useState<{ type: 'customer' | 'driver', id: string, name: string } | null>(null);

  useEffect(() => {
    const data = adminStorage.getImpersonation();
    setImpersonation(data);
  }, [pathname]);

  const handleExit = () => {
    adminStorage.clearImpersonation();
    setImpersonation(null);
    router.push('/admin');
  };

  if (!impersonation || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black text-white px-4 py-2 flex items-center justify-between">
      <div className="text-sm">
        <span className="font-medium">Impersonating:</span> {impersonation.name} ({impersonation.type})
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleExit}
        className="text-white hover:bg-gray-800"
      >
        <X className="w-4 h-4 mr-1" />
        Exit
      </Button>
    </div>
  );
};