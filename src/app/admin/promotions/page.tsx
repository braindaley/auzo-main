"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Tag, Plus, Droplet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { adminStorage } from '@/lib/admin-storage';
import { Promotion } from '@/lib/types/promotion';
import { AdminRole } from '@/lib/types/admin';

const PromotionsPage = () => {
  const router = useRouter();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [role, setRole] = useState<AdminRole>(AdminRole.SUPPORT);

  useEffect(() => {
    loadPromotions();
    setRole(adminStorage.getAdminRole());
  }, []);

  const loadPromotions = () => {
    const data = adminStorage.getPromotions();
    setPromotions(data);
  };

  const handleToggleActive = (promotionId: string, currentStatus: boolean) => {
    if (role === AdminRole.SUPPORT) return;

    adminStorage.updatePromotion(promotionId, { isActive: !currentStatus });
    loadPromotions();
  };

  const isActive = (promo: Promotion) => {
    const now = new Date();
    const start = new Date(promo.startDate);
    const end = new Date(promo.endDate);
    return promo.isActive && now >= start && now <= end;
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
            <h1 className="text-2xl font-bold text-gray-900">Promotions</h1>
          </div>
          <Button
            className="bg-black text-white hover:bg-gray-800"
            disabled={role === AdminRole.SUPPORT}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Button>
        </div>

        {/* Promotions List */}
        <div className="space-y-4">
          {promotions.length === 0 ? (
            <div className="text-center py-8">
              <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No promotions</p>
            </div>
          ) : (
            promotions.map((promo) => (
              <Card key={promo.id} className="border-gray-200">
                <CardContent className="p-0">
                  {/* Promotional Image */}
                  <div className="h-32 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <div className="text-gray-600 text-center">
                      <Droplet className="w-12 h-12 mx-auto mb-2 opacity-80" />
                      <p className="text-sm font-medium">{promo.serviceName}</p>
                    </div>
                  </div>

                  {/* Promotion Details */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-gray-900">{promo.title}</h3>
                          <Badge
                            variant={isActive(promo) ? 'default' : 'outline'}
                            className={isActive(promo) ? 'bg-black text-white' : 'text-gray-700 border-gray-300'}
                          >
                            {isActive(promo) ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 font-medium mb-1">{promo.location}</p>
                        <p className="text-sm text-gray-600">{promo.description}</p>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-gray-600">Discount</div>
                        <div className="font-medium text-gray-900">
                          {promo.discountType === 'fixed' ? `$${promo.discountAmount}` : `${promo.discountAmount}%`} off
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Service</div>
                        <div className="font-medium text-gray-900">{promo.serviceName}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Start Date</div>
                        <div className="font-medium text-gray-900">
                          {new Date(promo.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">End Date</div>
                        <div className="font-medium text-gray-900">
                          {new Date(promo.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>

                    {/* Terms */}
                    {promo.terms && (
                      <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                        {promo.terms}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-gray-300 text-gray-700"
                        disabled={role === AdminRole.SUPPORT}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-gray-300 text-gray-700"
                        onClick={() => handleToggleActive(promo.id, promo.isActive)}
                        disabled={role === AdminRole.SUPPORT}
                      >
                        {promo.isActive ? 'Disable' : 'Enable'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Info Card */}
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <Tag className="w-4 h-4 text-gray-500 mt-0.5" />
              <div className="text-sm text-gray-700">
                <div className="font-medium mb-1">About Promotions</div>
                <div className="text-gray-600">
                  Promotions are displayed on the customer home page and can be tied to specific service locations.
                  Active promotions will automatically apply discounts when customers book the associated service.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PromotionsPage;