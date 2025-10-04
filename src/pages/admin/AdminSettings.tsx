import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import { useStoreSettings, useUpdateStoreSettings } from '@/hooks/useStoreSettings';
import { usePromoCodes, useDeletePromoCode, useUpdatePromoCode } from '@/hooks/usePromoCodes';
import { PromoCodeDialog } from '@/components/admin/PromoCodeDialog';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

export default function AdminSettings() {
  const { data: settings, isLoading: settingsLoading } = useStoreSettings();
  const { data: promoCodes, isLoading: promoLoading } = usePromoCodes(false);
  const updateSettings = useUpdateStoreSettings();
  const deletePromo = useDeletePromoCode();
  const updatePromo = useUpdatePromoCode();

  const [shippingForm, setShippingForm] = useState({
    standard_shipping_cost: settings?.standard_shipping_cost || 800,
    express_shipping_cost: settings?.express_shipping_cost || 1500,
    free_shipping_threshold: settings?.free_shipping_threshold || 100000,
    standard_delivery_time: settings?.standard_delivery_time || '5-7 business days',
    express_delivery_time: settings?.express_delivery_time || '2-3 business days',
  });

  const [promoDialogOpen, setPromoDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<any>(null);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate(shippingForm);
  };

  const handleTogglePromo = (id: string, isActive: boolean) => {
    updatePromo.mutate({ id, is_active: !isActive });
  };

  const handleEditPromo = (promo: any) => {
    setEditingPromo(promo);
    setPromoDialogOpen(true);
  };

  const handleDeletePromo = (id: string) => {
    if (confirm('Are you sure you want to delete this promo code?')) {
      deletePromo.mutate(id);
    }
  };

  if (settingsLoading || promoLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Store Settings</h1>
          <p className="text-muted-foreground">Manage shipping methods and promo codes</p>
        </div>

        {/* Shipping Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Settings</CardTitle>
            <CardDescription>Configure shipping costs and delivery times</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="standard_cost">Standard Shipping Cost (₦)</Label>
                  <Input
                    id="standard_cost"
                    type="number"
                    value={shippingForm.standard_shipping_cost}
                    onChange={(e) => setShippingForm({ ...shippingForm, standard_shipping_cost: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="express_cost">Express Shipping Cost (₦)</Label>
                  <Input
                    id="express_cost"
                    type="number"
                    value={shippingForm.express_shipping_cost}
                    onChange={(e) => setShippingForm({ ...shippingForm, express_shipping_cost: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="free_threshold">Free Shipping Threshold (₦)</Label>
                  <Input
                    id="free_threshold"
                    type="number"
                    value={shippingForm.free_shipping_threshold}
                    onChange={(e) => setShippingForm({ ...shippingForm, free_shipping_threshold: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="standard_time">Standard Delivery Time</Label>
                  <Input
                    id="standard_time"
                    value={shippingForm.standard_delivery_time}
                    onChange={(e) => setShippingForm({ ...shippingForm, standard_delivery_time: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="express_time">Express Delivery Time</Label>
                  <Input
                    id="express_time"
                    value={shippingForm.express_delivery_time}
                    onChange={(e) => setShippingForm({ ...shippingForm, express_delivery_time: e.target.value })}
                  />
                </div>
              </div>
              <Button type="submit" disabled={updateSettings.isPending}>
                {updateSettings.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Shipping Settings
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Promo Codes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Promo Codes</CardTitle>
              <CardDescription>Manage discount codes and promotions</CardDescription>
            </div>
            <Button onClick={() => { setEditingPromo(null); setPromoDialogOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Create Promo Code
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {promoCodes?.map((promo) => (
                <div key={promo.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <code className="px-2 py-1 bg-muted rounded font-mono font-bold">{promo.code}</code>
                      <Badge variant={promo.is_active ? 'default' : 'secondary'}>
                        {promo.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">
                        {promo.type === 'percentage' ? `${promo.value * 100}% off` : 
                         promo.type === 'shipping' ? 'Free Shipping' : 
                         formatCurrency(promo.value)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{promo.description}</p>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      {promo.min_subtotal && <span>Min: {formatCurrency(promo.min_subtotal)}</span>}
                      {promo.max_discount && <span>Max Discount: {formatCurrency(promo.max_discount)}</span>}
                      {promo.usage_limit && <span>Usage: {promo.usage_count}/{promo.usage_limit}</span>}
                      {promo.expiry_date && <span>Expires: {format(new Date(promo.expiry_date), 'MMM dd, yyyy')}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={promo.is_active}
                      onCheckedChange={() => handleTogglePromo(promo.id, promo.is_active)}
                    />
                    <Button variant="ghost" size="icon" onClick={() => handleEditPromo(promo)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeletePromo(promo.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <PromoCodeDialog
        open={promoDialogOpen}
        onOpenChange={setPromoDialogOpen}
        editingPromo={editingPromo}
      />
    </>
  );
}
