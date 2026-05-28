import { z } from 'zod'

export const createApplicantSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(30, 'First name too long'),
  lastName:  z.string().min(1, 'Last name is required').max(30, 'Last name too long'),
  email:     z.string().email('Invalid email address'),
  phoneNumber: z.string().optional(),
})

export const updateApplicantSchema = createApplicantSchema.partial()
