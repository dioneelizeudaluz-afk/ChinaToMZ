import Link from 'next/link';
import { Bell } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { formatDate } from '@/lib/utils';

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles').select('id').eq('auth_user_id', user.id).single();

  const { data: notifications } = await supabase
    .from('notifications').select('*').eq('user_id', profile?.id)
    .order('created_at', { ascending: false });

  const list = notifications || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Notificações</h1>
        <p className="mt-1 text-sm text-slate-500">{list.length} notificação(ões).</p>
      </div>

      {list.length === 0 ? (
        <EmptyState icon={Bell} title="Sem notificações" description="Quando houver novidades nos teus pedidos, aparecem aqui." />
      ) : (
        <div className="space-y-3">
          {list.map((n) => (
            <Card key={n.id} className={`p-4 ${!n.read ? 'border-l-4 border-l-brand-purple' : ''}`}>
              <CardContent className="p-0">
                <p className="font-medium text-brand-navy">{n.title}</p>
                <p className="mt-1 text-sm text-slate-500">{n.message}</p>
                <p className="mt-2 text-xs text-slate-400">{formatDate(n.created_at)}</p>
                {n.order_id && (
                  <Link href={`/dashboard/orders/${n.order_id}`} className="mt-2 inline-block text-xs font-medium text-brand-blue hover:underline">
                    Ver pedido →
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}