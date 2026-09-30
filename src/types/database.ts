export type UserRole = 'customer' | 'admin';

export type OrderStatus =
  | 'quote_requested'
  | 'quote_sent'
  | 'awaiting_confirmation'
  | 'confirmed'
  | 'purchased'
  | 'in_transit'
  | 'arrived_mozambique'
  | 'ready_for_pickup'
  | 'picked_up'
  | 'cancelled';

export type QuoteStatus = 'pending' | 'sent' | 'accepted' | 'rejected' | 'expired';

export interface Profile {
  id: string;
  auth_user_id: string;
  full_name: string;
  phone: string | null;
  email: string;
  role: UserRole;
  city: string | null;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PickupPoint {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string | null;
  opening_hours: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  supplier_id: string;
  product_url: string;
  product_name: string;
  category: string | null;
  size: string | null;
  color: string | null;
  quantity: number;
  notes: string | null;
  city: string | null;
  pickup_point_id: string | null;
  status: OrderStatus;
  payment_status: string;
  tracking_code: string | null;
  admin_notes: string | null;
  last_updated_at: string;
  created_at: string;
  updated_at: string;
}

export interface Quote {
  id: string;
  order_id: string;
  product_price: number;
  shipping_cost: number;
  taxes: number;
  service_fee: number;
  other_costs: number;
  total: number;
  currency: string;
  admin_notes: string | null;
  status: QuoteStatus;
  created_at: string;
  updated_at: string;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: string;
  note: string | null;
  changed_by: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  order_id: string | null;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  quote_requested: 'Cotação solicitada',
  quote_sent: 'Cotação enviada',
  awaiting_confirmation: 'Aguardando confirmação',
  confirmed: 'Pedido confirmado',
  purchased: 'Compra realizada',
  in_transit: 'Em transporte',
  arrived_mozambique: 'Chegou a Moçambique',
  ready_for_pickup: 'Pronto para levantamento',
  picked_up: 'Levantado',
  cancelled: 'Cancelado',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  quote_requested: 'bg-slate-100 text-slate-700',
  quote_sent: 'bg-blue-100 text-blue-700',
  awaiting_confirmation: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-indigo-100 text-indigo-700',
  purchased: 'bg-purple-100 text-purple-700',
  in_transit: 'bg-cyan-100 text-cyan-700',
  arrived_mozambique: 'bg-teal-100 text-teal-700',
  ready_for_pickup: 'bg-green-100 text-green-700',
  picked_up: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
};