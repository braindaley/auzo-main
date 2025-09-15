"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface InviteUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (firstName: string, lastName: string, phoneNumber: string) => Promise<void>;
}

export function InviteUserDialog({ isOpen, onClose, onInvite }: InviteUserDialogProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Format phone number as (555) 555-5555
  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    const truncated = numbers.substring(0, 10);
    
    // Format based on length
    if (truncated.length === 0) return '';
    if (truncated.length <= 3) return `(${truncated}`;
    if (truncated.length <= 6) return `(${truncated.slice(0, 3)}) ${truncated.slice(3)}`;
    return `(${truncated.slice(0, 3)}) ${truncated.slice(3, 6)}-${truncated.slice(6)}`;
  };

  // Validate phone number
  const validatePhoneNumber = (phone: string) => {
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length === 0) return 'Phone number is required';
    if (numbers.length !== 10) return 'Phone number must be 10 digits';
    return '';
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    
    // Clear error when user starts typing
    if (phoneError) {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const phoneValidationError = validatePhoneNumber(phoneNumber);
    
    if (!firstName.trim() || !lastName.trim()) {
      return;
    }
    
    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      return;
    }

    setIsLoading(true);
    try {
      // Send just the numbers for the phone
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      await onInvite(firstName.trim(), lastName.trim(), cleanPhone);
      
      // Reset form
      setFirstName('');
      setLastName('');
      setPhoneNumber('');
      setPhoneError('');
    } catch (error) {
      console.error('Error sending invitation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFirstName('');
      setLastName('');
      setPhoneNumber('');
      setPhoneError('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[356px]">
        <DialogHeader>
          <DialogTitle>Invite New Member</DialogTitle>
          <DialogDescription>
            Send an invitation to a new member. They'll receive a magic link to join your account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">
                Phone
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                className={phoneError ? "border-red-500" : ""}
                placeholder="(555) 123-4567"
                required
                disabled={isLoading}
              />
              {phoneError && (
                <p className="text-xs text-red-500">{phoneError}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Invitation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}