'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { createOrderAction, type ActionResult } from '@/services/order.service';
import { createClient } from '@/lib/supabase/client';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" loading={pending}>
      Enviar pedido
    </Button>
  );
}

export default function NewOrderPage() {
  const router = useRouter();
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    createOrderAction,
    null
  );
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [pickupPoints, setPickupPoints] = useState<any[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('suppliers').select('*').eq('active', true).then(({ data }) => {
      setSuppliers(data || []);
    });
    supabase.from('pickup_points').select('*').eq('active', true).then(({ data }) => {
      setPickupPoints(data || []);
    });
  }, []);

  useEffect(() => {
    if (state?.success && state.orderId) {
      toast.success(`Pedido ${state.orderNumber} criado com sucesso!`);
      router.push(`/dashboard/orders/${state.orderId}`);
      router.refresh();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/dashboard/orders" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-navy">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-brand-navy">Novo pedido</h1>
        <p className="mt-1 text-sm text-slate-500">
          Cola o link do produto e nós fazemos a cotação.
        </p>
      </div>

      <div className="card p-6">
        <form action={formAction} className="space-y-4">
          <div>
            <label className="label">Fornecedor</label>
            <select name="supplier_id" className="input" required defaultValue={suppliers[0]?.id || ''}>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <Input
            label="Link do produto"
            name="product_url"
            type="url"
            placeholder="https://www.shein.com/..."
            required
          />

          <Input
            label="Nome do produto"
            name="product_name"
            type="text"
            placeholder="Vestido roxo curto"
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Categoria (opcional)" name="category" type="text" placeholder="Vestidos" />
            <Input label="Tamanho (opcional)" name="size" type="text" placeholder="M" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Cor (opcional)" name="color" type="text" placeholder="Roxo" />
            <Input label="Quantidade" name="quantity" type="number" min="1" defaultValue="1" required />
          </div>

          <Textarea
            label="Observações (opcional)"
            name="notes"
            placeholder="Alguma informação extra?"
          />

          <Input
            label="Cidade de entrega"
            name="city"
            type="text"
            placeholder="Maputo"
            required
          />

          <div>
            <label className="label">Ponto de levantamento</label>
            <select name="pickup_point_id" className="input" required>
              <option value="">Escolhe um ponto</option>
              {pickupPoints.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.city}
                </option>
              ))}
            </select>
          </div>

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}