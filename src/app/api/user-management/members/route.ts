import { NextRequest, NextResponse } from 'next/server';
import {
  getMembers,
  updateMemberStatus,
  removeMember,
} from '@/lib/services/user-management-service';
import { MemberStatus } from '@/lib/types/user-management';

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

    const members = await getMembers(ownerId);
    return NextResponse.json({ members });
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { memberId, status } = body;

    if (!memberId || !status) {
      return NextResponse.json(
        { error: 'Member ID and status are required' },
        { status: 400 }
      );
    }

    if (!Object.values(MemberStatus).includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    await updateMemberStatus(memberId, status);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating member status:', error);
    return NextResponse.json(
      { error: 'Failed to update member status' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');

    if (!memberId) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 }
      );
    }

    await removeMember(memberId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing member:', error);
    return NextResponse.json(
      { error: 'Failed to remove member' },
      { status: 500 }
    );
  }
}