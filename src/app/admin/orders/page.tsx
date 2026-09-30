import Link from 'next/link';
import { Package } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatDateShort } from '@/lib/utils';
import type { OrderStatus } from '@/types/database';

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from('orders')
    .select('*, profiles(full_name, email), suppliers(name)')
    .order('created_at', { ascending: false });

  const list = orders || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Pedidos</h1>
        <p className="mt-1 text-sm text-slate-500">Todos os pedidos dos clientes.</p>
      </div>

      {list.length === 0 ? (
        <EmptyState icon={Package} title="Sem pedidos" description="Ainda não existem pedidos." />
      ) : (
        <Card>
          <CardHeader><CardTitle>{list.length} pedido(s)</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-brand-muted">
              {list.map((order: any) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex flex-col gap-2 p-4 hover:bg-brand-light/50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-brand-purple">#{order.order_number}</span>
                      <span className="text-xs text-slate-400">{formatDateShort(order.created_at)}</span>
                    </div>
                    <p className="mt-1 truncate text-sm font-medium text-brand-navy">{order.product_name}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {order.profiles?.full_name} · {order.profiles?.email}
                    </p>
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