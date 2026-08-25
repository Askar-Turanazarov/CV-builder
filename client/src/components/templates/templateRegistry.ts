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

export interface TemplateDefinition {
  id: TemplateId;
  labelKey: string;
  component: ComponentType<ResumeTemplateProps>;
  category: 'popular' | 'unusual';
}

export const templateRegistry: TemplateDefinition[] = [
  { id: 'classic', labelKey: 'template.classic', component: ClassicTemplate, category: 'popular' },
  { id: 'sidebar', labelKey: 'template.sidebar', component: SidebarTemplate, category: 'popular' },
  { id: 'minimal', labelKey: 'template.minimal', component: MinimalTemplate, category: 'popular' },
  { id: 'timeline', labelKey: 'template.timeline', component: TimelineTemplate, category: 'popular' },
  { id: 'compact', labelKey: 'template.compact', component: CompactTemplate, category: 'popular' },
  { id: 'harvard', labelKey: 'template.harvard', component: HarvardTemplate, category: 'popular' },
  { id: 'executive', labelKey: 'template.executive', component: ExecutiveTemplate, category: 'popular' },
  { id: 'consultant', labelKey: 'template.consultant', component: ConsultantTemplate, category: 'popular' },
  { id: 'academic', labelKey: 'template.academic', component: AcademicTemplate, category: 'popular' },
  {
    id: 'two-column-photo',
    labelKey: 'template.twoColumnPhoto',
    component: TwoColumnPhotoTemplate,
    category: 'popular',
  },
  { id: 'dark-sidebar', labelKey: 'template.darkSidebar', component: DarkSidebarTemplate, category: 'popular' },
  { id: 'functional', labelKey: 'template.functional', component: FunctionalTemplate, category: 'popular' },
  { id: 'hybrid', labelKey: 'template.hybrid', component: HybridTemplate, category: 'popular' },
  {
    id: 'gradient-header',
    labelKey: 'template.gradientHeader',
    component: GradientHeaderTemplate,
    category: 'popular',
  },
  { id: 'swiss-minimal', labelKey: 'template.swissMinimal', component: SwissMinimalTemplate, category: 'popular' },
  { id: 'elegant-serif', labelKey: 'template.elegantSerif', component: ElegantSerifTemplate, category: 'popular' },
  { id: 'color-block', labelKey: 'template.colorBlock', component: ColorBlockTemplate, category: 'popular' },
  { id: 'developer', labelKey: 'template.developer', component: DeveloperTemplate, category: 'popular' },
  { id: 'sales-vibrant', labelKey: 'template.salesVibrant', component: SalesVibrantTemplate, category: 'popular' },
  { id: 'startup', labelKey: 'template.startup', component: StartupTemplate, category: 'popular' },
  { id: 'healthcare', labelKey: 'template.healthcare', component: HealthcareTemplate, category: 'popular' },
  { id: 'legal', labelKey: 'template.legal', component: LegalTemplate, category: 'popular' },
  { id: 'nonprofit', labelKey: 'template.nonprofit', component: NonprofitTemplate, category: 'popular' },
  {
    id: 'photo-portrait',
    labelKey: 'template.photoPortrait',
    component: PhotoPortraitTemplate,
    category: 'popular',
  },
  { id: 'two-page', labelKey: 'template.twoPage', component: TwoPageTemplate, category: 'popular' },
  { id: 'terminal', labelKey: 'template.terminal', component: TerminalTemplate, category: 'unusual' },
  { id: 'poster', labelKey: 'template.poster', component: PosterTemplate, category: 'unusual' },
  { id: 'editorial', labelKey: 'template.editorial', component: EditorialTemplate, category: 'unusual' },
  { id: 'ultra-card', labelKey: 'template.ultraCard', component: UltraCardTemplate, category: 'unusual' },
  { id: 'diagonal', labelKey: 'template.diagonal', component: DiagonalTemplate, category: 'unusual' },
  { id: 'split-duo', labelKey: 'template.splitDuo', component: SplitDuoTemplate, category: 'popular' },
  { id: 'badge-initials', labelKey: 'template.badgeInitials', component: BadgeInitialsTemplate, category: 'popular' },
  { id: 'card-grid', labelKey: 'template.cardGrid', component: CardGridTemplate, category: 'popular' },
  { id: 'ribbon-corner', labelKey: 'template.ribbonCorner', component: RibbonCornerTemplate, category: 'popular' },
  { id: 'icon-rail', labelKey: 'template.iconRail', component: IconRailTemplate, category: 'popular' },
  { id: 'ledger', labelKey: 'template.ledger', component: LedgerTemplate, category: 'popular' },
  {
    id: 'radial-timeline',
    labelKey: 'template.radialTimeline',
    component: RadialTimelineTemplate,
    category: 'unusual',
  },
  { id: 'scrapbook', labelKey: 'template.scrapbook', component: ScrapbookTemplate, category: 'unusual' },
  {
    id: 'dashboard-stats',
    labelKey: 'template.dashboardStats',
    component: DashboardStatsTemplate,
    category: 'unusual',
  },
  { id: 'blueprint', labelKey: 'template.blueprint', component: BlueprintTemplate, category: 'unusual' },
];

export function getTemplateComponent(id: TemplateId): ComponentType<ResumeTemplateProps> {
  return templateRegistry.find((definition) => definition.id === id)?.component ?? ClassicTemplate;
}
