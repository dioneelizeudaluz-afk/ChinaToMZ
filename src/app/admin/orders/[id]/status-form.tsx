'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { updateOrderStatusAction } from '@/services/admin.service';

const STATUSES = [
  { value: 'quote_requested', label: 'Cotação solicitada' },
  { value: 'quote_sent', label: 'Cotação enviada' },
  { value: 'awaiting_confirmation', label: 'Aguardando confirmação' },
  { value: 'confirmed', label: 'Pedido confirmado' },
  { value: 'purchased', label: 'Compra realizada' },
  { value: 'in_transit', label: 'Em transporte' },
  { value: 'arrived_mozambique', label: 'Chegou a Moçambique' },
  { value: 'ready_for_pickup', label: 'Pronto para levantamento' },
  { value: 'picked_up', label: 'Levantado' },
  { value: 'cancelled', label: 'Cancelado' },
];

function Submit() {
  const { pending } = useFormStatus();
  return <Button type="submit" loading={pending} className="w-full">Atualizar estado</Button>;
}

export default function AdminStatusForm({ orderId, currentStatus, currentTracking }: { orderId: string; currentStatus: string; currentTracking: string }) {
  const router = useRouter();
  const [state, action] = useActionState<any, FormData>(updateOrderStatusAction, null);

  useEffect(() => {
    if (state?.success) {
      toast.success('Estado atualizado!');
      router.refresh();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="order_id" value={orderId} />
      <div>
        <label className="label">Novo estado</label>
        <select name="status" className="input" defaultValue={currentStatus}>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
      <Input label="Código de tracking (opcional)" name="tracking_code" defaultValue={currentTracking} />
      <Textarea label="Nota (opcional)" name="note" placeholder="Motivo da alteração" />
      <Submit />
    </form>
  );
}