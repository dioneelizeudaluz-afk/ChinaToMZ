import { z } from 'zod';

export const registerSchema = z.object({
  full_name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100),
  email: z.string().email('Email inválido'),
  phone: z.string().min(9, 'Telefone inválido').max(20),
  city: z.string().min(2, 'Cidade obrigatória').max(100),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
});