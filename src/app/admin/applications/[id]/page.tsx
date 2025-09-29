"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, FileText, CheckCircle, XCircle, CreditCard, Shield, User } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { adminStorage } from '@/lib/admin-storage';
import { DriverApplication, AdminRole } from '@/lib/types/admin';

const ApplicationDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const appId = params.id as string;

  const [application, setApplication] = useState<DriverApplication | null>(null);
  const [role, setRole] = useState<AdminRole>(AdminRole.SUPPORT);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  useEffect(() => {
    const data = adminStorage.getApplication(appId);
    setApplication(data || null);
    setRole(adminStorage.getAdminRole());
  }, [appId]);

  const formatPhone = (phone: string) => {
    if (phone.length === 10) {
      return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
    }
    return phone;
  };

  const handleApprove = () => {
    if (!application || role === AdminRole.SUPPORT) return;

    adminStorage.approveApplication(appId, 'Admin User');
    const updated = adminStorage.getApplication(appId);
    setApplication(updated || null);
  };

  const handleReject = () => {
    if (!application || role === AdminRole.SUPPORT || !rejectionReason.trim()) return;

    adminStorage.rejectApplication(appId, 'Admin User', rejectionReason);
    const updated = adminStorage.getApplication(appId);
    setApplication(updated || null);
    setShowRejectDialog(false);
    setRejectionReason('');
  };

  if (!application) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="icon" onClick={() => router.push('/admin/applications')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Application Not Found</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push('/admin/applications')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {application.firstName} {application.lastName}
            </h1>
            <p className="text-sm text-gray-600">{formatPhone(application.phone)}</p>
          </div>
          <Badge
            variant={application.status === 'approved' ? 'default' : 'outline'}
            className={
              application.status === 'approved'
                ? 'bg-black text-white'
                : 'text-gray-700 border-gray-300'
            }
          >
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </Badge>
        </div>

        {/* Actions */}
        {application.status === 'pending' && (
          <div className="flex gap-2">
            <Button
              className="flex-1 bg-black text-white hover:bg-gray-800"
              onClick={handleApprove}
              disabled={role === AdminRole.SUPPORT}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve Application
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700"
              onClick={() => setShowRejectDialog(!showRejectDialog)}
              disabled={role === AdminRole.SUPPORT}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </div>
        )}

        {/* Reject Dialog */}
        {showRejectDialog && application.status === 'pending' && (
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-4 space-y-3">
              <div className="font-medium text-gray-900">Rejection Reason</div>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                className="border-gray-300"
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700"
                  onClick={() => {
                    setShowRejectDialog(false);
                    setRejectionReason('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-black text-white hover:bg-gray-800"
                  onClick={handleReject}
                  disabled={!rejectionReason.trim()}
                >
                  Confirm Rejection
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Personal Information */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">First Name</div>
                <div className="font-medium text-gray-900">{application.firstName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Last Name</div>
                <div className="font-medium text-gray-900">{application.lastName}</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Phone Number</div>
              <div className="font-medium text-gray-900">{formatPhone(application.phone)}</div>
            </div>
            {application.email && (
              <div>
                <div className="text-sm text-gray-600">Email</div>
                <div className="font-medium text-gray-900">{application.email}</div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">ZIP Code</div>
                <div className="font-medium text-gray-900">{application.zipCode}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Age Range</div>
                <div className="font-medium text-gray-900">{application.age}</div>
              </div>
            </div>
            {application.referralCode && (
              <div>
                <div className="text-sm text-gray-600">Referral Code</div>
                <div className="font-medium text-gray-900">{application.referralCode}</div>
              </div>
            )}
            <div>
              <div className="text-sm text-gray-600">Submitted</div>
              <div className="font-medium text-gray-900">
                {new Date(application.submittedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Driver's License */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Driver's License
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm text-gray-600">License Number</div>
              <div className="font-medium text-gray-900">{application.licenseNumber}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">State Issued</div>
              <div className="font-medium text-gray-900">{application.licenseState}</div>
            </div>
          </CardContent>
        </Card>

        {/* Background Check */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Background Check
              {application.backgroundCheck && (
                <Badge
                  variant={application.backgroundCheck.status === 'pass' ? 'default' : 'outline'}
                  className={
                    application.backgroundCheck.status === 'pass'
                      ? 'bg-black text-white ml-2'
                      : 'text-gray-700 border-gray-300 ml-2'
                  }
                >
                  {application.backgroundCheck.status.charAt(0).toUpperCase() + application.backgroundCheck.status.slice(1)}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!application.backgroundCheck ? (
              <p className="text-sm text-gray-500">No background check information available</p>
            ) : (
              <>
                <div>
                  <div className="text-sm text-gray-600">Status</div>
                  <div className="font-medium text-gray-900">
                    {application.backgroundCheck.status.charAt(0).toUpperCase() + application.backgroundCheck.status.slice(1)}
                  </div>
                </div>
                {application.backgroundCheck.completedAt && (
                  <div>
                    <div className="text-sm text-gray-600">Completed</div>
                    <div className="font-medium text-gray-900">
                      {new Date(application.backgroundCheck.completedAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                )}
                {application.backgroundCheck.details && (
                  <div>
                    <div className="text-sm text-gray-600">Details</div>
                    <div className="font-medium text-gray-900 p-3 bg-gray-50 rounded-lg">
                      {application.backgroundCheck.details}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-gray-600">SSN (Last 4)</div>
                  <div className="font-medium text-gray-900">XXX-XX-{application.ssnLast4}</div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm text-gray-600">Card on File (Last 4)</div>
              <div className="font-medium text-gray-900">•••• {application.cardLast4}</div>
            </div>
            <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
              $20 refundable deposit collected. Will be refunded after 5 successful trips.
            </div>
          </CardContent>
        </Card>

        {/* Review Information */}
        {(application.reviewedAt || application.rejectionReason) && (
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Review Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {application.reviewedBy && (
                <div>
                  <div className="text-sm text-gray-600">Reviewed By</div>
                  <div className="font-medium text-gray-900">{application.reviewedBy}</div>
                </div>
              )}
              {application.reviewedAt && (
                <div>
                  <div className="text-sm text-gray-600">Reviewed On</div>
                  <div className="font-medium text-gray-900">
                    {new Date(application.reviewedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              )}
              {application.rejectionReason && (
                <div>
                  <div className="text-sm text-gray-600">Rejection Reason</div>
                  <div className="font-medium text-gray-900 p-3 bg-gray-50 rounded-lg">
                    {application.rejectionReason}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetailPage;