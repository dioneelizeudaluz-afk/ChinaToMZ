import { z } from 'zod';

export const createOrderSchema = z.object({
  supplier_id: z.string().uuid('Fornecedor inválido'),
  product_url: z.string().url('Link inválido'),
  product_name: z.string().min(3, 'Nome do produto obrigatório').max(200),
  category: z.string().max(100).optional().or(z.literal('')),
  size: z.string().max(20).optional().or(z.literal('')),
  color: z.string().max(50).optional().or(z.literal('')),
  quantity: z.coerce.number().int().min(1, 'Quantidade mínima: 1').max(999),
  notes: z.string().max(500).optional().or(z.literal('')),
  city: z.string().min(2, 'Cidade obrigatória').max(100),
  pickup_point_id: z.string().uuid('Ponto de levantamento inválido'),
});

export const createQuoteSchema = z.object({
  order_id: z.string().uuid(),
  product_price: z.coerce.number().min(0),
  shipping_cost: z.coerce.number().min(0),
  taxes: z.coerce.number().min(0),
  service_fee: z.coerce.number().min(0),
  other_costs: z.coerce.number().min(0),
  admin_notes: z.string().max(500).optional().or(z.literal('')),
});