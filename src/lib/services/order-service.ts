import {
  collection,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order, OrderStatus } from '@/lib/types/order';

const ORDERS_COLLECTION = 'orders';

export async function createOrder(orderData: Partial<Order>): Promise<string> {
  try {
    const timestamp = serverTimestamp();
    // Determine initial status based on whether order is scheduled
    const isScheduled = orderData.scheduledDate && orderData.scheduledTime;
    const initialStatus = isScheduled ? OrderStatus.SCHEDULED : OrderStatus.FINDING_DRIVER;
    
    // Build the order object without undefined values
    const newOrder: any = {
      status: initialStatus,
      createdAt: timestamp,
      updatedAt: timestamp,
      statusHistory: [
        {
          status: initialStatus,
          timestamp: new Date(),
        },
      ],
    };

    // Only add fields that are defined
    if (orderData.pickupLocation !== undefined) newOrder.pickupLocation = orderData.pickupLocation;
    if (orderData.dropoffLocation !== undefined) newOrder.dropoffLocation = orderData.dropoffLocation;
    if (orderData.vehicleInfo !== undefined) newOrder.vehicleInfo = orderData.vehicleInfo;
    if (orderData.notes !== undefined) newOrder.notes = orderData.notes;
    if (orderData.scheduledDate !== undefined) newOrder.scheduledDate = orderData.scheduledDate;
    if (orderData.scheduledTime !== undefined) newOrder.scheduledTime = orderData.scheduledTime;
    if (orderData.customerInfo !== undefined) newOrder.customerInfo = orderData.customerInfo;
    if (orderData.driverInfo !== undefined) newOrder.driverInfo = orderData.driverInfo;

    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), newOrder);
    console.log('Order created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function getOrder(orderId: string): Promise<Order | null> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Order;
    } else {
      console.log('No such order!');
      return null;
    }
  } catch (error) {
    console.error('Error getting order:', error);
    throw error;
  }
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus
): Promise<void> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, {
      status: newStatus,
      updatedAt: serverTimestamp(),
      statusHistory: arrayUnion({
        status: newStatus,
        timestamp: new Date(),
      }),
    });
    console.log('Order status updated successfully');
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

export async function updateOrder(
  orderId: string,
  updates: Partial<Order>
): Promise<void> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    console.log('Order updated successfully');
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
}

export async function cancelOrder(orderId: string): Promise<void> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, {
      status: OrderStatus.CANCELLED,
      updatedAt: serverTimestamp(),
      statusHistory: arrayUnion({
        status: OrderStatus.CANCELLED,
        timestamp: new Date(),
      }),
    });
    console.log('Order cancelled successfully');
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
}

// New functions for member management
export async function getOrdersForOwner(ownerId: string): Promise<Order[]> {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('billingInfo.billedToUserId', '==', ownerId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    
    return orders;
  } catch (error) {
    console.error('Error getting orders for owner:', error);
    throw error;
  }
}

export async function getOrdersForMember(memberId: string): Promise<Order[]> {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('billingInfo.userId', '==', memberId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    
    return orders;
  } catch (error) {
    console.error('Error getting orders for member:', error);
    throw error;
  }
}

export async function getOrdersByMemberForOwner(ownerId: string, memberId: string): Promise<Order[]> {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('billingInfo.billedToUserId', '==', ownerId),
      where('billingInfo.userId', '==', memberId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    
    return orders;
  } catch (error) {
    console.error('Error getting orders by member for owner:', error);
    throw error;
  }
}