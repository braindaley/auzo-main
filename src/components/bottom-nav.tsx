
"use client";

import { Home, Car, List, User } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { name: 'Home', href: '/home', icon: Home },
  { name: 'Garage', href: '/garage', icon: Car },
  { name: 'Account', href: '/account', icon: User },
];

const BottomNav = () => {
  const pathname = usePathname();

  // Hide on /drive pages as they have their own navigation
  if (pathname.startsWith('/drive')) {
    return null;
  }

  // Hide on /admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer 
      className="sticky bottom-0 z-10 border-t border-l-0 border-r-0 border-b-0" 
      style={{ 
        backgroundColor: '#ffffff !important',
        background: '#ffffff !important',
        borderTop: '1px solid #e5e7eb',
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom: 'none'
      }}
    >
      <div className="container mx-auto px-0">
        <div className="grid grid-cols-3">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              passHref 
              className="nav-link"
              style={{ textDecoration: 'none' }}
            >
                <Button
                variant="ghost"
                className={cn(
                    "flex flex-col items-center justify-center h-16 rounded-none w-full nav-button border-0 border-l-0 border-r-0",
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                )}
                style={{ 
                  textDecoration: 'none',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderLeft: 'none',
                  borderRight: 'none'
                }}
                >
                <item.icon 
                  className="w-6 h-6" 
                  style={{ width: '24px', height: '24px', marginBottom: '-4px' }}
                />
                <span 
                  className="text-xs nav-text" 
                  style={{ textDecoration: 'none', fontSize: '12px', marginTop: '-4px' }}
                >
                  {item.name}
                </span>
                </Button>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default BottomNav;
