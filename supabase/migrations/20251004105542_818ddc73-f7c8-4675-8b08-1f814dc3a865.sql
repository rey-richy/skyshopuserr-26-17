-- Create store_settings table for shipping configuration
CREATE TABLE IF NOT EXISTS public.store_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  standard_shipping_cost NUMERIC NOT NULL DEFAULT 800,
  express_shipping_cost NUMERIC NOT NULL DEFAULT 1500,
  free_shipping_threshold NUMERIC NOT NULL DEFAULT 100000,
  standard_delivery_time TEXT NOT NULL DEFAULT '5-7 business days',
  express_delivery_time TEXT NOT NULL DEFAULT '2-3 business days',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create promo_codes table
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed', 'shipping')),
  value NUMERIC NOT NULL,
  description TEXT NOT NULL,
  min_subtotal NUMERIC,
  max_discount NUMERIC,
  start_date TIMESTAMP WITH TIME ZONE,
  expiry_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  usage_limit INTEGER,
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on store_settings
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Enable RLS on promo_codes
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for store_settings
CREATE POLICY "Anyone can view store settings"
  ON public.store_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage store settings"
  ON public.store_settings
  FOR ALL
  USING (is_admin_or_manager(auth.uid()));

-- RLS Policies for promo_codes
CREATE POLICY "Anyone can view active promo codes"
  ON public.promo_codes
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage promo codes"
  ON public.promo_codes
  FOR ALL
  USING (is_admin_or_manager(auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_store_settings_updated_at
  BEFORE UPDATE ON public.store_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_promo_codes_updated_at
  BEFORE UPDATE ON public.promo_codes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial store settings
INSERT INTO public.store_settings (
  standard_shipping_cost,
  express_shipping_cost,
  free_shipping_threshold,
  standard_delivery_time,
  express_delivery_time
) VALUES (
  800,
  1500,
  100000,
  '5-7 business days',
  '2-3 business days'
);

-- Seed existing promo codes
INSERT INTO public.promo_codes (code, type, value, description, max_discount, is_active)
VALUES 
  ('WELCOME10', 'percentage', 0.1, '10% off your order', 50000, true),
  ('FREESHIP', 'shipping', 1, 'Free shipping', NULL, true),
  ('SAVE20', 'percentage', 0.2, '20% off your order', 100000, true);

-- Update SAVE20 to have minimum subtotal
UPDATE public.promo_codes 
SET min_subtotal = 100000 
WHERE code = 'SAVE20';