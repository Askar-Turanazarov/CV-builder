import type { ResumeData } from '../types/resume';

// A short, deliberately unambitious stopword list (ru + en) — good enough
// to filter out grammatical noise so frequency-based keyword extraction
// isn't dominated by "и"/"the"/"and" etc. Not a linguistics project.
const STOPWORDS = new Set([
  // ru
  'и', 'в', 'во', 'не', 'что', 'он', 'на', 'я', 'с', 'со', 'как', 'а', 'то', 'все', 'она', 'так', 'его', 'но', 'да',
  'ты', 'к', 'у', 'же', 'вы', 'за', 'бы', 'по', 'только', 'ее', 'мне', 'было', 'вот', 'от', 'меня', 'еще', 'нет', 'о',
  'из', 'ему', 'теперь', 'когда', 'даже', 'ну', 'вдруг', 'ли', 'если', 'уже', 'или', 'ни', 'быть', 'был', 'него',
  'до', 'вас', 'нибудь', 'опять', 'уж', 'вам', 'сказал', 'для', 'этого', 'чтобы', 'нас', 'про', 'этот', 'между',
  'должен', 'должна', 'должны', 'наш', 'ваш', 'также', 'либо', 'который', 'которая', 'которые',
  // en
  'the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'for', 'on', 'with', 'as', 'is', 'are', 'be', 'at', 'by', 'from',
  'this', 'that', 'you', 'we', 'our', 'your', 'will', 'have', 'has', 'their', 'it', 'who', 'which', 'must', 'should',
  'about', 'into', 'than', 'over', 'per', 'etc',
]);

const MIN_KEYWORD_LENGTH = 3;
const MAX_MISSING_KEYWORDS = 8;

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-zа-яё0-9+#.]+/i)
    .map((token) => token.trim())
    .filter((token) => token.length >= MIN_KEYWORD_LENGTH && !STOPWORDS.has(token) && !/^\d+$/.test(token));
}

function buildResumeTextBlob(data: ResumeData): string {
  return [
    data.personalInfo.jobTitle,
    ...data.skills.map((skill) => skill.name),
    ...data.experience.map((exp) => `${exp.position} ${exp.company} ${exp.description}`),
    ...data.education.map((edu) => `${edu.degree} ${edu.fieldOfStudy ?? ''} ${edu.description ?? ''}`),
    data.aiContent?.summary ?? '',
  ]
    .join(' ')
    .toLowerCase();
}

export interface JobMatchResult {
  percent: number;
  missingKeywords: string[];
}

/**
 * A plain word-overlap heuristic, NOT semantic ATS analysis — this is the
 * same level of sophistication as most free "keyword match" checkers.
 * Counts how many distinct, meaningful words from the pasted job
 * description already appear somewhere in the resume, and surfaces the
 * most frequent ones that don't.
 */
export function computeJobMatch(jobDescription: string, data: ResumeData): JobMatchResult | null {
  const jdTokens = tokenize(jobDescription);
  if (jdTokens.length === 0) return null;

  const frequency = new Map<string, number>();
  for (const token of jdTokens) {
    frequency.set(token, (frequency.get(token) ?? 0) + 1);
  }

  const resumeBlob = buildResumeTextBlob(data);
  const candidateKeywords = Array.from(frequency.keys());
  const present = candidateKeywords.filter((keyword) => resumeBlob.includes(keyword));
  const missing = candidateKeywords
    .filter((keyword) => !resumeBlob.includes(keyword))
    .sort((a, b) => (frequency.get(b) ?? 0) - (frequency.get(a) ?? 0))
    .slice(0, MAX_MISSING_KEYWORDS);

  const percent = candidateKeywords.length === 0 ? 0 : Math.round((present.length / candidateKeywords.length) * 100);

  return { percent, missingKeywords: missing };
}
