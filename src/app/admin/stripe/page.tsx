"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, CreditCard, Search, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { adminStorage } from '@/lib/admin-storage';
import { VirtualCard, AdminRole } from '@/lib/types/admin';

const StripePage = () => {
  const router = useRouter();
  const [cards, setCards] = useState<VirtualCard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [role, setRole] = useState<AdminRole>(AdminRole.SUPPORT);

  useEffect(() => {
    loadCards();
    setRole(adminStorage.getAdminRole());
  }, []);

  const loadCards = () => {
    const data = adminStorage.getVirtualCards();
    setCards(data);
  };

  const filteredCards = cards.filter(card =>
    card.cardholder.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.last4.includes(searchQuery) ||
    card.issuedToName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleStatus = (cardId: string, currentStatus: string) => {
    if (role === AdminRole.SUPPORT) return;

    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    adminStorage.updateVirtualCard(cardId, { status: newStatus as 'active' | 'suspended' | 'cancelled' });
    loadCards();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-black text-white';
      case 'suspended':
        return 'text-gray-700 border-gray-300';
      case 'cancelled':
        return 'text-gray-600 border-gray-300';
      default:
        return 'text-gray-700 border-gray-300';
    }
  };

  const getUtilization = (card: VirtualCard) => {
    return ((card.currentSpend / card.spendingLimit) * 100).toFixed(0);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/admin')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Stripe Virtual Cards</h1>
          </div>
          <Button
            className="bg-black text-white hover:bg-gray-800"
            disabled={role === AdminRole.SUPPORT}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Card
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by cardholder or card number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-gray-300"
          />
        </div>

        {/* Cards List */}
        <div className="space-y-4">
          {filteredCards.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No virtual cards found</p>
            </div>
          ) : (
            filteredCards.map((card) => (
              <Card key={card.id} className="border-gray-200">
                <CardContent className="p-4 space-y-3">
                  {/* Row 1: Card Info and Status */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="w-5 h-5 text-gray-600" />
                        <span className="font-semibold text-gray-900">•••• {card.last4}</span>
                        <Badge
                          variant={card.status === 'active' ? 'default' : 'outline'}
                          className={getStatusColor(card.status)}
                        >
                          {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-900 font-medium">{card.cardholder}</div>
                      <div className="text-xs text-gray-600">
                        {card.issuedTo.charAt(0).toUpperCase() + card.issuedTo.slice(1)}: {card.issuedToName}
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Spending Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Spending</span>
                      <span className="font-medium text-gray-900">
                        ${card.currentSpend.toFixed(2)} / ${card.spendingLimit.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-black transition-all"
                        style={{ width: `${Math.min(100, parseFloat(getUtilization(card)))}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      {getUtilization(card)}% utilized
                    </div>
                  </div>

                  {/* Row 3: Recent Transactions */}
                  {card.transactions.length > 0 && (
                    <div className="pt-2 border-t border-gray-100">
                      <div className="text-xs font-medium text-gray-700 mb-2">Recent Transactions</div>
                      <div className="space-y-1">
                        {card.transactions.slice(0, 2).map((txn) => (
                          <div key={txn.id} className="flex items-center justify-between text-xs">
                            <div className="flex-1">
                              <div className="text-gray-900">{txn.merchant}</div>
                              <div className="text-gray-500">
                                {new Date(txn.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {txn.category}
                              </div>
                            </div>
                            <div className="font-medium text-gray-900">${txn.amount.toFixed(2)}</div>
                          </div>
                        ))}
                        {card.transactions.length > 2 && (
                          <div className="text-xs text-gray-500 pt-1">
                            +{card.transactions.length - 2} more transactions
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Row 4: Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-gray-300 text-gray-700"
                      disabled={role === AdminRole.SUPPORT}
                    >
                      Set Limit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-gray-300 text-gray-700"
                      onClick={() => handleToggleStatus(card.id, card.status)}
                      disabled={role === AdminRole.SUPPORT || card.status === 'cancelled'}
                    >
                      {card.status === 'active' ? 'Suspend' : card.status === 'suspended' ? 'Activate' : 'Cancelled'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-gray-300 text-gray-700"
                      disabled={role === AdminRole.SUPPORT}
                    >
                      View Details
                    </Button>
                  </div>

                  {/* Created Date */}
                  <div className="text-xs text-gray-500 pt-1 border-t border-gray-100">
                    Created {new Date(card.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Summary */}
        <div className="text-center text-sm text-gray-500">
          Showing {filteredCards.length} of {cards.length} virtual cards
        </div>

        {/* Info Card */}
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <CreditCard className="w-4 h-4 text-gray-500 mt-0.5" />
              <div className="text-sm text-gray-700">
                <div className="font-medium mb-1">Virtual Cards</div>
                <div className="text-gray-600">
                  Stripe virtual cards allow drivers to make business-related purchases. Set spending limits and monitor transactions in real-time.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StripePage;