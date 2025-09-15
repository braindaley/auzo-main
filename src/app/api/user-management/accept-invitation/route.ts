import { NextRequest, NextResponse } from 'next/server';
import {
  getInvitation,
  acceptInvitation,
} from '@/lib/services/user-management-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const inviteToken = searchParams.get('token');

    if (!inviteToken) {
      return NextResponse.json(
        { error: 'Invite token is required' },
        { status: 400 }
      );
    }

    const invitation = await getInvitation(inviteToken);
    
    if (!invitation) {
      return NextResponse.json(
        { error: 'Invalid or expired invitation' },
        { status: 404 }
      );
    }

    return NextResponse.json({ invitation });
  } catch (error) {
    console.error('Error fetching invitation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invitation' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { inviteToken, email } = body;

    if (!inviteToken) {
      return NextResponse.json(
        { error: 'Invite token is required' },
        { status: 400 }
      );
    }

    const userId = await acceptInvitation({
      inviteToken,
      email,
    });

    return NextResponse.json({ 
      success: true, 
      userId 
    });
  } catch (error) {
    console.error('Error accepting invitation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to accept invitation' },
      { status: 500 }
    );
  }
}