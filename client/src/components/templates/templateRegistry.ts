import type { ComponentType } from 'react';
import type { ResumeTemplateProps, TemplateId } from '../../types/resume';
import ClassicTemplate from './ClassicTemplate';
import SidebarTemplate from './SidebarTemplate';
import MinimalTemplate from './MinimalTemplate';
import TimelineTemplate from './TimelineTemplate';
import CompactTemplate from './CompactTemplate';
import HarvardTemplate from './HarvardTemplate';
import ExecutiveTemplate from './ExecutiveTemplate';
import ConsultantTemplate from './ConsultantTemplate';
import AcademicTemplate from './AcademicTemplate';
import TwoColumnPhotoTemplate from './TwoColumnPhotoTemplate';
import DarkSidebarTemplate from './DarkSidebarTemplate';
import FunctionalTemplate from './FunctionalTemplate';
import HybridTemplate from './HybridTemplate';
import GradientHeaderTemplate from './GradientHeaderTemplate';
import SwissMinimalTemplate from './SwissMinimalTemplate';
import ElegantSerifTemplate from './ElegantSerifTemplate';
import ColorBlockTemplate from './ColorBlockTemplate';
import DeveloperTemplate from './DeveloperTemplate';
import SalesVibrantTemplate from './SalesVibrantTemplate';
import StartupTemplate from './StartupTemplate';
import HealthcareTemplate from './HealthcareTemplate';
import LegalTemplate from './LegalTemplate';
import NonprofitTemplate from './NonprofitTemplate';
import PhotoPortraitTemplate from './PhotoPortraitTemplate';
import TwoPageTemplate from './TwoPageTemplate';
import TerminalTemplate from './TerminalTemplate';
import PosterTemplate from './PosterTemplate';
import EditorialTemplate from './EditorialTemplate';
import UltraCardTemplate from './UltraCardTemplate';
import DiagonalTemplate from './DiagonalTemplate';
import SplitDuoTemplate from './SplitDuoTemplate';
import BadgeInitialsTemplate from './BadgeInitialsTemplate';
import CardGridTemplate from './CardGridTemplate';
import RibbonCornerTemplate from './RibbonCornerTemplate';
import IconRailTemplate from './IconRailTemplate';
import LedgerTemplate from './LedgerTemplate';
import RadialTimelineTemplate from './RadialTimelineTemplate';
import ScrapbookTemplate from './ScrapbookTemplate';
import DashboardStatsTemplate from './DashboardStatsTemplate';
import BlueprintTemplate from './BlueprintTemplate';

// Broad, informal "who tends to reach for this template" tags — used only
// to power the Preview page's lightweight "templates for your role"
// suggestion (see lib/resumeInsights.ts). Not a strict taxonomy, and a
// template can carry more than one; `universal` templates simply don't
// surface in that suggestion (nothing wrong with them, they just don't
// signal a specific industry).
export type TemplateAudience =
  | 'universal'
  | 'tech'
  | 'creative'
  | 'corporate'
  | 'finance'
  | 'legal'
  | 'healthcare'
  | 'academia'
  | 'sales-marketing'
  | 'startup'
  | 'nonprofit';

export interface TemplateDefinition {
  id: TemplateId;
  labelKey: string;
  component: ComponentType<ResumeTemplateProps>;
  category: 'popular' | 'unusual';
  audience: TemplateAudience[];
}

export const templateRegistry: TemplateDefinition[] = [
  { id: 'classic', labelKey: 'template.classic', component: ClassicTemplate, category: 'popular', audience: ['universal'] },
  { id: 'sidebar', labelKey: 'template.sidebar', component: SidebarTemplate, category: 'popular', audience: ['universal'] },
  { id: 'minimal', labelKey: 'template.minimal', component: MinimalTemplate, category: 'popular', audience: ['universal', 'creative'] },
  { id: 'timeline', labelKey: 'template.timeline', component: TimelineTemplate, category: 'popular', audience: ['universal'] },
  { id: 'compact', labelKey: 'template.compact', component: CompactTemplate, category: 'popular', audience: ['universal'] },
  { id: 'harvard', labelKey: 'template.harvard', component: HarvardTemplate, category: 'popular', audience: ['corporate', 'academia', 'legal', 'finance'] },
  { id: 'executive', labelKey: 'template.executive', component: ExecutiveTemplate, category: 'popular', audience: ['corporate'] },
  { id: 'consultant', labelKey: 'template.consultant', component: ConsultantTemplate, category: 'popular', audience: ['corporate', 'finance'] },
  { id: 'academic', labelKey: 'template.academic', component: AcademicTemplate, category: 'popular', audience: ['academia'] },
  {
    id: 'two-column-photo',
    labelKey: 'template.twoColumnPhoto',
    component: TwoColumnPhotoTemplate,
    category: 'popular',
    audience: ['universal'],
  },
  { id: 'dark-sidebar', labelKey: 'template.darkSidebar', component: DarkSidebarTemplate, category: 'popular', audience: ['tech', 'creative'] },
  { id: 'functional', labelKey: 'template.functional', component: FunctionalTemplate, category: 'popular', audience: ['universal'] },
  { id: 'hybrid', labelKey: 'template.hybrid', component: HybridTemplate, category: 'popular', audience: ['universal'] },
  {
    id: 'gradient-header',
    labelKey: 'template.gradientHeader',
    component: GradientHeaderTemplate,
    category: 'popular',
    audience: ['creative', 'sales-marketing', 'startup'],
  },
  { id: 'swiss-minimal', labelKey: 'template.swissMinimal', component: SwissMinimalTemplate, category: 'popular', audience: ['creative'] },
  { id: 'elegant-serif', labelKey: 'template.elegantSerif', component: ElegantSerifTemplate, category: 'popular', audience: ['universal', 'academia'] },
  { id: 'color-block', labelKey: 'template.colorBlock', component: ColorBlockTemplate, category: 'popular', audience: ['creative', 'sales-marketing'] },
  { id: 'developer', labelKey: 'template.developer', component: DeveloperTemplate, category: 'popular', audience: ['tech'] },
  { id: 'sales-vibrant', labelKey: 'template.salesVibrant', component: SalesVibrantTemplate, category: 'popular', audience: ['sales-marketing'] },
  { id: 'startup', labelKey: 'template.startup', component: StartupTemplate, category: 'popular', audience: ['startup', 'tech'] },
  { id: 'healthcare', labelKey: 'template.healthcare', component: HealthcareTemplate, category: 'popular', audience: ['healthcare'] },
  { id: 'legal', labelKey: 'template.legal', component: LegalTemplate, category: 'popular', audience: ['legal'] },
  { id: 'nonprofit', labelKey: 'template.nonprofit', component: NonprofitTemplate, category: 'popular', audience: ['nonprofit'] },
  {
    id: 'photo-portrait',
    labelKey: 'template.photoPortrait',
    component: PhotoPortraitTemplate,
    category: 'popular',
    audience: ['creative'],
  },
  { id: 'two-page', labelKey: 'template.twoPage', component: TwoPageTemplate, category: 'popular', audience: ['corporate', 'academia'] },
  { id: 'terminal', labelKey: 'template.terminal', component: TerminalTemplate, category: 'unusual', audience: ['tech'] },
  { id: 'poster', labelKey: 'template.poster', component: PosterTemplate, category: 'unusual', audience: ['creative'] },
  { id: 'editorial', labelKey: 'template.editorial', component: EditorialTemplate, category: 'unusual', audience: ['creative', 'sales-marketing'] },
  { id: 'ultra-card', labelKey: 'template.ultraCard', component: UltraCardTemplate, category: 'unusual', audience: ['universal', 'startup'] },
  { id: 'diagonal', labelKey: 'template.diagonal', component: DiagonalTemplate, category: 'unusual', audience: ['creative'] },
  { id: 'split-duo', labelKey: 'template.splitDuo', component: SplitDuoTemplate, category: 'popular', audience: ['creative', 'startup'] },
  { id: 'badge-initials', labelKey: 'template.badgeInitials', component: BadgeInitialsTemplate, category: 'popular', audience: ['universal', 'corporate'] },
  { id: 'card-grid', labelKey: 'template.cardGrid', component: CardGridTemplate, category: 'popular', audience: ['tech', 'startup'] },
  { id: 'ribbon-corner', labelKey: 'template.ribbonCorner', component: RibbonCornerTemplate, category: 'popular', audience: ['creative', 'sales-marketing'] },
  { id: 'icon-rail', labelKey: 'template.iconRail', component: IconRailTemplate, category: 'popular', audience: ['tech', 'startup'] },
  { id: 'ledger', labelKey: 'template.ledger', component: LedgerTemplate, category: 'popular', audience: ['finance'] },
  {
    id: 'radial-timeline',
    labelKey: 'template.radialTimeline',
    component: RadialTimelineTemplate,
    category: 'unusual',
    audience: ['creative'],
  },
  { id: 'scrapbook', labelKey: 'template.scrapbook', component: ScrapbookTemplate, category: 'unusual', audience: ['creative', 'academia'] },
  {
    id: 'dashboard-stats',
    labelKey: 'template.dashboardStats',
    component: DashboardStatsTemplate,
    category: 'unusual',
    audience: ['tech', 'finance'],
  },
  { id: 'blueprint', labelKey: 'template.blueprint', component: BlueprintTemplate, category: 'unusual', audience: ['tech'] },
];

export function getTemplateComponent(id: TemplateId): ComponentType<ResumeTemplateProps> {
  return templateRegistry.find((definition) => definition.id === id)?.component ?? ClassicTemplate;
}
