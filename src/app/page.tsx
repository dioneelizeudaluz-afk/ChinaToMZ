import Link from 'next/link';
import {
  PackageSearch,
  Send,
  Receipt,
  CheckCircle2,
  Truck,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const steps = [
  { icon: PackageSearch, title: 'Escolhe', description: 'Encontra o produto que queres na SHEIN.' },
  { icon: Send, title: 'Envia', description: 'Manda o link para a ChinaToMZ.' },
  { icon: Receipt, title: 'Recebe a cotação', description: 'A nossa equipa calcula o custo da operação.' },
  { icon: CheckCircle2, title: 'Confirma', description: 'Aceita a cotação.' },
  { icon: Truck, title: 'Nós cuidamos do processo', description: 'Tratamos da importação.' },
  { icon: MapPin, title: 'Levanta', description: 'Recebes uma notificação quando a encomenda estiver pronta.' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 border-b border-brand-muted bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="text-xl font-bold text-brand-navy">
            China<span className="text-brand-purple">ToMZ</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Começar</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="border-b border-brand-muted bg-gradient-to-b from-brand-light to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center lg:py-24">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-brand-muted bg-white px-3 py-1 text-xs font-medium text-slate-600">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            Importação ativa
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-brand-navy lg:text-6xl">
            Da China para Moçambique,
            <br />
            <span className="text-brand-blue">sem complicação.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-600 lg:text-lg">
            Tu escolhes o produto. Nós cuidamos da importação, do pagamento ao levantamento em Moçambique.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                Pedir uma cotação
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Acompanhar pedido
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 lg:py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-brand-navy lg:text-4xl">Como funciona</h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-slate-500">
            Seis passos simples até teres o teu produto em mãos.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-brand-light">
                  <Icon className="h-5 w-5 text-brand-blue" />
                </div>
                <div className="mb-1 text-xs font-bold text-brand-purple">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className="text-base font-semibold text-brand-navy">{step.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{step.description}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="border-t border-brand-muted bg-brand-navy">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h2 className="text-3xl font-bold text-white lg:text-4xl">Pronto para começar?</h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-300">
            Cria a tua conta gratuitamente e envia o teu primeiro pedido em menos de 2 minutos.
          </p>
          <div className="mt-8">
            <Link href="/register">
              <Button size="lg">
                Criar conta gratuita
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-brand-muted bg-white py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-slate-500">
          <p>
            <span className="font-semibold text-brand-navy">China<span className="text-brand-purple">ToMZ</span></span>
            {' '}· Da China para Moçambique, sem complicação.
          </p>
          <p className="mt-2 text-xs text-slate-400">
            A ChinaToMZ não é representante oficial de nenhum fornecedor.
          </p>
        </div>
      </footer>
    </div>
  );
}