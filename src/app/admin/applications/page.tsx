"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { adminStorage } from '@/lib/admin-storage';
import { DriverApplication, AdminRole } from '@/lib/types/admin';

const ApplicationsPage = () => {
  const router = useRouter();
  const [applications, setApplications] = useState<DriverApplication[]>([]);
  const [role, setRole] = useState<AdminRole>(AdminRole.SUPPORT);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    loadApplications();
    setRole(adminStorage.getAdminRole());
  }, []);

  const loadApplications = () => {
    const data = adminStorage.getApplications();
    setApplications(data);
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const formatPhone = (phone: string) => {
    if (phone.length === 10) {
      return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
    }
    return phone;
  };

  const handleApplicationClick = (appId: string) => {
    router.push(`/admin/applications/${appId}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-gray-700" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-gray-700" />;
      default:
        return <Clock className="w-4 h-4 text-gray-700" />;
    }
  };

  const getBackgroundCheckBadge = (app: DriverApplication) => {
    if (!app.backgroundCheck) {
      return <Badge variant="outline" className="text-gray-600 border-gray-300">No Check</Badge>;
    }

    switch (app.backgroundCheck.status) {
      case 'pass':
        return <Badge variant="default" className="bg-black text-white">Passed</Badge>;
      case 'fail':
        return <Badge variant="outline" className="text-gray-700 border-gray-300">Failed</Badge>;
      default:
        return <Badge variant="outline" className="text-gray-600 border-gray-300">Pending</Badge>;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/admin')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Driver Applications</h1>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          {(['pending', 'approved', 'rejected', 'all'] as const).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                filter === filterOption
                  ? 'text-gray-900 border-b-2 border-black'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              {filterOption !== 'all' && (
                <span className="ml-2 text-gray-500">
                  ({applications.filter(a => a.status === filterOption).length})
                </span>
              )}
              {filterOption === 'all' && (
                <span className="ml-2 text-gray-500">({applications.length})</span>
              )}
            </button>
          ))}
        </div>

        {/* Applications List */}
        <div className="space-y-3">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No applications found</p>
            </div>
          ) : (
            filteredApplications.map((app) => (
              <Card
                key={app.id}
                className="border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleApplicationClick(app.id)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    {/* Row 1: Name and Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-700 font-medium">
                            {app.firstName.charAt(0)}{app.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {app.firstName} {app.lastName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatPhone(app.phone)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(app.status)}
                        <Badge
                          variant={app.status === 'approved' ? 'default' : 'outline'}
                          className={
                            app.status === 'approved'
                              ? 'bg-black text-white'
                              : 'text-gray-700 border-gray-300'
                          }
                        >
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    {/* Row 2: Background Check Status */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Background Check:</span>
                      {getBackgroundCheckBadge(app)}
                    </div>

                    {/* Row 3: Application Details */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{app.zipCode}</span>
                      <span>•</span>
                      <span>{app.licenseState} License</span>
                      <span>•</span>
                      <span>Age: {app.age}</span>
                    </div>

                    {/* Row 4: Submitted Date */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <span>
                        Submitted {new Date(app.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      {app.reviewedAt && (
                        <span>
                          Reviewed {new Date(app.reviewedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Summary */}
        <div className="text-center text-sm text-gray-500">
          Showing {filteredApplications.length} applications
        </div>
      </div>
    </div>
  );
};

export default ApplicationsPage;