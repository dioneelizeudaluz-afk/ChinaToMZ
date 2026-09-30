import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('auth_user_id', user.id).single();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Perfil</h1>
        <p className="mt-1 text-sm text-slate-500">Os teus dados de conta.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Informações</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div><p className="text-slate-500">Nome</p><p className="font-medium text-brand-navy">{profile?.full_name}</p></div>
          <div><p className="text-slate-500">Email</p><p className="font-medium text-brand-navy">{profile?.email}</p></div>
          {profile?.phone && <div><p className="text-slate-500">Telefone</p><p className="font-medium text-brand-navy">{profile.phone}</p></div>}
          {profile?.city && <div><p className="text-slate-500">Cidade</p><p className="font-medium text-brand-navy">{profile.city}</p></div>}
        </CardContent>
      </Card>
    </div>
  );
}