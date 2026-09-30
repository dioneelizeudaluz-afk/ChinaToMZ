'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Users, Truck, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/orders', label: 'Pedidos', icon: Package },
  { href: '/admin/customers', label: 'Clientes', icon: Users },
  { href: '/admin/suppliers', label: 'Fornecedores', icon: Truck },
  { href: '/admin/pickup-points', label: 'Pontos de levantamento', icon: MapPin },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-brand-muted bg-white lg:border-b-0 lg:border-r lg:min-h-[calc(100vh-3.5rem)] lg:w-64">
      <div className="border-b border-brand-muted p-3">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-purple">Admin</p>
      </div>
      <nav className="flex gap-1 overflow-x-auto p-2 lg:flex-col lg:gap-0 lg:p-3">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-brand-light text-brand-navy'
                  : 'text-slate-600 hover:bg-brand-light hover:text-brand-navy'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}