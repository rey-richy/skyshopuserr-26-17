import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useCreatePromoCode, useUpdatePromoCode } from '@/hooks/usePromoCodes';

interface PromoCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingPromo?: any;
}

export const PromoCodeDialog = ({ open, onOpenChange, editingPromo }: PromoCodeDialogProps) => {
  const createPromo = useCreatePromoCode();
  const updatePromo = useUpdatePromoCode();

  const [form, setForm] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed' | 'shipping',
    value: 0,
    description: '',
    min_subtotal: '',
    max_discount: '',
    start_date: '',
    expiry_date: '',
    usage_limit: '',
    is_active: true,
  });

  useEffect(() => {
    if (editingPromo) {
      setForm({
        code: editingPromo.code,
        type: editingPromo.type,
        value: editingPromo.value,
        description: editingPromo.description,
        min_subtotal: editingPromo.min_subtotal || '',
        max_discount: editingPromo.max_discount || '',
        start_date: editingPromo.start_date || '',
        expiry_date: editingPromo.expiry_date || '',
        usage_limit: editingPromo.usage_limit || '',
        is_active: editingPromo.is_active,
      });
    } else {
      setForm({
        code: '',
        type: 'percentage',
        value: 0,
        description: '',
        min_subtotal: '',
        max_discount: '',
        start_date: '',
        expiry_date: '',
        usage_limit: '',
        is_active: true,
      });
    }
  }, [editingPromo, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      code: form.code.toUpperCase(),
      type: form.type,
      value: form.value,
      description: form.description,
      min_subtotal: form.min_subtotal ? Number(form.min_subtotal) : undefined,
      max_discount: form.max_discount ? Number(form.max_discount) : undefined,
      start_date: form.start_date || undefined,
      expiry_date: form.expiry_date || undefined,
      usage_limit: form.usage_limit ? Number(form.usage_limit) : undefined,
      is_active: form.is_active,
    };

    if (editingPromo) {
      updatePromo.mutate({ id: editingPromo.id, ...payload }, {
        onSuccess: () => onOpenChange(false),
      });
    } else {
      createPromo.mutate(payload, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingPromo ? 'Edit Promo Code' : 'Create Promo Code'}</DialogTitle>
          <DialogDescription>
            {editingPromo ? 'Update promo code details' : 'Add a new promotional discount code'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="SUMMER2024"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select value={form.type} onValueChange={(value: any) => setForm({ ...form, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage Off</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                  <SelectItem value="shipping">Free Shipping</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">
              Value * {form.type === 'percentage' ? '(0.1 = 10%)' : '(₦)'}
            </Label>
            <Input
              id="value"
              type="number"
              step={form.type === 'percentage' ? '0.01' : '1'}
              value={form.value}
              onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="10% off your order"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min_subtotal">Min Order Amount (₦)</Label>
              <Input
                id="min_subtotal"
                type="number"
                value={form.min_subtotal}
                onChange={(e) => setForm({ ...form, min_subtotal: e.target.value })}
                placeholder="Optional"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_discount">Max Discount (₦)</Label>
              <Input
                id="max_discount"
                type="number"
                value={form.max_discount}
                onChange={(e) => setForm({ ...form, max_discount: e.target.value })}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="datetime-local"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry_date">Expiry Date</Label>
              <Input
                id="expiry_date"
                type="datetime-local"
                value={form.expiry_date}
                onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="usage_limit">Usage Limit</Label>
            <Input
              id="usage_limit"
              type="number"
              value={form.usage_limit}
              onChange={(e) => setForm({ ...form, usage_limit: e.target.value })}
              placeholder="Leave empty for unlimited"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createPromo.isPending || updatePromo.isPending}>
              {(createPromo.isPending || updatePromo.isPending) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {editingPromo ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
