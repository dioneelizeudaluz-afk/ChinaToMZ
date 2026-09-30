'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { registerSchema, loginSchema } from '@/schemas/auth';

export interface ActionResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  redirectTo?: string;
}

export async function registerAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    full_name: String(formData.get('full_name') || '').trim(),
    email: String(formData.get('email') || '').trim().toLowerCase(),
    phone: String(formData.get('phone') || '').trim(),
    city: String(formData.get('city') || '').trim(),
    password: String(formData.get('password') || ''),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Verifique os campos e tente novamente.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.full_name,
        phone: parsed.data.phone,
        city: parsed.data.city,
      },
    },
  });

  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes('already') || message.includes('registered')) {
      return { success: false, error: 'Este email já está registado.' };
    }
    return { success: false, error: 'Não foi possível criar a conta. Tente novamente.' };
  }

  return { success: true, redirectTo: '/dashboard' };
}

export async function loginAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    email: String(formData.get('email') || '').trim().toLowerCase(),
    password: String(formData.get('password') || ''),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Verifique os campos e tente novamente.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { success: false, error: 'Email ou palavra-passe incorretos.' };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Sessão inválida. Tente novamente.' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('auth_user_id', user.id)
    .single();

  if (profile?.role === 'admin') {
    return { success: true, redirectTo: '/admin' };
  }

  return { success: true, redirectTo: '/dashboard' };
}