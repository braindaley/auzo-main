import { NextRequest, NextResponse } from 'next/server';
import {
  createInvitation,
  getPendingInvitations,
  cancelInvitation,
} from '@/lib/services/user-management-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ownerId, firstName, lastName, phoneNumber } = body;

    if (!ownerId || !firstName || !lastName || !phoneNumber) {
      return NextResponse.json(
        { error: 'Owner ID, first name, last name, and phone number are required' },
        { status: 400 }
      );
    }

    // Check if Firebase is configured
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      // Mock response for development
      console.log('Mock invitation created:', { ownerId, firstName, lastName, phoneNumber });
      return NextResponse.json({ 
        success: true, 
        invitationId: `mock-invitation-${Date.now()}`,
        message: 'Mock invitation created (Firebase not configured)'
      });
    }

    const invitationId = await createInvitation(ownerId, {
      firstName,
      lastName,
      phoneNumber,
    });

    return NextResponse.json({ 
      success: true, 
      invitationId 
    });
  } catch (error) {
    console.error('Error creating invitation:', error);
    
    // If it's a Firebase error, provide a helpful message
    if (error instanceof Error && error.message.includes('Firebase')) {
      return NextResponse.json(
        { 
          error: 'Firebase configuration required for user management features',
          details: error.message
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create invitation' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');

    if (!ownerId) {
      return NextResponse.json(
        { error: 'Owner ID is required' },
        { status: 400 }
      );
    }

    const invitations = await getPendingInvitations(ownerId);
    return NextResponse.json({ invitations });
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invitations' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const invitationId = searchParams.get('invitationId');

    if (!invitationId) {
      return NextResponse.json(
        { error: 'Invitation ID is required' },
        { status: 400 }
      );
    }

    await cancelInvitation(invitationId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error cancelling invitation:', error);
    return NextResponse.json(
      { error: 'Failed to cancel invitation' },
      { status: 500 }
    );
  }
}