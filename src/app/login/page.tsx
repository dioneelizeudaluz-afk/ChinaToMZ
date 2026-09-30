'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginAction, type ActionResult } from '@/services/auth.service';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" loading={pending}>
      Entrar
    </Button>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    loginAction,
    null
  );

  useEffect(() => {
    if (state?.success && state.redirectTo) {
      toast.success('Bem-vindo de volta!');
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
            Entra na tua conta para continuar
          </p>
        </div>

        <div className="card p-6">
          <form action={formAction} className="space-y-4">
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="exemplo@email.com"
              required
              error={state?.fieldErrors?.email?.[0]}
            />

            <Input
              label="Palavra-passe"
              name="password"
              type="password"
              placeholder="A tua palavra-passe"
              required
              error={state?.fieldErrors?.password?.[0]}
            />

            <SubmitButton />
          </form>

          <div className="mt-6 border-t border-brand-muted pt-4 text-center text-sm">
            <span className="text-slate-500">Ainda não tens conta? </span>
            <Link href="/register" className="font-semibold text-brand-blue hover:underline">
              Criar conta
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