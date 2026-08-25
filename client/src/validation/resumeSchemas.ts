import { z } from 'zod';

export const personalInfoSchema = z.object({
  fullName: z.string().trim().min(1, 'validation.required'),
  jobTitle: z.string().trim().min(1, 'validation.required'),
  birthDate: z.string().trim().min(1, 'validation.required'),
  photo: z.string().nullable(),
});
export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

export const contactsSchema = z.object({
  email: z.string().trim().email('validation.invalidEmail'),
  phone: z.string().trim().min(1, 'validation.required'),
  location: z.string().trim().min(1, 'validation.required'),
  website: z.string().trim().optional().or(z.literal('')),
  linkedin: z.string().trim().optional().or(z.literal('')),
  telegram: z.string().trim().optional().or(z.literal('')),
  github: z.string().trim().optional().or(z.literal('')),
});
export type ContactsFormValues = z.infer<typeof contactsSchema>;

const experienceEntrySchema = z.object({
  id: z.string(),
  company: z.string().trim().min(1, 'validation.required'),
  position: z.string().trim().min(1, 'validation.required'),
  startDate: z.string().trim().min(1, 'validation.required'),
  endDate: z.string().nullable(),
  isCurrent: z.boolean(),
  location: z.string().optional(),
  description: z.string().trim().min(1, 'validation.required'),
});

export const experienceStepSchema = z.object({
  experience: z.array(experienceEntrySchema),
});
export type ExperienceStepFormValues = z.infer<typeof experienceStepSchema>;

const educationEntrySchema = z.object({
  id: z.string(),
  institution: z.string().trim().min(1, 'validation.required'),
  degree: z.string().trim().min(1, 'validation.required'),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().trim().min(1, 'validation.required'),
  endDate: z.string().nullable(),
  description: z.string().optional(),
});

export const educationStepSchema = z.object({
  education: z.array(educationEntrySchema),
});
export type EducationStepFormValues = z.infer<typeof educationStepSchema>;

const skillEntrySchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, 'validation.required'),
  level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]).optional(),
});

export const skillsStepSchema = z.object({
  skills: z.array(skillEntrySchema).min(1, 'validation.required'),
});
export type SkillsStepFormValues = z.infer<typeof skillsStepSchema>;

const languageEntrySchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, 'validation.required'),
  level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'native']),
});

export const languagesStepSchema = z.object({
  languages: z.array(languageEntrySchema).min(1, 'validation.required'),
});
export type LanguagesStepFormValues = z.infer<typeof languagesStepSchema>;
