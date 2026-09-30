import { MapPin } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';

export default async function AdminPickupPointsPage() {
  const supabase = await createClient();
  const { data: points } = await supabase.from('pickup_points').select('*').order('name');
  const list = points || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Pontos de levantamento</h1>
        <p className="mt-1 text-sm text-slate-500">Locais onde os clientes levantam as encomendas.</p>
      </div>

      {list.length === 0 ? (
        <EmptyState icon={MapPin} title="Sem pontos" description="Adiciona pontos de levantamento." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {list.map((p) => (
            <Card key={p.id} className="p-4">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-5 w-5 text-brand-blue" />
                <div>
                  <p className="font-medium text-brand-navy">{p.name}</p>
                  <p className="text-sm text-slate-500">{p.address}</p>
                  <p className="text-sm text-slate-500">{p.city}</p>
                  {p.phone && <p className="mt-1 text-xs text-slate-400">{p.phone}</p>}
                  {p.opening_hours && <p className="text-xs text-slate-400">{p.opening_hours}</p>}
                  <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${p.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                    {p.active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}