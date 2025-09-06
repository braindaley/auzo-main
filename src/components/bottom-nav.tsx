
"use client";

import { Home, List, User } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { name: 'Home', href: '/home', icon: Home },
  { name: 'Activity', href: '/activity', icon: List },
  { name: 'Account', href: '/account', icon: User },
];

const BottomNav = () => {
  const pathname = usePathname();

  return (
    <footer className="sticky bottom-0 z-10 bg-card border-t">
      <div className="container mx-auto px-0">
        <div className="grid grid-cols-3">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} passHref>
                <Button
                variant="ghost"
                className={cn(
                    "flex flex-col items-center justify-center h-16 rounded-none w-full",
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                )}
                >
                <item.icon className="w-6 h-6 mb-1" />
                <span className="text-xs">{item.name}</span>
                </Button>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default BottomNav;
