import type { TemplateId } from '../types/resume';

/**
 * Templates removed in the 2026 overhaul (they repeated the same skeleton
 * in different colours) → the closest template that exists now. Saved
 * resumes, shared links and old clients may still carry these ids.
 */
const LEGACY_TEMPLATE_IDS: Record<string, TemplateId> = {
  sidebar: 'two-column-photo',
  minimal: 'zen',
  timeline: 'year-scale',
  executive: 'letterhead',
  consultant: 'deck',
  academic: 'harvard',
  functional: 'skill-radar',
  hybrid: 'card-grid',
  'swiss-minimal': 'magazine',
  'color-block': 'bauhaus',
  developer: 'ide',
  'sales-vibrant': 'gradient-header',
  startup: 'portfolio',
  healthcare: 'nordic',
  legal: 'letterhead',
  nonprofit: 'nordic',
  'photo-portrait': 'photo-card',
  'two-page': 'harvard',
  editorial: 'newspaper',
  'split-duo': 'ribbon-header',
  'badge-initials': 'monogram',
  'ribbon-corner': 'ribbon-header',
  'icon-rail': 'dark-sidebar',
  'radial-timeline': 'metro',
};

export function resolveTemplateId(id: string): TemplateId {
  return LEGACY_TEMPLATE_IDS[id] ?? (id as TemplateId);
}
