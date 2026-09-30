import Link from 'next/link';
import { Package, FileText, Bell, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatDateShort } from '@/lib/utils';
import type { OrderStatus } from '@/types/database';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('auth_user_id', user.id)
    .single();

  const [activeOrdersRes, recentOrdersRes, pendingQuotesRes, unreadNotifRes] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true })
      .eq('customer_id', profile?.id).not('status', 'in', '(picked_up,cancelled)'),
    supabase.from('orders').select('id, order_number, product_name, status, created_at')
      .eq('customer_id', profile?.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('quotes').select('id', { count: 'exact', head: true }).eq('status', 'sent'),
    supabase.from('notifications').select('*', { count: 'exact', head: true })
      .eq('user_id', profile?.id).eq('read', false),
  ]);

  const stats = [
    { label: 'Pedidos ativos', value: activeOrdersRes.count || 0, icon: Package },
    { label: 'Cotações pendentes', value: pendingQuotesRes.count || 0, icon: FileText },
    { label: 'Notificações', value: unreadNotifRes.count || 0, icon: Bell },
  ];

  const recentOrders = recentOrdersRes.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">
            Olá, {profile?.full_name?.split(' ')[0] || 'Cliente'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">Aqui está o resumo da tua conta.</p>
        </div>
        <Link href="/dashboard/orders/new">
          <Button size="lg" className="w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Novo pedido
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{stat.label}</p>
                <Icon className="h-5 w-5 text-brand-blue" />
              </div>
              <p className="mt-2 text-3xl font-bold text-brand-navy">{stat.value}</p>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pedidos recentes</CardTitle>
          <Link href="/dashboard/orders" className="text-sm font-medium text-brand-blue hover:underline">
            Ver todos
          </Link>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
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
            <div className="divide-y divide-brand-muted">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/dashboard/orders/${order.id}`}
                  className="flex items-center justify-between gap-3 py-3 hover:bg-brand-light/50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-brand-purple">#{order.order_number}</span>
                      <span className="text-xs text-slate-400">{formatDateShort(order.created_at)}</span>
                    </div>
                    <p className="mt-0.5 truncate text-sm font-medium text-brand-navy">{order.product_name}</p>
                  </div>
                  <StatusBadge status={order.status as OrderStatus} />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}