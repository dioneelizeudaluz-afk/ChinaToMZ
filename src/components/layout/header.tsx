'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User as UserIcon, Bell } from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface HeaderProps {
  userEmail?: string;
  userName?: string;
  isAdmin?: boolean;
  unreadCount?: number;
}

export function Header({ userEmail, userName, isAdmin, unreadCount = 0 }: HeaderProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-brand-muted bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/dashboard" className="text-lg font-bold text-brand-navy">
          China<span className="text-brand-purple">ToMZ</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/notifications"
            className="relative rounded-lg p-2 text-slate-600 hover:bg-brand-light"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-purple text-[10px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-brand-light"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue text-sm font-bold text-white">
                {(userName || userEmail || 'U').charAt(0).toUpperCase()}
              </div>
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-12 z-20 w-56 overflow-hidden rounded-lg border border-brand-muted bg-white shadow-lg">
                  <div className="border-b border-brand-muted px-4 py-3">
                    <p className="truncate text-sm font-semibold text-brand-navy">
                      {userName || 'Utilizador'}
                    </p>
                    <p className="truncate text-xs text-slate-500">{userEmail}</p>
                  </div>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-brand-navy hover:bg-brand-light"
                  >
                    <UserIcon className="h-4 w-4" />
                    Perfil
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-brand-purple hover:bg-brand-light"
                    >
                      Painel Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 border-t border-brand-muted px-4 py-2.5 text-sm text-red-600 hover:bg-brand-light"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}