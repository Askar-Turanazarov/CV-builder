import { z } from 'zod';

export const generateResumeRequestSchema = z.object({
  uiLanguage: z.enum(['ru', 'en', 'uz']),
  jobTitle: z.string().trim().min(1),
  experience: z
    .array(
      z.object({
        position: z.string(),
        company: z.string(),
        startDate: z.string(),
        endDate: z.string().nullable(),
        description: z.string().optional().default(''),
      }),
    )
    .default([]),
  education: z
    .array(
      z.object({
        institution: z.string(),
        degree: z.string(),
        fieldOfStudy: z.string().optional(),
      }),
    )
    .default([]),
  skills: z.array(z.string()).default([]),
  languages: z
    .array(
      z.object({
        name: z.string(),
        level: z.string(),
      }),
    )
    .default([]),
});

export type GenerateResumeRequest = z.infer<typeof generateResumeRequestSchema>;
