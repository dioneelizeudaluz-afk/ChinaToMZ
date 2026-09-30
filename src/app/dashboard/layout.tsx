import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_user_id', user.id)
    .single();

  let unreadCount = 0;
  if (profile) {
    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profile.id)
      .eq('read', false);
    unreadCount = count || 0;
  }

  return (
    <div className="min-h-screen bg-brand-light">
      <Header
        userEmail={user.email}
        userName={profile?.full_name}
        isAdmin={profile?.role === 'admin'}
        unreadCount={unreadCount}
      />
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        <DashboardSidebar />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}