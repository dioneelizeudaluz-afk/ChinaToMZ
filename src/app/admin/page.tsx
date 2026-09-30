import { Package, FileText, Truck, CheckCircle2, MapPin, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [newOrders, pendingQuotes, inTransit, arrived, ready, picked, customers] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'quote_requested'),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'quote_sent'),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'in_transit'),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'arrived_mozambique'),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'ready_for_pickup'),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'picked_up'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
  ]);

  const stats = [
    { label: 'Pedidos novos', value: newOrders.count || 0, icon: Package, color: 'text-amber-600' },
    { label: 'Cotações pendentes', value: pendingQuotes.count || 0, icon: FileText, color: 'text-blue-600' },
    { label: 'Em transporte', value: inTransit.count || 0, icon: Truck, color: 'text-cyan-600' },
    { label: 'Chegados a MZ', value: arrived.count || 0, icon: MapPin, color: 'text-teal-600' },
    { label: 'Prontos p/ levantar', value: ready.count || 0, icon: CheckCircle2, color: 'text-green-600' },
    { label: 'Levantados', value: picked.count || 0, icon: CheckCircle2, color: 'text-emerald-600' },
    { label: 'Clientes', value: customers.count || 0, icon: Users, color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Dashboard Admin</h1>
        <p className="mt-1 text-sm text-slate-500">Resumo operacional da ChinaToMZ.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{stat.label}</p>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="mt-2 text-3xl font-bold text-brand-navy">{stat.value}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}