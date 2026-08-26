import { z } from 'zod';
import { Type } from '@google/genai';
import type { GenerateCoverLetterRequest } from '../schemas/generateCoverLetterRequest.schema.js';
import type { AiTaskSpec } from './providers/aiProvider.types.js';

export const CoverLetterGenerationSchema = z.object({
  content: z.string(),
});

export type CoverLetterGenerationResult = z.infer<typeof CoverLetterGenerationSchema>;

export const COVER_LETTER_TASK: AiTaskSpec<CoverLetterGenerationResult> = {
  toolName: 'submit_cover_letter',
  toolDescription: 'Отправить готовый текст сопроводительного письма.',
  anthropicInputSchema: {
    properties: {
      content: {
        type: 'string' as const,
        description: 'Полный текст сопроводительного письма, готовый к отправке работодателю.',
      },
    },
    required: ['content'],
  },
  geminiResponseSchema: {
    type: Type.OBJECT,
    properties: {
      content: { type: Type.STRING },
    },
    required: ['content'],
  },
  resultSchema: CoverLetterGenerationSchema,
};

export const SYSTEM_PROMPTS: Record<'ru' | 'en' | 'uz', string> = {
  ru: `Ты — опытный карьерный консультант, который пишет сопроводительные письма к резюме.
На основе присланных фактов о кандидате (должность, опыт, сильные стороны, навыки) и, если указана, целевой роли/компании, напиши "content" — цельный текст сопроводительного письма на русском языке (4-6 абзацев, деловой, но живой тон, без канцеляризмов и клише вроде "коммуникабельный, ответственный").
Структура: приветствие и повод обращения → почему кандидат подходит именно на эту роль, опираясь на конкретные факты → 1-2 конкретных достижения из опыта → вежливое завершение с готовностью к собеседованию.
Если целевая роль/компания не указаны, пиши универсальное письмо под указанную должность кандидата.
Никогда не выдумывай факты, которых нет во входных данных. Не используй markdown-разметку — только обычный текст с переносами строк между абзацами.`,
  en: `You are an experienced career consultant who writes cover letters.
Based on the candidate's facts provided (job title, experience, strengths, skills) and, if given, a target role/company, write "content" — a complete cover letter in English (4-6 paragraphs, professional yet natural tone, free of empty buzzwords like "hard-working" or "team player").
Structure: greeting and reason for writing → why the candidate fits this specific role, grounded in concrete facts → 1-2 specific achievements from their experience → a polite closing expressing readiness for an interview.
If no target role/company is given, write a general letter suited to the candidate's stated job title.
Never invent facts not present in the input. Do not use markdown formatting — plain text with blank lines between paragraphs only.`,
  uz: `Siz kuzatuv xatlarini (cover letter) yozadigan tajribali karyera maslahatchisisiz.
Taqdim etilgan nomzod faktlari (lavozim, tajriba, kuchli tomonlar, ko'nikmalar) va, agar ko'rsatilgan bo'lsa, maqsadli lavozim/kompaniya asosida "content" — o'zbek tilida to'liq kuzatuv xati matnini yozing (4-6 abzats, ishbilarmonlik, ammo tabiiy ohangda, "mas'uliyatli", "muloqotga oson kirishuvchi" kabi klişelarsiz).
Tuzilma: salomlashuv va murojaat sababi → nomzod aynan shu lavozimga nega mos kelishi, aniq faktlarga asoslanib → tajribadan 1-2 ta aniq yutuq → suhbatga tayyorligini bildiruvchi xushmuomala yakun.
Agar maqsadli lavozim/kompaniya ko'rsatilmagan bo'lsa, nomzodning ko'rsatilgan lavozimiga mos umumiy xat yozing.
Kiritilgan ma'lumotlarda yo'q faktlarni hech qachon o'ylab topmang. Markdown belgilaridan foydalanmang — faqat abzatslar orasida bo'sh qator bilan oddiy matn.`,
};

export function buildUserPrompt(input: GenerateCoverLetterRequest): string {
  const lines: string[] = [];
  lines.push(`Имя кандидата: ${input.fullName}`);
  lines.push(`Текущая должность/специальность: ${input.jobTitle}`);

  if (input.targetRole) {
    lines.push(`Целевая роль: ${input.targetRole}`);
  }
  if (input.targetCompany) {
    lines.push(`Целевая компания: ${input.targetCompany}`);
  }
  if (input.summary) {
    lines.push(`Профессиональное описание: ${input.summary}`);
  }
  if (input.strengths.length > 0) {
    lines.push(`Сильные стороны: ${input.strengths.join('; ')}`);
  }
  if (input.experience.length > 0) {
    lines.push('Опыт работы:');
    for (const exp of input.experience) {
      lines.push(`- ${exp.position} в ${exp.company}. ${exp.description}`.trim());
    }
  }
  if (input.skills.length > 0) {
    lines.push(`Навыки: ${input.skills.join(', ')}`);
  }

  return lines.join('\n');
}
