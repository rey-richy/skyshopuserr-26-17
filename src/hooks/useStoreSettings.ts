import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface StoreSettings {
  id: string;
  standard_shipping_cost: number;
  express_shipping_cost: number;
  free_shipping_threshold: number;
  standard_delivery_time: string;
  express_delivery_time: string;
}

export const useStoreSettings = () => {
  return useQuery({
    queryKey: ['store-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .single();

      if (error) throw error;
      return data as StoreSettings;
    },
  });
};

export const useUpdateStoreSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Partial<StoreSettings>) => {
      const { data: existingSettings } = await supabase
        .from('store_settings')
        .select('id')
        .single();

      if (!existingSettings) throw new Error('Store settings not found');

      const { data, error } = await supabase
        .from('store_settings')
        .update(settings)
        .eq('id', existingSettings.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-settings'] });
      toast.success('Store settings updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update store settings');
      console.error('Store settings update error:', error);
    },
  });
};
