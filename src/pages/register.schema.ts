// Zod schema para registro
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
