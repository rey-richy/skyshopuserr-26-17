import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PromoCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'shipping';
  value: number;
  description: string;
  min_subtotal?: number;
  max_discount?: number;
  start_date?: string;
  expiry_date?: string;
  is_active: boolean;
  usage_limit?: number;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export const usePromoCodes = (activeOnly = false) => {
  return useQuery({
    queryKey: ['promo-codes', activeOnly],
    queryFn: async () => {
      let query = supabase.from('promo_codes').select('*').order('created_at', { ascending: false });

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as PromoCode[];
    },
  });
};

export const useCreatePromoCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (promoCode: Omit<PromoCode, 'id' | 'created_at' | 'updated_at' | 'usage_count'>) => {
      const { data, error } = await supabase
        .from('promo_codes')
        .insert(promoCode)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promo-codes'] });
      toast.success('Promo code created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create promo code');
    },
  });
};

export const useUpdatePromoCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PromoCode> & { id: string }) => {
      const { data, error } = await supabase
        .from('promo_codes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promo-codes'] });
      toast.success('Promo code updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update promo code');
    },
  });
};

export const useDeletePromoCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('promo_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promo-codes'] });
      toast.success('Promo code deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete promo code');
    },
  });
};
