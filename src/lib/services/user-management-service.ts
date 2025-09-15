import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  User,
  Invitation,
  UserRelationship,
  UserRole,
  InviteStatus,
  MemberStatus,
  CreateInviteRequest,
  AcceptInviteRequest,
  UpdateMemberRequest,
} from '@/lib/types/user-management';

const USERS_COLLECTION = 'users';
const INVITATIONS_COLLECTION = 'invitations';
const USER_RELATIONSHIPS_COLLECTION = 'userRelationships';

// Generate a random invite token
function generateInviteToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// User Management Functions
export async function createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const timestamp = serverTimestamp();
    const newUser = {
      ...userData,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const docRef = await addDoc(collection(db, USERS_COLLECTION), newUser);
    console.log('User created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getUser(userId: string): Promise<User | null> {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as User;
    } else {
      console.log('No such user!');
      return null;
    }
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<void> {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    console.log('User updated successfully');
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

// Member Management Functions
export async function getMembers(ownerId: string): Promise<User[]> {
  try {
    const q = query(
      collection(db, USERS_COLLECTION),
      where('ownerId', '==', ownerId),
      where('role', '==', UserRole.MEMBER),
      orderBy('firstName')
    );
    
    const querySnapshot = await getDocs(q);
    const members: User[] = [];
    
    querySnapshot.forEach((doc) => {
      members.push({ id: doc.id, ...doc.data() } as User);
    });
    
    return members;
  } catch (error) {
    console.error('Error getting members:', error);
    throw error;
  }
}

export async function updateMemberStatus(memberId: string, status: MemberStatus): Promise<void> {
  try {
    const docRef = doc(db, USERS_COLLECTION, memberId);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    });
    console.log('Member status updated successfully');
  } catch (error) {
    console.error('Error updating member status:', error);
    throw error;
  }
}

export async function removeMember(memberId: string): Promise<void> {
  try {
    // Delete the user
    const userRef = doc(db, USERS_COLLECTION, memberId);
    await deleteDoc(userRef);

    // Delete any relationships
    const relationshipsQuery = query(
      collection(db, USER_RELATIONSHIPS_COLLECTION),
      where('memberId', '==', memberId)
    );
    const relationshipsSnapshot = await getDocs(relationshipsQuery);
    
    const deletePromises = relationshipsSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    console.log('Member removed successfully');
  } catch (error) {
    console.error('Error removing member:', error);
    throw error;
  }
}

// Invitation Management Functions
export async function createInvitation(ownerId: string, inviteData: CreateInviteRequest): Promise<string> {
  try {
    const timestamp = serverTimestamp();
    const inviteToken = generateInviteToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

    const invitation: Omit<Invitation, 'id'> = {
      ownerUserId: ownerId,
      firstName: inviteData.firstName,
      lastName: inviteData.lastName,
      phoneNumber: inviteData.phoneNumber,
      status: InviteStatus.INVITED,
      inviteToken,
      expiresAt,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const docRef = await addDoc(collection(db, INVITATIONS_COLLECTION), invitation);
    console.log('Invitation created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating invitation:', error);
    throw error;
  }
}

export async function getInvitation(inviteToken: string): Promise<Invitation | null> {
  try {
    const q = query(
      collection(db, INVITATIONS_COLLECTION),
      where('inviteToken', '==', inviteToken),
      where('status', '==', InviteStatus.INVITED)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    const invitation = { id: doc.id, ...doc.data() } as Invitation;

    // Check if invitation is expired
    const now = new Date();
    const expiresAt = invitation.expiresAt instanceof Timestamp 
      ? invitation.expiresAt.toDate() 
      : new Date(invitation.expiresAt);

    if (now > expiresAt) {
      // Mark as expired
      await updateDoc(doc.ref, {
        status: InviteStatus.EXPIRED,
        updatedAt: serverTimestamp(),
      });
      return null;
    }

    return invitation;
  } catch (error) {
    console.error('Error getting invitation:', error);
    throw error;
  }
}

export async function acceptInvitation(acceptData: AcceptInviteRequest): Promise<string> {
  try {
    const invitation = await getInvitation(acceptData.inviteToken);
    
    if (!invitation) {
      throw new Error('Invalid or expired invitation');
    }

    // Get the owner
    const owner = await getUser(invitation.ownerUserId);
    if (!owner) {
      throw new Error('Owner not found');
    }

    // Create the new member user
    const newUser: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
      firstName: invitation.firstName,
      lastName: invitation.lastName,
      phoneNumber: invitation.phoneNumber,
      email: acceptData.email,
      role: UserRole.MEMBER,
      ownerId: invitation.ownerUserId,
      status: MemberStatus.ACTIVE,
    };

    const userId = await createUser(newUser);

    // Create the relationship
    const relationship: Omit<UserRelationship, 'id'> = {
      ownerId: invitation.ownerUserId,
      memberId: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await addDoc(collection(db, USER_RELATIONSHIPS_COLLECTION), relationship);

    // Update the invitation status
    const invitationRef = doc(db, INVITATIONS_COLLECTION, invitation.id);
    await updateDoc(invitationRef, {
      status: InviteStatus.ACCEPTED,
      acceptedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log('Invitation accepted successfully');
    return userId;
  } catch (error) {
    console.error('Error accepting invitation:', error);
    throw error;
  }
}

export async function getPendingInvitations(ownerId: string): Promise<Invitation[]> {
  try {
    const q = query(
      collection(db, INVITATIONS_COLLECTION),
      where('ownerUserId', '==', ownerId),
      where('status', '==', InviteStatus.INVITED),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const invitations: Invitation[] = [];
    
    querySnapshot.forEach((doc) => {
      invitations.push({ id: doc.id, ...doc.data() } as Invitation);
    });
    
    return invitations;
  } catch (error) {
    console.error('Error getting pending invitations:', error);
    throw error;
  }
}

export async function cancelInvitation(invitationId: string): Promise<void> {
  try {
    const docRef = doc(db, INVITATIONS_COLLECTION, invitationId);
    await updateDoc(docRef, {
      status: InviteStatus.EXPIRED,
      updatedAt: serverTimestamp(),
    });
    console.log('Invitation cancelled successfully');
  } catch (error) {
    console.error('Error cancelling invitation:', error);
    throw error;
  }
}

// Utility Functions
export async function isOwner(userId: string): Promise<boolean> {
  try {
    const user = await getUser(userId);
    return user?.role === UserRole.OWNER;
  } catch (error) {
    console.error('Error checking if user is owner:', error);
    return false;
  }
}

export async function getOwnerOfMember(memberId: string): Promise<User | null> {
  try {
    const member = await getUser(memberId);
    if (!member || !member.ownerId) {
      return null;
    }
    return await getUser(member.ownerId);
  } catch (error) {
    console.error('Error getting owner of member:', error);
    return null;
  }
}

export async function getMembersWithOrders(ownerId: string): Promise<User[]> {
  try {
    // This will be used later to show members with their order counts
    return await getMembers(ownerId);
  } catch (error) {
    console.error('Error getting members with orders:', error);
    throw error;
  }
}