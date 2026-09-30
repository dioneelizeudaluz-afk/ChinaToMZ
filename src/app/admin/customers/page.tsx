import { Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { formatDateShort } from '@/lib/utils';

export default async function AdminCustomersPage() {
  const supabase = await createClient();

  const { data: customers } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'customer')
    .order('created_at', { ascending: false });

  const list = customers || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Clientes</h1>
        <p className="mt-1 text-sm text-slate-500">{list.length} cliente(s) registado(s).</p>
      </div>

      {list.length === 0 ? (
        <EmptyState icon={Users} title="Sem clientes" description="Ainda não há clientes registados." />
      ) : (
        <Card>
          <CardHeader><CardTitle>Lista</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-brand-muted">
              {list.map((c) => (
                <div key={c.id} className="p-4">
                  <p className="font-medium text-brand-navy">{c.full_name}</p>
                  <p className="text-sm text-slate-500">{c.email}</p>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-400">
                    {c.phone && <span>{c.phone}</span>}
                    {c.city && <span>{c.city}</span>}
                    <span>Desde {formatDateShort(c.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}