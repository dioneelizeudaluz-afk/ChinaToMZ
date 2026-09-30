import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatDate, formatMT } from '@/lib/utils';
import type { OrderStatus } from '@/types/database';
import AdminQuoteForm from './quote-form';
import AdminStatusForm from './status-form';

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: order } = await supabase
    .from('orders')
    .select('*, profiles(full_name, email, phone), suppliers(name), pickup_points(name, city, address)')
    .eq('id', params.id)
    .single();

  if (!order) notFound();

  const { data: quote } = await supabase
    .from('quotes').select('*').eq('order_id', order.id)
    .order('created_at', { ascending: false }).limit(1).maybeSingle();

  const { data: history } = await supabase
    .from('order_status_history').select('*').eq('order_id', order.id)
    .order('created_at', { ascending: false });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-navy">
        <ArrowLeft className="h-4 w-4" />Voltar
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-brand-navy">#{order.order_number}</h1>
        <StatusBadge status={order.status as OrderStatus} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Cliente</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium text-brand-navy">{(order as any).profiles?.full_name}</p>
            <p className="text-slate-500">{(order as any).profiles?.email}</p>
            {(order as any).profiles?.phone && <p className="text-slate-500">{(order as any).profiles?.phone}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Produto</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium text-brand-navy">{order.product_name}</p>
            <a href={order.product_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-brand-blue hover:underline break-all">
              Ver produto <ExternalLink className="h-3 w-3" />
            </a>
            <p className="text-slate-500">Qtd: {order.quantity}</p>
            {order.size && <p className="text-slate-500">Tam: {order.size}</p>}
            {order.color && <p className="text-slate-500">Cor: {order.color}</p>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>{quote ? 'Cotação existente' : 'Criar cotação'}</CardTitle></CardHeader>
        <CardContent>
          {quote ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Produto</span><span className="font-medium">{formatMT(quote.product_price)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Transporte</span><span className="font-medium">{formatMT(quote.shipping_cost)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Taxas</span><span className="font-medium">{formatMT(quote.taxes)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Serviço</span><span className="font-medium">{formatMT(quote.service_fee)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Outros</span><span className="font-medium">{formatMT(quote.other_costs)}</span></div>
              <div className="flex justify-between border-t border-brand-muted pt-2"><span className="font-semibold">Total</span><span className="font-bold text-brand-purple">{formatMT(quote.total)}</span></div>
              <div className="pt-2">
                <span className="text-xs text-slate-500">Estado: </span>
                <span className="text-xs font-medium">{quote.status}</span>
              </div>
            </div>
          ) : (
            <AdminQuoteForm orderId={order.id} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Atualizar estado</CardTitle></CardHeader>
        <CardContent>
          <AdminStatusForm orderId={order.id} currentStatus={order.status} currentTracking={order.tracking_code || ''} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Histórico</CardTitle></CardHeader>
        <CardContent>
          {!history || history.length === 0 ? (
            <p className="text-sm text-slate-500">Sem histórico.</p>
          ) : (
            <div className="space-y-3">
              {history.map((h) => (
                <div key={h.id} className="border-l-2 border-brand-muted pl-3">
                  <p className="text-sm font-medium text-brand-navy">{h.status}</p>
                  {h.note && <p className="text-sm text-slate-500">{h.note}</p>}
                  <p className="mt-0.5 text-xs text-slate-400">{formatDate(h.created_at)}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}