import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { AdminSidebar } from '@/components/layout/admin-sidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('auth_user_id', user.id).single();

  if (!profile || profile.role !== 'admin') redirect('/dashboard');

  return (
    <div className="min-h-screen bg-brand-light">
      <Header userEmail={user.email} userName={profile?.full_name} isAdmin />
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        <AdminSidebar />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}