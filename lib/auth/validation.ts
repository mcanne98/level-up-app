import { z } from 'zod'
import { AVATAR_ANIMALS } from './usernames'

export const ParentSignupSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName:  z.string().min(1, 'Last name is required').max(50),
  email:     z.string().email('Please enter a valid email address'),
})

export const VerifyTokenSchema = z.object({
  email: z.string().email(),
  token: z.string().length(6, 'Token must be 6 digits').regex(/^\d{6}$/, 'Token must be numeric'),
})

export const RequestTokenSchema = z.object({
  email: z.string().email(),
})

export const CreateChildSchema = z.object({
  firstName:       z.string().min(1, 'First name is required').max(50),
  avatarAnimal:    z.enum(AVATAR_ANIMALS),
  age:             z.number().int().min(4).max(18),
  grade:           z.number().int().min(1).max(12),
  password:        z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const GenerateUsernameSchema = z.object({
  firstName:    z.string().min(1).max(50),
  avatarAnimal: z.enum(AVATAR_ANIMALS),
})

export const ChildLoginSchema = z.object({
  username: z.string().min(1, 'Username is required').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
})

export type ParentSignupInput    = z.infer<typeof ParentSignupSchema>
export type VerifyTokenInput     = z.infer<typeof VerifyTokenSchema>
export type CreateChildInput     = z.infer<typeof CreateChildSchema>
export type GenerateUsernameInput = z.infer<typeof GenerateUsernameSchema>
export type ChildLoginInput      = z.infer<typeof ChildLoginSchema>
