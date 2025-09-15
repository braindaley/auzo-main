import { Timestamp } from 'firebase/firestore';

export enum UserRole {
  OWNER = 'owner',
  MEMBER = 'member'
}

export enum InviteStatus {
  INVITED = 'invited',
  ACCEPTED = 'accepted',
  EXPIRED = 'expired'
}

export enum MemberStatus {
  ACTIVE = 'active',
  FROZEN = 'frozen'
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  role: UserRole;
  ownerId?: string; // For members, references the owner
  status: MemberStatus;
  profilePicture?: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface Invitation {
  id: string;
  ownerUserId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  status: InviteStatus;
  inviteToken: string;
  expiresAt: Timestamp | Date;
  acceptedAt?: Timestamp | Date;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface UserRelationship {
  id: string;
  ownerId: string;
  memberId: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface CreateInviteRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface AcceptInviteRequest {
  inviteToken: string;
  email?: string;
}

export interface UpdateMemberRequest {
  memberId: string;
  status?: MemberStatus;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}