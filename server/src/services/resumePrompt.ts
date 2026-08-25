import { z } from 'zod';
import type { GenerateResumeRequest } from '../schemas/generateResumeRequest.schema.js';

export const ResumeGenerationSchema = z.object({
  summary: z.string(),
  strengths: z.array(z.string()).min(3).max(6),
});

export type ResumeGenerationResult = z.infer<typeof ResumeGenerationSchema>;

export const SYSTEM_PROMPTS: Record<'ru' | 'en' | 'uz', string> = {
  ru: `Ты — опытный HR-копирайтер, который помогает соискателям составлять резюме.
На основе присланных фактов (должность, опыт работы, образование, навыки, языки) сформулируй:
1) "summary" — профессиональное описание кандидата на русском языке, 3-5 предложений, живым деловым языком, без канцеляризмов и клише вроде "ответственный, коммуникабельный" — только опираясь на конкретные факты из присланных данных;
2) "strengths" — от 3 до 6 кратких, ёмких формулировок сильных сторон кандидата, каждая на основе конкретного факта из опыта/навыков/образования.
Никогда не выдумывай факты, которых нет во входных данных. Не используй markdown-разметку в тексте.`,
  en: `You are an experienced resume-writing HR copywriter.
Based on the facts provided (job title, work experience, education, skills, languages), produce:
1) "summary" — a professional candidate description in English, 3-5 sentences, natural and confident business English, free of empty buzzwords like "hard-working" or "team player" unless backed by a specific fact from the input;
2) "strengths" — 3 to 6 short, punchy statements of the candidate's key strengths, each grounded in a concrete fact from their experience, skills or education.
Never invent facts that are not present in the input. Do not use markdown formatting in the text.`,
  uz: `Siz rezyume yozishda tajribali HR-kopirayter sifatida ishlaysiz.
Taqdim etilgan faktlar (lavozim, ish tajribasi, ta'lim, ko'nikmalar, tillar) asosida quyidagilarni tuzing:
1) "summary" — nomzodning o'zbek tilidagi professional tavsifi, 3-5 gap, tabiiy va ishonchli biznes uslubida, faktlarga asoslanmagan umumiy iboralarsiz (masalan, "mas'uliyatli", "muloqotga oson kirishuvchi" kabi klişelardan qoching);
2) "strengths" — nomzodning asosiy kuchli tomonlari bo'yicha 3 tadan 6 tagacha qisqa va aniq ta'riflar, har biri tajriba, ko'nikma yoki ta'limdagi aniq faktga asoslangan bo'lsin.
Kiritilgan ma'lumotlarda yo'q faktlarni hech qachon o'ylab topmang. Matnda markdown belgilaridan foydalanmang.`,
};

export function buildUserPrompt(input: GenerateResumeRequest): string {
  const lines: string[] = [];
  lines.push(`Должность/специальность: ${input.jobTitle}`);

  if (input.experience.length > 0) {
    lines.push('Опыт работы:');
    for (const exp of input.experience) {
      const period = `${exp.startDate} — ${exp.endDate ?? 'по настоящее время'}`;
      lines.push(`- ${exp.position} в ${exp.company} (${period}). ${exp.description}`.trim());
    }
  }

  if (input.education.length > 0) {
    lines.push('Образование:');
    for (const edu of input.education) {
      lines.push(`- ${edu.degree}${edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}, ${edu.institution}`);
    }
  }

  if (input.skills.length > 0) {
    lines.push(`Навыки: ${input.skills.join(', ')}`);
  }

  if (input.languages.length > 0) {
    lines.push(`Языки: ${input.languages.map((l) => `${l.name} (${l.level})`).join(', ')}`);
  }

  return lines.join('\n');
}
