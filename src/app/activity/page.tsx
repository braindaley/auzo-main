
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, List, MapPin, Clock, ArrowLeft, Users, Filter, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { OrderStatus, OrderStatusLabels, Order } from '@/lib/types/order';
import { User, UserRole } from '@/lib/types/user-management';
import Link from 'next/link';


const ActivityPage = () => {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [members, setMembers] = useState<User[]>([]);
    const [selectedMember, setSelectedMember] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Clear any existing transaction data
        localStorage.removeItem('auzo_transactions');

        // Get current user from localStorage profile
        const getUserFromProfile = (): User => {
            const savedProfile = localStorage.getItem('auzo_user_profile');
            if (savedProfile) {
                try {
                    const profile = JSON.parse(savedProfile);
                    return {
                        id: 'owner-user-id',
                        firstName: profile.firstName || 'User',
                        lastName: profile.lastName || '',
                        phoneNumber: profile.phoneNumber || '',
                        role: UserRole.OWNER, // Change to MEMBER to test member flow
                        status: 'active' as any,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };
                } catch (error) {
                    console.error('Failed to parse user profile:', error);
                }
            }
            
            // Fallback to default user if no profile exists
            return {
                id: 'owner-user-id',
                firstName: 'User',
                lastName: '',
                phoneNumber: '',
                role: UserRole.OWNER,
                status: 'active' as any,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        };

        const currentUserData = getUserFromProfile();
        setCurrentUser(currentUserData);
        loadData(currentUserData);
    }, []);

    const loadData = async (user: User) => {
        setIsLoading(true);
        try {

            // Create mock members for prototype
            const mockMembers: User[] = [
                {
                    id: 'member-1',
                    firstName: 'Audra',
                    lastName: 'Gussin',
                    phoneNumber: '5551211111',
                    role: UserRole.MEMBER,
                    ownerId: user.id,
                    status: 'active' as any,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 'member-2',
                    firstName: 'John',
                    lastName: 'Smith',
                    phoneNumber: '5559876543',
                    role: UserRole.MEMBER,
                    ownerId: user.id,
                    status: 'active' as any,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            ];

            if (user.role === UserRole.OWNER) {
                setMembers(mockMembers);
                // No mock orders - will load from API or be empty
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadOrders = async (ownerId: string | null, filterMemberId?: string) => {
        try {
            let url = '/api/orders?';
            if (ownerId) {
                url += `ownerId=${ownerId}`;
                if (filterMemberId && filterMemberId !== 'all') {
                    url += `&filterByMember=${filterMemberId}`;
                }
            } else if (filterMemberId) {
                url += `memberId=${filterMemberId}`;
            }

            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setOrders(data.orders || []);
            }
        } catch (error) {
            console.error('Error loading orders:', error);
        }
    };

    const handleMemberFilterChange = async (userId: string) => {
        setSelectedMember(userId);
        
        if (currentUser?.role === UserRole.OWNER) {
            // Filter orders based on selection
            let filteredOrders = [];
            if (userId === 'all') {
                // Show all orders
                filteredOrders = orders;
            } else if (userId === currentUser.id) {
                // Show only owner's orders
                filteredOrders = orders.filter(order => order.billingInfo?.userId === currentUser.id);
            } else {
                // Show only selected member's orders
                filteredOrders = orders.filter(order => order.billingInfo?.userId === userId);
            }
            
            // Filter from existing orders
            if (userId === 'all') {
                // Show all orders (if any exist from API)
                setOrders(orders);
            } else {
                // Show filtered orders (if any exist from API)
                setOrders(orders.filter(order => order.billingInfo?.userId === userId));
            }
        }
    };


    const handleOrderClick = (order: Order) => {
        router.push(`/activity/${order.id}?from=activity`);
    };


    const getStatusBadgeVariant = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.SCHEDULED:
                return 'outline';
            case OrderStatus.FINDING_DRIVER:
                return 'secondary';
            case OrderStatus.DRIVER_ON_WAY:
                return 'secondary';
            case OrderStatus.CAR_IN_TRANSIT:
                return 'secondary';
            case OrderStatus.CAR_DELIVERED:
                return 'default';
            case OrderStatus.CANCELLED:
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const getStatusLabel = (status: OrderStatus) => {
        return OrderStatusLabels[status];
    };

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <main className="flex-1 pb-24">
                <div className="p-6">
                    <div className="space-y-4 mb-6">
                        <Link 
                            href="/account" 
                            className="inline-flex items-center gap-3 text-gray-900 hover:text-gray-700 transition-colors no-underline"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="text-lg font-medium">Account</span>
                        </Link>
                        <h1 className="text-3xl font-bold">Activity</h1>
                        {currentUser?.role === UserRole.OWNER && (
                            <div className="flex items-center space-x-2 w-full">
                                <Filter className="w-4 h-4 text-gray-500" />
                                <Select value={selectedMember} onValueChange={handleMemberFilterChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Users</SelectItem>
                                        <SelectItem value={currentUser.id}>
                                            {currentUser.firstName} {currentUser.lastName} (Owner)
                                        </SelectItem>
                                        {members.map((member) => (
                                            <SelectItem key={member.id} value={member.id}>
                                                {member.firstName} {member.lastName} (Member)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-2 text-muted-foreground">Loading...</p>
                        </div>
                    ) : (
                        <>
                            {/* Show orders if available */}
                            {orders.length > 0 && (
                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center space-x-2">
                                        <Users className="w-5 h-5 text-gray-500" />
                                        <h2 className="text-xl font-semibold">
                                            {currentUser?.role === UserRole.OWNER 
                                                ? (selectedMember === 'all' 
                                                    ? 'All Orders' 
                                                    : selectedMember === currentUser.id
                                                        ? 'Your Orders'
                                                        : `Orders by ${members.find(m => m.id === selectedMember)?.firstName} ${members.find(m => m.id === selectedMember)?.lastName}`)
                                                : 'Your Orders'
                                            }
                                        </h2>
                                    </div>
                                    <div className="space-y-3">
                                        {orders.map((order) => (
                                            <Card
                                                key={order.id}
                                                className="cursor-pointer hover:bg-gray-50 transition-colors"
                                                onClick={() => handleOrderClick(order)}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <Badge variant={getStatusBadgeVariant(order.status)}>
                                                                {getStatusLabel(order.status)}
                                                            </Badge>
                                                            {currentUser?.role === UserRole.OWNER && order.billingInfo && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    {order.billingInfo.paymentMethod === 'bill_to_owner' ? 'Billed to You' : 'Credit Card'}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        {order.pickupLocation && (
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="w-4 h-4 text-gray-500" />
                                                                <span className="font-medium text-gray-900">
                                                                    {order.pickupLocation}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {order.vehicleInfo && (
                                                            <div className="flex items-center gap-2">
                                                                <Car className="w-4 h-4 text-gray-500" />
                                                                <span className="text-gray-700">
                                                                    {order.vehicleInfo.year} {order.vehicleInfo.make} {order.vehicleInfo.model}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {order.createdAt && (
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="w-4 h-4 text-gray-500" />
                                                                <span className="text-gray-600">
                                                                    {new Date(order.createdAt as Date).toLocaleDateString()} at {new Date(order.createdAt as Date).toLocaleTimeString()}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {currentUser?.role === UserRole.OWNER && order.billingInfo && (
                                                            <div className="flex items-center gap-2">
                                                                <UserIcon className="w-4 h-4 text-gray-500" />
                                                                <span className="text-gray-600">
                                                                    Member: {members.find(m => m.id === order.billingInfo?.userId)?.firstName} {members.find(m => m.id === order.billingInfo?.userId)?.lastName}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </>
                    )}

                    {!isLoading && orders.length === 0 && (
                        <div className="flex flex-col items-center justify-center text-center text-muted-foreground pt-24">
                            <List className="w-16 h-16 mb-4" />
                            <h2 className="text-xl font-bold">No Past Activity</h2>
                            <p className="max-w-xs mt-2">
                                {currentUser?.role === UserRole.OWNER 
                                    ? "Orders from your members will appear here."
                                    : "Your completed services will appear here."
                                }
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ActivityPage;
