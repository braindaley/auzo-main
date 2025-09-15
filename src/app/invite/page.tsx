"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, AlertCircle, UserPlus } from 'lucide-react';
import { Invitation } from '@/lib/types/user-management';

function InvitePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inviteToken = searchParams.get('token');

  useEffect(() => {
    if (inviteToken) {
      loadInvitation();
    } else {
      setError('Invalid invitation link');
      setIsLoading(false);
    }
  }, [inviteToken]);

  const loadInvitation = async () => {
    try {
      const response = await fetch(`/api/user-management/accept-invitation?token=${inviteToken}`);
      
      if (response.ok) {
        const data = await response.json();
        setInvitation(data.invitation);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Invalid or expired invitation');
      }
    } catch (error) {
      console.error('Error loading invitation:', error);
      setError('Failed to load invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteToken) return;

    setIsAccepting(true);
    setError(null);

    try {
      const response = await fetch('/api/user-management/accept-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inviteToken,
          email: email.trim() || undefined,
        }),
      });

      if (response.ok) {
        setIsAccepted(true);
        // Redirect to login or home after a few seconds
        setTimeout(() => {
          router.push('/'); // Or wherever new members should go
        }, 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to accept invitation');
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
      setError('Failed to accept invitation');
    } finally {
      setIsAccepting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading invitation...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Invitation</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => router.push('/')} variant="outline">
                Go to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isAccepted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to the Team!</h2>
              <p className="text-muted-foreground mb-4">
                You've successfully joined as a member. You'll be redirected shortly.
              </p>
              <div className="animate-pulse text-sm text-muted-foreground">
                Redirecting...
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invitation) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-xl">You're Invited!</CardTitle>
          <p className="text-muted-foreground">
            You've been invited to join as a member
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Invitation Details */}
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">
                Welcome, {invitation.firstName} {invitation.lastName}
              </p>
              <p className="text-sm text-muted-foreground">
                Phone: {invitation.phoneNumber}
              </p>
            </div>

            {/* Accept Form */}
            <form onSubmit={handleAcceptInvitation} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  disabled={isAccepting}
                />
                <p className="text-xs text-muted-foreground">
                  Providing an email will help with account notifications
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isAccepting}
              >
                {isAccepting ? 'Accepting...' : 'Accept Invitation'}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                By accepting, you agree to join as a member and allow the owner to manage your account.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function InvitePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <InvitePageContent />
    </Suspense>
  );
}