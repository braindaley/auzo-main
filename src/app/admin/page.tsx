"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Car, FileText, Tag, CreditCard, Settings, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { adminStorage } from '@/lib/admin-storage';
import { AdminRole } from '@/lib/types/admin';

const adminSections = [
  {
    name: 'Customers',
    href: '/admin/customers',
    icon: Users,
    description: 'Manage customer accounts',
    count: 'customers'
  },
  {
    name: 'Drivers',
    href: '/admin/drivers',
    icon: Car,
    description: 'Manage driver accounts',
    count: 'drivers'
  },
  {
    name: 'Applications',
    href: '/admin/applications',
    icon: FileText,
    description: 'Review driver applications',
    count: 'applications'
  },
  {
    name: 'Promotions',
    href: '/admin/promotions',
    icon: Tag,
    description: 'Manage promotions',
    count: 'promotions'
  }
];

const AdminPage = () => {
  const router = useRouter();
  const [role, setRole] = useState<AdminRole>(AdminRole.SUPPORT);
  const [counts, setCounts] = useState({
    customers: 0,
    drivers: 0,
    applications: 0,
    promotions: 0
  });

  useEffect(() => {
    const currentRole = adminStorage.getAdminRole();
    setRole(currentRole);

    // Load counts
    const customers = adminStorage.getCustomers();
    const drivers = adminStorage.getDrivers();
    const applications = adminStorage.getApplications().filter(a => a.status === 'pending');
    const promotions = adminStorage.getPromotions();

    setCounts({
      customers: customers.length,
      drivers: drivers.length,
      applications: applications.length,
      promotions: promotions.length
    });
  }, []);

  const handleRoleToggle = () => {
    const newRole = role === AdminRole.SUPPORT ? AdminRole.ADVANCED_OPS : AdminRole.SUPPORT;
    adminStorage.setAdminRole(newRole);
    setRole(newRole);
  };

  const getCount = (countKey: string): number => {
    return counts[countKey as keyof typeof counts] || 0;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/home')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {role === AdminRole.SUPPORT ? 'Support' : 'Advanced Ops'}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRoleToggle}
              className="text-gray-700 border-gray-300"
            >
              Switch Role
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{counts.customers}</div>
              <div className="text-sm text-gray-600">Total Customers</div>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{counts.drivers}</div>
              <div className="text-sm text-gray-600">Active Drivers</div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Cards */}
        <div className="space-y-3">
          {adminSections.map((section) => (
            <Link key={section.name} href={section.href} style={{ textDecoration: 'none' }}>
              <Card className="border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
                      <section.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{section.name}</h3>
                      <p className="text-sm text-gray-600">{section.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {section.count && (
                      <Badge variant="outline" className="text-gray-700 border-gray-300">
                        {getCount(section.count)}
                      </Badge>
                    )}
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Role Info */}
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <Settings className="w-4 h-4 text-gray-500 mt-0.5" />
              <div className="text-sm text-gray-700">
                <div className="font-medium mb-1">Current Role: {role === AdminRole.SUPPORT ? 'Support' : 'Advanced Operations'}</div>
                <div className="text-gray-600">
                  {role === AdminRole.SUPPORT
                    ? 'View-only access. Switch to Advanced Ops for full management capabilities.'
                    : 'Full access to all admin features and management tools.'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;