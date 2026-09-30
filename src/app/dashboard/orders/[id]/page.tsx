import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, MapPin, Package } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { formatDate, formatMT } from '@/lib/utils';
import type { OrderStatus } from '@/types/database';
import QuoteActions from './quote-actions';

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles').select('id').eq('auth_user_id', user.id).single();

  const { data: order } = await supabase
    .from('orders')
    .select('*, suppliers(name), pickup_points(name, address, city, phone, opening_hours)')
    .eq('id', params.id)
    .eq('customer_id', profile?.id)
    .single();

  if (!order) notFound();

  const { data: quote } = await supabase
    .from('quotes').select('*').eq('order_id', order.id)
    .order('created_at', { ascending: false }).limit(1).maybeSingle();

  const { data: history } = await supabase
    .from('order_status_history').select('*').eq('order_id', order.id)
    .order('created_at', { ascending: false });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href="/dashboard/orders" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-navy">
          <ArrowLeft className="h-4 w-4" />
          Voltar aos pedidos
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-brand-navy">#{order.order_number}</h1>
          <StatusBadge status={order.status as OrderStatus} />
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Produto</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <Package className="mt-0.5 h-5 w-5 text-brand-blue" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-brand-navy">{order.product_name}</p>
              <a href={order.product_url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs text-brand-blue hover:underline break-all">
                Ver produto original <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm pt-3 border-t border-brand-muted">
            {order.size && <div><p className="text-slate-500">Tamanho</p><p className="font-medium text-brand-navy">{order.size}</p></div>}
            {order.color && <div><p className="text-slate-500">Cor</p><p className="font-medium text-brand-navy">{order.color}</p></div>}
            <div><p className="text-slate-500">Quantidade</p><p className="font-medium text-brand-navy">{order.quantity}</p></div>
            <div><p className="text-slate-500">Fornecedor</p><p className="font-medium text-brand-navy">{(order as any).suppliers?.name}</p></div>
          </div>
          {order.notes && (
            <div className="pt-3 border-t border-brand-muted">
              <p className="text-sm text-slate-500">Observações</p>
              <p className="mt-1 text-sm text-brand-navy">{order.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {quote && (
        <Card>
          <CardHeader><CardTitle>Cotação</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Row label="Produto" value={formatMT(quote.product_price)} />
              <Row label="Transporte" value={formatMT(quote.shipping_cost)} />
              <Row label="Taxas" value={formatMT(quote.taxes)} />
              <Row label="Serviço ChinaToMZ" value={formatMT(quote.service_fee)} />
              <Row label="Outros custos" value={formatMT(quote.other_costs)} />
              <div className="flex items-center justify-between border-t border-brand-muted pt-3">
                <span className="font-semibold text-brand-navy">Total</span>
                <span className="text-lg font-bold text-brand-purple">{formatMT(quote.total)}</span>
              </div>
            </div>
            {quote.status === 'sent' && <QuoteActions quoteId={quote.id} />}
            {quote.status === 'accepted' && (
              <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                Cotação aceite
              </div>
            )}
            {quote.status === 'rejected' && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                Cotação recusada
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {(order as any).pickup_points && (
        <Card>
          <CardHeader><CardTitle>Ponto de levantamento</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-brand-blue" />
              <div>
                <p className="font-semibold text-brand-navy">{(order as any).pickup_points.name}</p>
                <p className="text-sm text-slate-500">{(order as any).pickup_points.address}</p>
                <p className="text-sm text-slate-500">{(order as any).pickup_points.city}</p>
                {(order as any).pickup_points.phone && (
                  <p className="mt-1 text-sm text-slate-500">Tel: {(order as any).pickup_points.phone}</p>
                )}
                {(order as any).pickup_points.opening_hours && (
                  <p className="text-sm text-slate-500">{(order as any).pickup_points.opening_hours}</p>
                )}
              </div>
            </div>
            {order.tracking_code && (
              <div className="pt-3 border-t border-brand-muted">
                <p className="text-sm text-slate-500">Código de tracking</p>
                <p className="mt-1 font-mono text-sm text-brand-navy">{order.tracking_code}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Histórico</CardTitle></CardHeader>
        <CardContent>
          {!history || history.length === 0 ? (
            <p className="text-sm text-slate-500">Sem histórico ainda.</p>
          ) : (
            <div className="space-y-3">
              {history.map((h) => (
                <div key={h.id} className="flex gap-3 border-l-2 border-brand-muted pl-3">
                  <div>
                    <p className="text-sm font-medium text-brand-navy">{h.status}</p>
                    {h.note && <p className="text-sm text-slate-500">{h.note}</p>}
                    <p className="mt-0.5 text-xs text-slate-400">{formatDate(h.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-brand-navy">{value}</span>
    </div>
  );
}