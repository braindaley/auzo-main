import { NextRequest, NextResponse } from 'next/server';
import {
  getOrdersForOwner,
  getOrdersForMember,
  getOrdersByMemberForOwner,
} from '@/lib/services/order-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');
    const memberId = searchParams.get('memberId');
    const filterByMember = searchParams.get('filterByMember');

    if (!ownerId && !memberId) {
      return NextResponse.json(
        { error: 'Either ownerId or memberId is required' },
        { status: 400 }
      );
    }

    let orders;

    if (ownerId && filterByMember) {
      // Owner wants to see orders for a specific member
      orders = await getOrdersByMemberForOwner(ownerId, filterByMember);
    } else if (ownerId) {
      // Owner wants to see all orders billed to them
      orders = await getOrdersForOwner(ownerId);
    } else if (memberId) {
      // Member wants to see their own orders
      orders = await getOrdersForMember(memberId);
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}