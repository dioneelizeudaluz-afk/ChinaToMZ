import Link from 'next/link';
import { Package, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatDateShort } from '@/lib/utils';
import type { OrderStatus } from '@/types/database';

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles').select('id').eq('auth_user_id', user.id).single();

  const { data: orders } = await supabase
    .from('orders')
    .select('*, suppliers(name)')
    .eq('customer_id', profile?.id)
    .order('created_at', { ascending: false });

  const list = orders || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Meus pedidos</h1>
          <p className="mt-1 text-sm text-slate-500">Acompanha todos os teus pedidos.</p>
        </div>
        <Link href="/dashboard/orders/new">
          <Button size="lg" className="w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Novo pedido
          </Button>
        </Link>
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Ainda não tens pedidos"
          description="Envia o teu primeiro link de produto para receber uma cotação."
          action={
            <Link href="/dashboard/orders/new">
              <Button><Plus className="h-4 w-4" />Pedir uma cotação</Button>
            </Link>
          }
        />
      ) : (
        <Card>
          <CardHeader><CardTitle>{list.length} pedido(s)</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-brand-muted">
              {list.map((order: any) => (
                <Link
                  key={order.id}
                  href={`/dashboard/orders/${order.id}`}
                  className="flex flex-col gap-2 p-4 hover:bg-brand-light/50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-brand-purple">#{order.order_number}</span>
                      <span className="text-xs text-slate-400">{formatDateShort(order.created_at)}</span>
                      {order.suppliers?.name && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                          {order.suppliers.name}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 truncate text-sm font-medium text-brand-navy">{order.product_name}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{order.city} · Qtd: {order.quantity}</p>
                  </div>
                  <StatusBadge status={order.status as OrderStatus} />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}