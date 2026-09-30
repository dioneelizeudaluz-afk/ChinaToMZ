'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { acceptQuoteAction, rejectQuoteAction } from '@/services/order.service';

export default function QuoteActions({ quoteId }: { quoteId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<'accept' | 'reject' | null>(null);

  const handleAccept = async () => {
    setLoading('accept');
    const res = await acceptQuoteAction(quoteId);
    setLoading(null);
    if (res.success) {
      toast.success('Cotação aceite!');
      router.refresh();
    } else {
      toast.error(res.error || 'Erro');
    }
  };

  const handleReject = async () => {
    if (!confirm('Tens a certeza que queres recusar?')) return;
    setLoading('reject');
    const res = await rejectQuoteAction(quoteId);
    setLoading(null);
    if (res.success) {
      toast.success('Cotação recusada');
      router.refresh();
    } else {
      toast.error(res.error || 'Erro');
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
      <Button onClick={handleAccept} loading={loading === 'accept'} className="flex-1">
        <Check className="h-4 w-4" />
        Aceitar cotação
      </Button>
      <Button variant="secondary" onClick={handleReject} loading={loading === 'reject'} className="flex-1">
        <X className="h-4 w-4" />
        Recusar
      </Button>
    </div>
  );
}