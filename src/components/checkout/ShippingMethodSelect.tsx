import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';
import { useStoreSettings } from '@/hooks/useStoreSettings';

interface ShippingMethodSelectProps {
  value: string;
  onChange: (value: string) => void;
  subtotal: number;
  error?: string;
}

export const ShippingMethodSelect = ({ value, onChange, subtotal, error }: ShippingMethodSelectProps) => {
  const { data: settings } = useStoreSettings();
  
  const standardCost = settings && subtotal >= settings.free_shipping_threshold ? 0 : settings?.standard_shipping_cost || 800;
  const expressCost = settings && subtotal >= settings.free_shipping_threshold ? 0 : settings?.express_shipping_cost || 1500;
  const isEligibleForFreeShipping = settings ? subtotal >= settings.free_shipping_threshold : false;

  // Auto-select free shipping when eligible
  if (isEligibleForFreeShipping && value !== 'free') {
    onChange('free');
  }

  return (
    <FormItem>
      <FormLabel>Shipping Method</FormLabel>
      <FormControl>
        {isEligibleForFreeShipping ? (
          <div className="neu-input p-3 rounded-lg border border-primary bg-primary/5">
            <div className="flex justify-between items-center w-full">
              <div>
                <p className="font-medium text-primary">🎉 Free Shipping</p>
                <p className="text-sm text-muted-foreground">{settings?.standard_delivery_time || '5-7 business days'}</p>
              </div>
              <span className="font-medium text-primary ml-4">Free</span>
            </div>
          </div>
        ) : (
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="neu-input">
              <SelectValue placeholder="Select shipping method" />
            </SelectTrigger>
            <SelectContent className="neu-surface border border-border z-50 bg-background">
              <SelectItem value="standard" className="cursor-pointer hover:bg-accent">
                <div className="flex justify-between items-center w-full">
                  <div>
                    <p className="font-medium">Standard Shipping</p>
                    <p className="text-sm text-muted-foreground">{settings?.standard_delivery_time || '5-7 business days'}</p>
                  </div>
                  <span className="font-medium ml-4">
                    {standardCost === 0 ? 'Free' : formatCurrency(standardCost)}
                  </span>
                </div>
              </SelectItem>
              <SelectItem value="express" className="cursor-pointer hover:bg-accent">
                <div className="flex justify-between items-center w-full">
                  <div>
                    <p className="font-medium">Express Shipping</p>
                    <p className="text-sm text-muted-foreground">{settings?.express_delivery_time || '2-3 business days'}</p>
                  </div>
                  <span className="font-medium ml-4">
                    {expressCost === 0 ? 'Free' : formatCurrency(expressCost)}
                  </span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        )}
      </FormControl>
      {isEligibleForFreeShipping && settings && (
        <p className="text-sm text-muted-foreground mt-1">
          🎉 Congratulations! You've unlocked free shipping by spending over {formatCurrency(settings.free_shipping_threshold)}
        </p>
      )}
      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
};