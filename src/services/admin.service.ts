'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles').select('id, role').eq('auth_user_id', user.id).single();

  if (!profile || profile.role !== 'admin') redirect('/dashboard');
  return { supabase, profile };
}

export async function createQuoteAction(
  _prevState: any,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const { supabase, profile } = await requireAdmin();

  const order_id = String(formData.get('order_id') || '');
  const product_price = parseFloat(String(formData.get('product_price') || '0'));
  const shipping_cost = parseFloat(String(formData.get('shipping_cost') || '0'));
  const taxes = parseFloat(String(formData.get('taxes') || '0'));
  const service_fee = parseFloat(String(formData.get('service_fee') || '0'));
  const other_costs = parseFloat(String(formData.get('other_costs') || '0'));
  const admin_notes = String(formData.get('admin_notes') || '').trim();

  if (!order_id) return { success: false, error: 'Pedido inválido.' };
  if (product_price < 0 || shipping_cost < 0 || taxes < 0 || service_fee < 0 || other_costs < 0) {
    return { success: false, error: 'Valores negativos não são permitidos.' };
  }

  const total = product_price + shipping_cost + taxes + service_fee + other_costs;

  const { error } = await supabase.from('quotes').insert({
    order_id,
    product_price,
    shipping_cost,
    taxes,
    service_fee,
    other_costs,
    total,
    currency: 'MZN',
    admin_notes: admin_notes || null,
    status: 'sent',
  });

  if (error) return { success: false, error: 'Não foi possível criar a cotação.' };

  await supabase.from('orders').update({ status: 'quote_sent' }).eq('id', order_id);

  await supabase.from('order_status_history').insert({
    order_id,
    status: 'quote_sent',
    note: 'Cotação enviada ao cliente',
    changed_by: profile.id,
  });

  const { data: order } = await supabase
    .from('orders').select('customer_id, order_number').eq('id', order_id).single();

  if (order) {
    await supabase.from('notifications').insert({
      user_id: order.customer_id,
      order_id,
      title: 'Nova cotação recebida',
      message: `A cotação do pedido #${order.order_number} está disponível.`,
    });
  }

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${order_id}`);
  return { success: true };
}

export async function updateOrderStatusAction(
  _prevState: any,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const { supabase, profile } = await requireAdmin();

  const order_id = String(formData.get('order_id') || '');
  const status = String(formData.get('status') || '');
  const note = String(formData.get('note') || '').trim();
  const tracking_code = String(formData.get('tracking_code') || '').trim();

  if (!order_id || !status) return { success: false, error: 'Dados inválidos.' };

  const updateData: any = { status, last_updated_at: new Date().toISOString() };
  if (tracking_code) updateData.tracking_code = tracking_code;

  const { error } = await supabase.from('orders').update(updateData).eq('id', order_id);
  if (error) return { success: false, error: 'Não foi possível atualizar.' };

  await supabase.from('order_status_history').insert({
    order_id,
    status,
    note: note || null,
    changed_by: profile.id,
  });

  const { data: order } = await supabase
    .from('orders').select('customer_id, order_number').eq('id', order_id).single();

  if (order) {
    const statusLabels: Record<string, string> = {
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

    await supabase.from('notifications').insert({
      user_id: order.customer_id,
      order_id,
      title: 'Atualização do pedido',
      message: `O pedido #${order.order_number} está agora: ${statusLabels[status] || status}.`,
    });
  }

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${order_id}`);
  return { success: true };
}

export async function createPickupPointAction(
  _prevState: any,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const { supabase } = await requireAdmin();

  const name = String(formData.get('name') || '').trim();
  const address = String(formData.get('address') || '').trim();
  const city = String(formData.get('city') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const opening_hours = String(formData.get('opening_hours') || '').trim();

  if (!name || !address || !city) return { success: false, error: 'Campos obrigatórios.' };

  const { error } = await supabase.from('pickup_points').insert({
    name, address, city,
    phone: phone || null,
    opening_hours: opening_hours || null,
    active: true,
  });

  if (error) return { success: false, error: 'Não foi possível criar.' };

  revalidatePath('/admin/pickup-points');
  return { success: true };
}