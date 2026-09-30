import { Truck } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AdminSuppliersPage() {
  const supabase = await createClient();
  const { data: suppliers } = await supabase.from('suppliers').select('*').order('name');
  const list = suppliers || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Fornecedores</h1>
        <p className="mt-1 text-sm text-slate-500">Origens de produtos suportadas.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>{list.length} fornecedor(es)</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-brand-muted">
            {list.map((s) => (
              <div key={s.id} className="flex items-center gap-3 p-4">
                <Truck className="h-5 w-5 text-brand-blue" />
                <div>
                  <p className="font-medium text-brand-navy">{s.name}</p>
                  <p className="text-xs text-slate-500">{s.slug} · {s.active ? 'Ativo' : 'Inativo'}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}