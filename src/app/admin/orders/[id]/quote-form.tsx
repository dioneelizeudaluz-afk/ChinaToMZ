'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { createQuoteAction } from '@/services/admin.service';

function Submit() {
  const { pending } = useFormStatus();
  return <Button type="submit" loading={pending} className="w-full">Enviar cotação ao cliente</Button>;
}

export default function AdminQuoteForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [state, action] = useActionState<any, FormData>(createQuoteAction, null);

  useEffect(() => {
    if (state?.success) {
      toast.success('Cotação enviada!');
      router.refresh();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="order_id" value={orderId} />
      <Input label="Preço do produto (MT)" name="product_price" type="number" step="0.01" min="0" defaultValue="0" required />
      <Input label="Custo de transporte (MT)" name="shipping_cost" type="number" step="0.01" min="0" defaultValue="0" required />
      <Input label="Taxas/encargos (MT)" name="taxes" type="number" step="0.01" min="0" defaultValue="0" required />
      <Input label="Serviço ChinaToMZ (MT)" name="service_fee" type="number" step="0.01" min="0" defaultValue="0" required />
      <Input label="Outros custos (MT)" name="other_costs" type="number" step="0.01" min="0" defaultValue="0" required />
      <Textarea label="Notas internas (opcional)" name="admin_notes" />
      <Submit />
    </form>
  );
}