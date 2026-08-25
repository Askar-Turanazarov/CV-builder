import { createEmptyResumeData, type ResumeData } from '../types/resume';

/**
 * Static, fully fictional resumes used ONLY to showcase real templates on
 * the landing page hero — never touches the actual resume-editing store.
 * No photos (`photo: null`) since we don't fabricate images of real-looking
 * people; the templates chosen for the showcase don't depend on a photo to
 * look complete.
 */
function buildShowcaseResume(overrides: Partial<ResumeData>): ResumeData {
  return { ...createEmptyResumeData(), viewMode: 'document', ...overrides };
}

export const showcaseResumes: ResumeData[] = [
  buildShowcaseResume({
    selectedTemplateId: 'classic',
    selectedThemeId: 'blue',
    personalInfo: {
      fullName: 'Айгуль Рахимова',
      jobTitle: 'Product-дизайнер',
      birthDate: '1996-04-12',
      photo: null,
    },
    contacts: {
      email: 'aigul.rakhimova@example.com',
      phone: '+998 90 123 45 67',
      location: 'Ташкент, Узбекистан',
      website: 'aigulrakhimova.design',
      linkedin: 'linkedin.com/in/aigul-rakhimova',
      telegram: '',
      github: '',
    },
    experience: [
      {
        id: 'exp-1',
        company: 'NeoBank Digital',
        position: 'Senior Product-дизайнер',
        startDate: '2022-03',
        endDate: null,
        isCurrent: true,
        location: 'Ташкент',
        description:
          'Веду дизайн мобильного банкинга: от исследования пользователей до финальных макетов и передачи в разработку. Запустила редизайн онбординга, снизивший отказы на 24%. Настроила и поддерживаю единую дизайн-систему для 4 продуктовых команд.',
      },
      {
        id: 'exp-2',
        company: 'Bright Studio',
        position: 'UX/UI-дизайнер',
        startDate: '2019-06',
        endDate: '2022-02',
        isCurrent: false,
        location: 'Ташкент',
        description:
          'Разрабатывала интерфейсы для 10+ клиентских проектов (fintech, e-commerce, edtech). Проводила юзабилити-тестирования и интервью с пользователями, готовила кликабельные прототипы в Figma.',
      },
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'Национальный университет Узбекистана',
        degree: 'Бакалавр',
        fieldOfStudy: 'Информационные технологии',
        startDate: '2014-09',
        endDate: '2018-06',
        description: '',
      },
    ],
    skills: [
      { id: 's-1', name: 'Figma', level: 5 },
      { id: 's-2', name: 'UX-исследования', level: 4 },
      { id: 's-3', name: 'Дизайн-системы', level: 5 },
      { id: 's-4', name: 'Прототипирование', level: 4 },
      { id: 's-5', name: 'HTML/CSS', level: 3 },
    ],
    languages: [
      { id: 'l-1', name: 'Узбекский', level: 'native' },
      { id: 'l-2', name: 'Русский', level: 'C1' },
      { id: 'l-3', name: 'Английский', level: 'B2' },
    ],
    aiContent: {
      summary:
        'Product-дизайнер с 5+ годами опыта в финтехе и e-commerce. Соединяю глубокие UX-исследования с сильной визуальной подачей — довожу продукт от гипотезы до метрик. Строю и поддерживаю дизайн-системы, которые ускоряют работу целых команд.',
      strengths: [
        'Снизила отказы на этапе онбординга на 24% через редизайн, основанный на данных',
        'Построила дизайн-систему, которой пользуются 4 продуктовые команды',
        'Опыт полного цикла: от исследования до пиксель-перфект вёрстки',
      ],
      generatedAt: '2026-01-15T10:00:00.000Z',
      sourceHash: 'showcase-classic',
    },
  }),

  buildShowcaseResume({
    selectedTemplateId: 'sidebar',
    selectedThemeId: 'emerald',
    personalInfo: {
      fullName: 'Тимур Азизов',
      jobTitle: 'Backend-разработчик',
      birthDate: '1994-09-03',
      photo: null,
    },
    contacts: {
      email: 'timur.azizov@example.com',
      phone: '+998 91 234 56 78',
      location: 'Самарканд, Узбекистан',
      website: '',
      linkedin: 'linkedin.com/in/timur-azizov',
      telegram: '',
      github: 'github.com/tazizov',
    },
    experience: [
      {
        id: 'exp-1',
        company: 'Ist Digital',
        position: 'Senior Backend-разработчик',
        startDate: '2021-05',
        endDate: null,
        isCurrent: true,
        location: 'удалённо',
        description:
          'Проектирую и поддерживаю микросервисную архитектуру платежной системы на Node.js/PostgreSQL, выдерживающую 2000+ RPS. Внедрил очереди сообщений для асинхронной обработки транзакций, сократив время отклика API на 40%.',
      },
      {
        id: 'exp-2',
        company: 'CodeLine LLC',
        position: 'Backend-разработчик',
        startDate: '2018-08',
        endDate: '2021-04',
        isCurrent: false,
        location: 'Самарканд',
        description:
          'Разрабатывал REST/GraphQL API для e-commerce платформы, писал миграции и покрывал код интеграционными тестами. Участвовал в переходе с монолита на сервисную архитектуру.',
      },
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'Самаркандский государственный университет',
        degree: 'Бакалавр',
        fieldOfStudy: 'Прикладная математика и информатика',
        startDate: '2012-09',
        endDate: '2016-06',
        description: '',
      },
    ],
    skills: [
      { id: 's-1', name: 'Node.js', level: 5 },
      { id: 's-2', name: 'PostgreSQL', level: 5 },
      { id: 's-3', name: 'TypeScript', level: 4 },
      { id: 's-4', name: 'Docker', level: 4 },
      { id: 's-5', name: 'Redis', level: 3 },
      { id: 's-6', name: 'Kafka', level: 3 },
    ],
    languages: [
      { id: 'l-1', name: 'Узбекский', level: 'native' },
      { id: 'l-2', name: 'Русский', level: 'C1' },
      { id: 'l-3', name: 'Английский', level: 'B1' },
    ],
    aiContent: {
      summary:
        'Backend-разработчик с 7-летним опытом проектирования высоконагруженных сервисов на Node.js. Специализируюсь на платёжных системах и микросервисной архитектуре — от проектирования схемы БД до продакшен-мониторинга.',
      strengths: [
        'Спроектировал платёжный сервис, выдерживающий 2000+ запросов в секунду',
        'Сократил время отклика API на 40% через асинхронную обработку очередей',
        'Провёл миграцию монолита на микросервисы без простоя продакшена',
      ],
      generatedAt: '2026-01-15T10:00:00.000Z',
      sourceHash: 'showcase-sidebar',
    },
  }),

  buildShowcaseResume({
    selectedTemplateId: 'sales-vibrant',
    selectedThemeId: 'sunset',
    personalInfo: {
      fullName: 'Мадина Юсупова',
      jobTitle: 'Руководитель отдела маркетинга',
      birthDate: '1992-11-20',
      photo: null,
    },
    contacts: {
      email: 'madina.yusupova@example.com',
      phone: '+998 93 345 67 89',
      location: 'Ташкент, Узбекистан',
      website: 'madinayusupova.com',
      linkedin: 'linkedin.com/in/madina-yusupova',
      telegram: '@madina_marketing',
      github: '',
    },
    experience: [
      {
        id: 'exp-1',
        company: 'BrightWave Group',
        position: 'Head of Marketing',
        startDate: '2020-02',
        endDate: null,
        isCurrent: true,
        location: 'Ташкент',
        description:
          'Руковожу командой из 8 маркетологов, отвечаю за стратегию бренда и performance-маркетинг по 3 рынкам. Вывела ROMI кампаний на 3.2x, увеличила органический трафик сайта в 2.5 раза за 18 месяцев.',
      },
      {
        id: 'exp-2',
        company: 'Orient Retail',
        position: 'Маркетолог-аналитик',
        startDate: '2016-09',
        endDate: '2020-01',
        isCurrent: false,
        location: 'Ташкент',
        description:
          'Запускала и оптимизировала рекламные кампании в Google Ads/Meta Ads, вела аналитику воронки продаж, готовила еженедельную отчётность для руководства.',
      },
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'Ташкентский государственный экономический университет',
        degree: 'Магистр',
        fieldOfStudy: 'Маркетинг',
        startDate: '2014-09',
        endDate: '2016-06',
        description: '',
      },
    ],
    skills: [
      { id: 's-1', name: 'Performance-маркетинг', level: 5 },
      { id: 's-2', name: 'Аналитика (GA4)', level: 5 },
      { id: 's-3', name: 'Управление командой', level: 4 },
      { id: 's-4', name: 'Бренд-стратегия', level: 4 },
      { id: 's-5', name: 'SEO', level: 3 },
    ],
    languages: [
      { id: 'l-1', name: 'Узбекский', level: 'native' },
      { id: 'l-2', name: 'Русский', level: 'native' },
      { id: 'l-3', name: 'Английский', level: 'C1' },
    ],
    aiContent: {
      summary:
        'Маркетинг-руководитель с 9-летним опытом: от performance-кампаний до построения бренд-стратегии и управления командой. Мыслю метриками — каждое решение подкрепляю данными и считаю в деньгах.',
      strengths: [
        'Вывела ROMI маркетинговых кампаний на уровень 3.2x',
        'Увеличила органический трафик сайта в 2.5 раза за 18 месяцев',
        'Построила и возглавила команду маркетинга из 8 человек',
      ],
      generatedAt: '2026-01-15T10:00:00.000Z',
      sourceHash: 'showcase-sales-vibrant',
    },
  }),
];
