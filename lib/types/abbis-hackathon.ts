import { z } from 'zod';

export const registrationSchema = z.object({
  teamName: z.string().min(2),
  isSolo: z.boolean(),
  trackFocus: z.enum([
    'Donor Management',
    'Collection & Processing',
    'Inventory Management',
    'Distribution & Logistics',
    'Hospital Transfusion Services',
    'Data, Analytics & AI',
  ]),
  leadName: z.string().min(2),
  leadEmail: z.string().email(),
  leadPhone: z.string().min(7),
  country: z.string().min(2),
  ageConfirmed: z.literal(true, { message: 'Must confirm you are 18-35' }),
  portfolioLink: z.string().url(),
  workHistory: z.string().min(10),
  members: z.array(z.object({
    name: z.string(),
    email: z.string().email(),
  })).max(3),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;