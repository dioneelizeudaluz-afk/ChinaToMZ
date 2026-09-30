'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { createOrderSchema } from '@/schemas/order';

export interface ActionResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  orderId?: string;
  orderNumber?: string;
}

export async function createOrderAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Sessão inválida.' };

  const { data: profile } = await supabase
    .from('profiles').select('id').eq('auth_user_id', user.id).single();

  if (!profile) return { success: false, error: 'Perfil não encontrado.' };

  const raw = {
    supplier_id: String(formData.get('supplier_id') || ''),
    product_url: String(formData.get('product_url') || '').trim(),
    product_name: String(formData.get('product_name') || '').trim(),
    category: String(formData.get('category') || '').trim(),
    size: String(formData.get('size') || '').trim(),
    color: String(formData.get('color') || '').trim(),
    quantity: formData.get('quantity'),
    notes: String(formData.get('notes') || '').trim(),
    city: String(formData.get('city') || '').trim(),
    pickup_point_id: String(formData.get('pickup_point_id') || ''),
  };

  const parsed = createOrderSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Verifique os campos.',
      fieldErrors: parsed.error.flatten().fieldErrors as any,
    };
  }

  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      customer_id: profile.id,
      supplier_id: parsed.data.supplier_id,
      product_url: parsed.data.product_url,
      product_name: parsed.data.product_name,
      category: parsed.data.category || null,
      size: parsed.data.size || null,
      color: parsed.data.color || null,
      quantity: parsed.data.quantity,
      notes: parsed.data.notes || null,
      city: parsed.data.city,
      pickup_point_id: parsed.data.pickup_point_id,
      status: 'quote_requested',
    })
    .select('id, order_number')
    .single();

  if (error) {
    return { success: false, error: 'Não foi possível criar o pedido.' };
  }

  await supabase.from('order_status_history').insert({
    order_id: order.id,
    status: 'quote_requested',
    note: 'Pedido criado pelo cliente',
    changed_by: profile.id,
  });

  revalidatePath('/dashboard/orders');
  return { success: true, orderId: order.id, orderNumber: order.order_number };
}

export async function acceptQuoteAction(quoteId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Sessão inválida.' };

  const { data: quote } = await supabase
    .from('quotes').select('id, order_id, status').eq('id', quoteId).single();

  if (!quote || quote.status !== 'sent') {
    return { success: false, error: 'Cotação não disponível.' };
  }

  const { error: quoteError } = await supabase
    .from('quotes').update({ status: 'accepted' }).eq('id', quoteId);

  if (quoteError) return { success: false, error: 'Não foi possível aceitar.' };

  await supabase.from('orders').update({ status: 'confirmed' }).eq('id', quote.order_id);

  await supabase.from('order_status_history').insert({
    order_id: quote.order_id,
    status: 'confirmed',
    note: 'Cotação aceite pelo cliente',
  });

  revalidatePath('/dashboard/orders');
  return { success: true };
}

export async function rejectQuoteAction(quoteId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Sessão inválida.' };

  const { data: quote } = await supabase
    .from('quotes').select('id, order_id, status').eq('id', quoteId).single();

  if (!quote || quote.status !== 'sent') {
    return { success: false, error: 'Cotação não disponível.' };
  }

  await supabase.from('quotes').update({ status: 'rejected' }).eq('id', quoteId);
  await supabase.from('orders').update({ status: 'cancelled' }).eq('id', quote.order_id);

  await supabase.from('order_status_history').insert({
    order_id: quote.order_id,
    status: 'cancelled',
    note: 'Cotação recusada pelo cliente',
  });

  revalidatePath('/dashboard/orders');
  return { success: true };
}