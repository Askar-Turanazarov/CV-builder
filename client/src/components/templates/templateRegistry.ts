import type { ComponentType } from 'react';
import type { ResumeTemplateProps, TemplateId } from '../../types/resume';
import { resolveTemplateId } from '../../data/legacyTemplates';
import ClassicTemplate from './ClassicTemplate';
import HarvardTemplate from './HarvardTemplate';
import CompactTemplate from './CompactTemplate';
import TwoColumnPhotoTemplate from './TwoColumnPhotoTemplate';
import DarkSidebarTemplate from './DarkSidebarTemplate';
import GradientHeaderTemplate from './GradientHeaderTemplate';
import ElegantSerifTemplate from './ElegantSerifTemplate';
import CardGridTemplate from './CardGridTemplate';
import LedgerTemplate from './LedgerTemplate';
import MagazineTemplate from './MagazineTemplate';
import MonogramTemplate from './MonogramTemplate';
import YearScaleTemplate from './YearScaleTemplate';
import PhotoCardTemplate from './PhotoCardTemplate';
import BauhausTemplate from './BauhausTemplate';
import ZenTemplate from './ZenTemplate';
import SkillRadarTemplate from './SkillRadarTemplate';
import RibbonHeaderTemplate from './RibbonHeaderTemplate';
import PortfolioTemplate from './PortfolioTemplate';
import LetterheadTemplate from './LetterheadTemplate';
import NordicTemplate from './NordicTemplate';
import MarginaliaTemplate from './MarginaliaTemplate';
import TypewriterTemplate from './TypewriterTemplate';
import DeckTemplate from './DeckTemplate';
import ZigzagTemplate from './ZigzagTemplate';
import TerminalTemplate from './TerminalTemplate';
import PosterTemplate from './PosterTemplate';
import UltraCardTemplate from './UltraCardTemplate';
import DiagonalTemplate from './DiagonalTemplate';
import ScrapbookTemplate from './ScrapbookTemplate';
import DashboardStatsTemplate from './DashboardStatsTemplate';
import BlueprintTemplate from './BlueprintTemplate';
import MetroTemplate from './MetroTemplate';
import IdeTemplate from './IdeTemplate';
import NewspaperTemplate from './NewspaperTemplate';
import BoardingPassTemplate from './BoardingPassTemplate';
import ChatTemplate from './ChatTemplate';
import MenuTemplate from './MenuTemplate';
import StarMapTemplate from './StarMapTemplate';
import BrutalTemplate from './BrutalTemplate';
import RisoTemplate from './RisoTemplate';
import SpineTemplate from './SpineTemplate';
import OutlineTemplate from './OutlineTemplate';
import BentoTemplate from './BentoTemplate';
import EncyclopediaTemplate from './EncyclopediaTemplate';
import NutritionTemplate from './NutritionTemplate';
import AlbumTemplate from './AlbumTemplate';
import PeriodicTemplate from './PeriodicTemplate';
import CharacterSheetTemplate from './CharacterSheetTemplate';

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

/**
 * popular — distinct everyday layouts; unusual — bold looks that still read
 * as a resume; concept — the whole resume told as another object (metro
 * map, code editor, newspaper, ticket…).
 */
export type TemplateCategory = 'popular' | 'unusual' | 'concept';

export interface TemplateDefinition {
  id: TemplateId;
  labelKey: string;
  component: ComponentType<ResumeTemplateProps>;
  category: TemplateCategory;
  audience: TemplateAudience[];
}

export const templateRegistry: TemplateDefinition[] = [
  {
    id: 'classic',
    labelKey: 'template.classic',
    component: ClassicTemplate,
    category: 'popular',
    audience: ['universal'],
  },
  {
    id: 'harvard',
    labelKey: 'template.harvard',
    component: HarvardTemplate,
    category: 'popular',
    audience: ['corporate', 'academia', 'legal', 'finance'],
  },
  {
    id: 'compact',
    labelKey: 'template.compact',
    component: CompactTemplate,
    category: 'popular',
    audience: ['universal'],
  },
  {
    id: 'two-column-photo',
    labelKey: 'template.twoColumnPhoto',
    component: TwoColumnPhotoTemplate,
    category: 'popular',
    audience: ['universal', 'healthcare'],
  },
  {
    id: 'dark-sidebar',
    labelKey: 'template.darkSidebar',
    component: DarkSidebarTemplate,
    category: 'popular',
    audience: ['tech', 'creative'],
  },
  {
    id: 'gradient-header',
    labelKey: 'template.gradientHeader',
    component: GradientHeaderTemplate,
    category: 'popular',
    audience: ['creative', 'sales-marketing', 'startup'],
  },
  {
    id: 'elegant-serif',
    labelKey: 'template.elegantSerif',
    component: ElegantSerifTemplate,
    category: 'popular',
    audience: ['universal', 'academia', 'legal'],
  },
  {
    id: 'card-grid',
    labelKey: 'template.cardGrid',
    component: CardGridTemplate,
    category: 'popular',
    audience: ['tech', 'startup'],
  },
  {
    id: 'ledger',
    labelKey: 'template.ledger',
    component: LedgerTemplate,
    category: 'popular',
    audience: ['finance'],
  },
  {
    id: 'magazine',
    labelKey: 'template.magazine',
    component: MagazineTemplate,
    category: 'popular',
    audience: ['creative', 'sales-marketing'],
  },
  {
    id: 'monogram',
    labelKey: 'template.monogram',
    component: MonogramTemplate,
    category: 'popular',
    audience: ['corporate', 'creative'],
  },
  {
    id: 'year-scale',
    labelKey: 'template.yearScale',
    component: YearScaleTemplate,
    category: 'popular',
    audience: ['universal'],
  },
  {
    id: 'photo-card',
    labelKey: 'template.photoCard',
    component: PhotoCardTemplate,
    category: 'popular',
    audience: ['creative', 'healthcare'],
  },
  {
    id: 'bauhaus',
    labelKey: 'template.bauhaus',
    component: BauhausTemplate,
    category: 'popular',
    audience: ['creative'],
  },
  {
    id: 'zen',
    labelKey: 'template.zen',
    component: ZenTemplate,
    category: 'popular',
    audience: ['universal', 'creative'],
  },
  {
    id: 'skill-radar',
    labelKey: 'template.skillRadar',
    component: SkillRadarTemplate,
    category: 'popular',
    audience: ['tech', 'universal'],
  },
  {
    id: 'ribbon-header',
    labelKey: 'template.ribbonHeader',
    component: RibbonHeaderTemplate,
    category: 'popular',
    audience: ['sales-marketing', 'universal'],
  },
  {
    id: 'portfolio',
    labelKey: 'template.portfolio',
    component: PortfolioTemplate,
    category: 'popular',
    audience: ['creative', 'startup'],
  },
  {
    id: 'letterhead',
    labelKey: 'template.letterhead',
    component: LetterheadTemplate,
    category: 'popular',
    audience: ['corporate', 'legal', 'finance'],
  },
  {
    id: 'nordic',
    labelKey: 'template.nordic',
    component: NordicTemplate,
    category: 'popular',
    audience: ['healthcare', 'nonprofit'],
  },
  {
    id: 'marginalia',
    labelKey: 'template.marginalia',
    component: MarginaliaTemplate,
    category: 'popular',
    audience: ['academia', 'creative'],
  },
  {
    id: 'typewriter',
    labelKey: 'template.typewriter',
    component: TypewriterTemplate,
    category: 'popular',
    audience: ['creative', 'academia'],
  },
  {
    id: 'deck',
    labelKey: 'template.deck',
    component: DeckTemplate,
    category: 'popular',
    audience: ['corporate', 'sales-marketing', 'startup'],
  },
  {
    id: 'zigzag',
    labelKey: 'template.zigzag',
    component: ZigzagTemplate,
    category: 'popular',
    audience: ['universal', 'nonprofit'],
  },
  {
    id: 'terminal',
    labelKey: 'template.terminal',
    component: TerminalTemplate,
    category: 'unusual',
    audience: ['tech'],
  },
  {
    id: 'poster',
    labelKey: 'template.poster',
    component: PosterTemplate,
    category: 'unusual',
    audience: ['creative'],
  },
  {
    id: 'ultra-card',
    labelKey: 'template.ultraCard',
    component: UltraCardTemplate,
    category: 'unusual',
    audience: ['universal', 'startup'],
  },
  {
    id: 'diagonal',
    labelKey: 'template.diagonal',
    component: DiagonalTemplate,
    category: 'unusual',
    audience: ['creative'],
  },
  {
    id: 'scrapbook',
    labelKey: 'template.scrapbook',
    component: ScrapbookTemplate,
    category: 'unusual',
    audience: ['creative', 'academia'],
  },
  {
    id: 'dashboard-stats',
    labelKey: 'template.dashboardStats',
    component: DashboardStatsTemplate,
    category: 'unusual',
    audience: ['tech', 'finance', 'sales-marketing'],
  },
  {
    id: 'blueprint',
    labelKey: 'template.blueprint',
    component: BlueprintTemplate,
    category: 'unusual',
    audience: ['tech'],
  },
  {
    id: 'brutal',
    labelKey: 'template.brutal',
    component: BrutalTemplate,
    category: 'unusual',
    audience: ['creative', 'startup'],
  },
  {
    id: 'riso',
    labelKey: 'template.riso',
    component: RisoTemplate,
    category: 'unusual',
    audience: ['creative', 'sales-marketing'],
  },
  {
    id: 'spine',
    labelKey: 'template.spine',
    component: SpineTemplate,
    category: 'unusual',
    audience: ['academia', 'legal', 'creative'],
  },
  {
    id: 'outline',
    labelKey: 'template.outline',
    component: OutlineTemplate,
    category: 'unusual',
    audience: ['creative', 'corporate'],
  },
  {
    id: 'bento',
    labelKey: 'template.bento',
    component: BentoTemplate,
    category: 'unusual',
    audience: ['startup', 'tech', 'universal'],
  },
  {
    id: 'metro',
    labelKey: 'template.metro',
    component: MetroTemplate,
    category: 'concept',
    audience: ['universal', 'tech'],
  },
  {
    id: 'ide',
    labelKey: 'template.ide',
    component: IdeTemplate,
    category: 'concept',
    audience: ['tech'],
  },
  {
    id: 'newspaper',
    labelKey: 'template.newspaper',
    component: NewspaperTemplate,
    category: 'concept',
    audience: ['creative', 'sales-marketing'],
  },
  {
    id: 'boarding-pass',
    labelKey: 'template.boardingPass',
    component: BoardingPassTemplate,
    category: 'concept',
    audience: ['sales-marketing', 'universal'],
  },
  {
    id: 'chat',
    labelKey: 'template.chat',
    component: ChatTemplate,
    category: 'concept',
    audience: ['startup', 'sales-marketing'],
  },
  {
    id: 'menu',
    labelKey: 'template.menu',
    component: MenuTemplate,
    category: 'concept',
    audience: ['creative', 'nonprofit'],
  },
  {
    id: 'star-map',
    labelKey: 'template.starMap',
    component: StarMapTemplate,
    category: 'concept',
    audience: ['academia', 'tech'],
  },
  {
    id: 'encyclopedia',
    labelKey: 'template.encyclopedia',
    component: EncyclopediaTemplate,
    category: 'concept',
    audience: ['academia', 'universal'],
  },
  {
    id: 'nutrition',
    labelKey: 'template.nutrition',
    component: NutritionTemplate,
    category: 'concept',
    audience: ['creative', 'sales-marketing'],
  },
  {
    id: 'album',
    labelKey: 'template.album',
    component: AlbumTemplate,
    category: 'concept',
    audience: ['creative', 'universal'],
  },
  {
    id: 'periodic',
    labelKey: 'template.periodic',
    component: PeriodicTemplate,
    category: 'concept',
    audience: ['tech', 'academia'],
  },
  {
    id: 'character-sheet',
    labelKey: 'template.characterSheet',
    component: CharacterSheetTemplate,
    category: 'concept',
    audience: ['creative', 'tech', 'startup'],
  },
];

export function getTemplateComponent(id: TemplateId): ComponentType<ResumeTemplateProps> {
  const resolved = resolveTemplateId(id);
  return templateRegistry.find((definition) => definition.id === resolved)?.component ?? ClassicTemplate;
}
