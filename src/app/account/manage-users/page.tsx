"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, UserCheck, UserX, Clock, Mail, Car } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { User, Invitation, UserRole, MemberStatus, InviteStatus } from '@/lib/types/user-management';
import { InviteUserDialog } from '@/components/user-management/invite-user-dialog';

const ManageUsersPage = () => {
  const router = useRouter();
  const [members, setMembers] = useState<User[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  
  // Mock current user as owner for now - this would come from auth context
  const currentUserId = 'owner-user-id';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load members
      const membersResponse = await fetch(`/api/user-management/members?ownerId=${currentUserId}`);
      if (membersResponse.ok) {
        const membersData = await membersResponse.json();
        setMembers(membersData.members || []);
      }

      // Load pending invitations
      const invitationsResponse = await fetch(`/api/user-management/invitations?ownerId=${currentUserId}`);
      if (invitationsResponse.ok) {
        const invitationsData = await invitationsResponse.json();
        setPendingInvitations(invitationsData.invitations || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/account');
  };

  const handleInviteUser = async (firstName: string, lastName: string, phoneNumber: string) => {
    // Prototype mode - simulate successful invitation
    console.log('Prototype: Creating invitation for', firstName, lastName, phoneNumber);
    
    // Create a mock invitation
    const mockInvitation: Invitation = {
      id: `invite-${Date.now()}`,
      ownerUserId: currentUserId,
      firstName,
      lastName,
      phoneNumber,
      status: InviteStatus.INVITED,
      inviteToken: `token-${Date.now()}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Add to pending invitations
    setPendingInvitations(prev => [...prev, mockInvitation]);
    setIsInviteDialogOpen(false);
  };

  const handleToggleMemberStatus = async (memberId: string, currentStatus: MemberStatus) => {
    const newStatus = currentStatus === MemberStatus.ACTIVE ? MemberStatus.FROZEN : MemberStatus.ACTIVE;
    
    try {
      const response = await fetch('/api/user-management/members', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberId,
          status: newStatus,
        }),
      });

      if (response.ok) {
        await loadData(); // Refresh the data
      } else {
        console.error('Failed to update member status');
      }
    } catch (error) {
      console.error('Error updating member status:', error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/user-management/members?memberId=${memberId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadData(); // Refresh the data
      } else {
        console.error('Failed to remove member');
      }
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    // Prototype mode - just remove from local state
    setPendingInvitations(prev => prev.filter(inv => inv.id !== invitationId));
  };

  const handleInvitationStatusClick = (invitationId: string, currentStatus: InviteStatus) => {
    // Prototype mode - cycle through statuses
    let newStatus: InviteStatus;
    if (currentStatus === InviteStatus.INVITED) {
      newStatus = InviteStatus.ACCEPTED;
    } else {
      newStatus = InviteStatus.INVITED;
    }

    setPendingInvitations(prev => 
      prev.map(inv => 
        inv.id === invitationId 
          ? { ...inv, status: newStatus, acceptedAt: newStatus === InviteStatus.ACCEPTED ? new Date() : undefined }
          : inv
      )
    );

    // If accepted, move to members after a short delay
    if (newStatus === InviteStatus.ACCEPTED) {
      setTimeout(() => {
        const acceptedInvitation = pendingInvitations.find(inv => inv.id === invitationId);
        if (acceptedInvitation) {
          // Create a new member
          const newMember: User = {
            id: `member-${Date.now()}`,
            firstName: acceptedInvitation.firstName,
            lastName: acceptedInvitation.lastName,
            phoneNumber: acceptedInvitation.phoneNumber,
            role: UserRole.MEMBER,
            ownerId: currentUserId,
            status: MemberStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          setMembers(prev => [...prev, newMember]);
          setPendingInvitations(prev => prev.filter(inv => inv.id !== invitationId));
        }
      }, 1000);
    }
  };

  const generateInviteLink = (inviteToken: string) => {
    return `${window.location.origin}/invite?token=${inviteToken}`;
  };

  const copyInviteLink = (inviteToken: string) => {
    const link = generateInviteLink(inviteToken);
    navigator.clipboard.writeText(link);
    // You could add a toast notification here
  };

  // Mock function to get recent order for a member
  const getMemberRecentOrder = (memberId: string) => {
    const mockOrders = [
      {
        id: 'order-1',
        memberId: 'member-1',
        vehicleInfo: { year: '2022', make: 'Tesla', model: 'Model 3' },
        pickupLocation: 'Downtown Office',
        cost: 85,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'order-2', 
        memberId: 'member-2',
        vehicleInfo: { year: '2021', make: 'BMW', model: 'X5' },
        pickupLocation: 'Home Garage',
        cost: 120,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ];
    
    // For prototype, match against known member IDs
    if (memberId.includes('member-1') || members.find(m => m.firstName === 'Audra')) {
      return mockOrders[0];
    } else if (memberId.includes('member-2') || members.find(m => m.firstName === 'John')) {
      return mockOrders[1];
    }
    
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleBack}
              className="mr-3"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-semibold">Manage Users</h1>
          </div>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleBack}
              className="mr-3"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-semibold">Manage Users</h1>
          </div>
          <Button onClick={() => setIsInviteDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="space-y-6">
          {/* Members Section */}
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <UserCheck className="w-5 h-5" />
              Members ({members.length})
            </h2>
            
            {members.length === 0 ? (
              <div className="text-center py-8">
                <UserX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No members yet</p>
                <p className="text-sm text-gray-500">Invite your first member to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {members.map((member) => (
                  <Card key={member.id} className="border border-gray-200 bg-white">
                    <CardContent className="p-4 space-y-2">
                      {/* Line 1: Name, Status, Action Buttons */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-700 font-medium text-sm">
                              {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-black">
                            {member.firstName} {member.lastName}
                          </span>
                          <Badge 
                            variant={member.status === MemberStatus.ACTIVE ? "default" : "outline"}
                            className="text-black border-gray-300 bg-black text-white"
                          >
                            {member.status === MemberStatus.ACTIVE ? "Active" : "Frozen"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleMemberStatus(member.id, member.status)}
                            className="text-gray-600 border-gray-300 hover:bg-gray-100"
                          >
                            {member.status === MemberStatus.ACTIVE ? "Freeze" : "Activate"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveMember(member.id)}
                            className="text-gray-600 border-gray-300 hover:bg-gray-100"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                      
                      {/* Line 2: Phone Number */}
                      <div>
                        <span className="text-gray-600">
                          ({member.phoneNumber.slice(0,3)}) {member.phoneNumber.slice(3,6)}-{member.phoneNumber.slice(6)}
                        </span>
                      </div>
                      
                      {/* Line 3: Email (if available) */}
                      {member.email && (
                        <div>
                          <span className="text-gray-500 text-sm">{member.email}</span>
                        </div>
                      )}
                      
                      {/* Line 4: Recent Order (if any) */}
                      {(() => {
                        const memberOrder = getMemberRecentOrder(member.id);
                        if (memberOrder) {
                          return (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Car className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm font-medium">
                                    Recent Service: {memberOrder.vehicleInfo?.year} {memberOrder.vehicleInfo?.make} {memberOrder.vehicleInfo?.model}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500">
                                  ${memberOrder.cost}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {memberOrder.pickupLocation} • {new Date(memberOrder.createdAt as Date).toLocaleDateString()}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Pending Invitations Section */}
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <Clock className="w-5 h-5" />
              Pending Invitations ({pendingInvitations.length})
            </h2>
            
            {pendingInvitations.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500">No pending invitations</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingInvitations.map((invitation) => (
                  <Card key={invitation.id} className="border border-gray-200 bg-white">
                    <CardContent className="p-4 space-y-2">
                      {/* Line 1: Name, Status, Copy Icon */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-black">
                            {invitation.firstName} {invitation.lastName}
                          </span>
                          <Badge 
                            variant={invitation.status === InviteStatus.ACCEPTED ? "default" : "outline"}
                            className="cursor-pointer hover:bg-gray-100 transition-colors text-black border-gray-300"
                            onClick={() => handleInvitationStatusClick(invitation.id, invitation.status)}
                          >
                            {invitation.status === InviteStatus.INVITED ? "Pending" : "Accepted"}
                          </Badge>
                        </div>
                        <button
                          onClick={() => copyInviteLink(invitation.inviteToken)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Copy Link"
                        >
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Line 2: Phone Number */}
                      <div>
                        <span className="text-gray-600">
                          ({invitation.phoneNumber.slice(0,3)}) {invitation.phoneNumber.slice(3,6)}-{invitation.phoneNumber.slice(6)}
                        </span>
                      </div>
                      
                      {/* Line 3: Cancel Button */}
                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelInvitation(invitation.id)}
                          className="text-gray-600 border-gray-300 hover:bg-gray-100"
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <InviteUserDialog
          isOpen={isInviteDialogOpen}
          onClose={() => setIsInviteDialogOpen(false)}
          onInvite={handleInviteUser}
        />
      </div>
    </div>
  );
};

export default ManageUsersPage;