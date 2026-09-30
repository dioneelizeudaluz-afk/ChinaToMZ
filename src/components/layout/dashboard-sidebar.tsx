'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Bell, User as UserIcon, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { href: '/dashboard', label: 'Visão geral', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/orders', label: 'Meus pedidos', icon: Package },
  { href: '/dashboard/quotes', label: 'Cotações', icon: FileText },
  { href: '/dashboard/notifications', label: 'Notificações', icon: Bell },
  { href: '/dashboard/profile', label: 'Perfil', icon: UserIcon },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-brand-muted bg-white lg:border-b-0 lg:border-r lg:min-h-[calc(100vh-3.5rem)] lg:w-64">
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