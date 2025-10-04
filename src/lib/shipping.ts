// Legacy fallback values (used when database is not available)
export const STANDARD_SHIPPING = 800;
export const EXPRESS_SHIPPING = 1500;
export const FREE_SHIPPING_THRESHOLD = 100000;
export const STANDARD_DELIVERY = '5-7 business days';
export const EXPRESS_DELIVERY = '2-3 business days';

// Helper functions that use settings object
export const calcShippingCost = (subtotal: number, method: 'standard' | 'express', settings?: {
  standard_shipping_cost: number;
  express_shipping_cost: number;
  free_shipping_threshold: number;
}) => {
  const config = settings || {
    standard_shipping_cost: STANDARD_SHIPPING,
    express_shipping_cost: EXPRESS_SHIPPING,
    free_shipping_threshold: FREE_SHIPPING_THRESHOLD,
  };
  
  if (subtotal >= config.free_shipping_threshold) return 0;
  return method === 'express' ? config.express_shipping_cost : config.standard_shipping_cost;
};

export const getEstimatedDelivery = (method: 'standard' | 'express', settings?: {
  standard_delivery_time: string;
  express_delivery_time: string;
}) => {
  const config = settings || {
    standard_delivery_time: STANDARD_DELIVERY,
    express_delivery_time: EXPRESS_DELIVERY,
  };
  
  return method === 'express' ? config.express_delivery_time : config.standard_delivery_time;
};