import { z } from 'zod';

export const generateCoverLetterRequestSchema = z.object({
  uiLanguage: z.enum(['ru', 'en', 'uz']),
  fullName: z.string().trim().min(1),
  jobTitle: z.string().trim().default(''),
  targetRole: z.string().trim().default(''),
  targetCompany: z.string().trim().default(''),
  summary: z.string().default(''),
  strengths: z.array(z.string()).default([]),
  experience: z
    .array(
      z.object({
        position: z.string(),
        company: z.string(),
        description: z.string().optional().default(''),
      }),
    )
    .default([]),
  skills: z.array(z.string()).default([]),
});

export type GenerateCoverLetterRequest = z.infer<typeof generateCoverLetterRequestSchema>;
