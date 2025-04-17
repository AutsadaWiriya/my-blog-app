import { z } from 'zod';

export const signUpZod = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
  name: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
})

export const signInZod = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
})

export const updateUserZod = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters long' }).optional(),
  image: z.string().optional(),
})

export const managerPutZod = z.object({
  userId: z.string(),
  newRole: z.enum(['member', 'manager', 'admin']), 
})

export const managerDeleteZod = z.object({
  userId: z.string(),
})

export const createPostZod = z.object({
  content: z.string().min(1, { message: 'Content must be at least 1 characters long' }),
})