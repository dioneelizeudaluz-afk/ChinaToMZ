'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { registerAction, type ActionResult } from '@/services/auth.service';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" loading={pending}>
      Criar conta
    </Button>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    registerAction,
    null
  );

  useEffect(() => {
    if (state?.success && state.redirectTo) {
      toast.success('Conta criada com sucesso!');
      router.push(state.redirectTo);
      router.refresh();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-light p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold text-brand-navy">
            China<span className="text-brand-purple">ToMZ</span>
          </Link>
          <p className="mt-2 text-sm text-slate-500">
            Cria a tua conta para começar
          </p>
        </div>

        <div className="card p-6">
          <form action={formAction} className="space-y-4">
            <Input
              label="Nome completo"
              name="full_name"
              type="text"
              placeholder="O teu nome"
              required
              error={state?.fieldErrors?.full_name?.[0]}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="exemplo@email.com"
              required
              error={state?.fieldErrors?.email?.[0]}
            />

            <Input
              label="Telefone"
              name="phone"
              type="tel"
              placeholder="+258 84 000 0000"
              required
              error={state?.fieldErrors?.phone?.[0]}
            />

            <Input
              label="Cidade"
              name="city"
              type="text"
              placeholder="Maputo"
              required
              error={state?.fieldErrors?.city?.[0]}
            />

            <Input
              label="Palavra-passe"
              name="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              required
              hint="Mínimo 6 caracteres"
              error={state?.fieldErrors?.password?.[0]}
            />

            <SubmitButton />
          </form>

          <div className="mt-6 border-t border-brand-muted pt-4 text-center text-sm">
            <span className="text-slate-500">Já tens conta? </span>
            <Link href="/login" className="font-semibold text-brand-blue hover:underline">
              Entrar
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          <Link href="/" className="hover:text-brand-navy">
            ← Voltar à página inicial
          </Link>
        </p>
      </div>
    </div>
  );
}