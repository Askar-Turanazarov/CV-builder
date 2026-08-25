import { z } from 'zod';

const personalInfoSchema = z.object({
  fullName: z.string(),
  jobTitle: z.string(),
  birthDate: z.string(),
  photo: z.string().nullable(),
});

const contactInfoSchema = z.object({
  email: z.string(),
  phone: z.string(),
  location: z.string(),
  website: z.string().optional(),
  linkedin: z.string().optional(),
  telegram: z.string().optional(),
  github: z.string().optional(),
});

const experienceEntrySchema = z.object({
  id: z.string(),
  company: z.string(),
  position: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  isCurrent: z.boolean(),
  location: z.string().optional(),
  description: z.string(),
});

const educationEntrySchema = z.object({
  id: z.string(),
  institution: z.string(),
  degree: z.string(),
  fieldOfStudy: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  description: z.string().optional(),
});

const skillEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]).optional(),
});

const languageEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'native']),
});

const aiGeneratedContentSchema = z.object({
  summary: z.string(),
  strengths: z.array(z.string()),
  generatedAt: z.string(),
  sourceHash: z.string(),
});

// A full snapshot of the client's ResumeData — deliberately not shared as a
// package with the client, mirrored here by hand (the same way
// generateResumeRequest.schema.ts only mirrors the subset it needs).
export const exportPdfRequestSchema = z.object({
  schemaVersion: z.number(),
  personalInfo: personalInfoSchema,
  contacts: contactInfoSchema,
  experience: z.array(experienceEntrySchema),
  education: z.array(educationEntrySchema),
  skills: z.array(skillEntrySchema),
  languages: z.array(languageEntrySchema),
  aiContent: aiGeneratedContentSchema.nullable(),
  selectedTemplateId: z.string().min(1),
  selectedThemeId: z.string().min(1),
  colorMode: z.enum(['light', 'dark']),
  viewMode: z.enum(['document', 'site']),
  uiLanguage: z.enum(['ru', 'en', 'uz']),
  uiDesignSystem: z.enum(['classic', 'glass']),
});

export type ExportPdfRequest = z.infer<typeof exportPdfRequestSchema>;
