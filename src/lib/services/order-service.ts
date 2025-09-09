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
    const newOrder: Partial<Order> = {
      ...orderData,
      status: OrderStatus.FINDING_DRIVER,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      statusHistory: [
        {
          status: OrderStatus.FINDING_DRIVER,
          timestamp: serverTimestamp(),
        },
      ],
    };

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
        timestamp: serverTimestamp(),
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