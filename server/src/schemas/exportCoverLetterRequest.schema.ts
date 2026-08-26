import { z } from 'zod';

// A hand-mirrored subset of the client's ResumeData, the same convention
// exportPdfRequest.schema.ts already uses — just what the letter layout needs.
export const exportCoverLetterRequestSchema = z.object({
  fullName: z.string(),
  email: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  location: z.string().optional().default(''),
  content: z.string().min(1),
  targetRole: z.string().optional().default(''),
  targetCompany: z.string().optional().default(''),
  selectedThemeId: z.string().min(1),
  colorMode: z.enum(['light', 'dark']),
  uiLanguage: z.enum(['ru', 'en', 'uz']),
});

export type ExportCoverLetterRequest = z.infer<typeof exportCoverLetterRequestSchema>;
