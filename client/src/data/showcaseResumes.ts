import { createEmptyResumeData, type ResumeData, type UiLanguage, type TemplateId, type ThemeId } from '../types/resume';

/**
 * Static, fully fictional resumes used ONLY to showcase real templates on
 * the landing page hero — never touches the actual resume-editing store.
 * No photos (`photo: null`) since we don't fabricate images of real-looking
 * people; the templates chosen for the showcase don't depend on a photo to
 * look complete.
 *
 * Content is fully localized (ru/en/uz), not just re-using the app's i18n
 * section labels — switching the UI language changes the fabricated job
 * titles/descriptions/skills too, and `uiLanguage` is set to match so date
 * formatting follows along.
 */

interface LocalizedContent {
  jobTitle: string;
  location: string;
  experience: {
    company: string;
    position: string;
    startDate: string;
    endDate: string | null;
    isCurrent: boolean;
    location: string;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
  }[];
  skills: { name: string; level: 1 | 2 | 3 | 4 | 5 }[];
  languages: { name: string; level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'native' }[];
  summary: string;
  strengths: string[];
}

interface ShowcasePerson {
  id: string;
  fullName: string;
  birthDate: string;
  email: string;
  phone: string;
  website?: string;
  linkedin?: string;
  telegram?: string;
  github?: string;
  templateId: TemplateId;
  themeId: ThemeId;
  byLang: Record<UiLanguage, LocalizedContent>;
}

const PEOPLE: ShowcasePerson[] = [
  {
    id: 'aigul',
    fullName: 'Айгуль Рахимова',
    birthDate: '1996-04-12',
    email: 'aigul.rakhimova@example.com',
    phone: '+998 90 123 45 67',
    website: 'aigulrakhimova.design',
    linkedin: 'linkedin.com/in/aigul-rakhimova',
    templateId: 'classic',
    themeId: 'blue',
    byLang: {
      ru: {
        jobTitle: 'Product-дизайнер',
        location: 'Ташкент, Узбекистан',
        experience: [
          {
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
            institution: 'Национальный университет Узбекистана',
            degree: 'Бакалавр',
            fieldOfStudy: 'Информационные технологии',
            startDate: '2014-09',
            endDate: '2018-06',
          },
        ],
        skills: [
          { name: 'Figma', level: 5 },
          { name: 'UX-исследования', level: 4 },
          { name: 'Дизайн-системы', level: 5 },
          { name: 'Прототипирование', level: 4 },
          { name: 'HTML/CSS', level: 3 },
        ],
        languages: [
          { name: 'Узбекский', level: 'native' },
          { name: 'Русский', level: 'C1' },
          { name: 'Английский', level: 'B2' },
        ],
        summary:
          'Product-дизайнер с 5+ годами опыта в финтехе и e-commerce. Соединяю глубокие UX-исследования с сильной визуальной подачей — довожу продукт от гипотезы до метрик. Строю и поддерживаю дизайн-системы, которые ускоряют работу целых команд.',
        strengths: [
          'Снизила отказы на этапе онбординга на 24% через редизайн, основанный на данных',
          'Построила дизайн-систему, которой пользуются 4 продуктовые команды',
          'Опыт полного цикла: от исследования до пиксель-перфект вёрстки',
        ],
      },
      en: {
        jobTitle: 'Product Designer',
        location: 'Tashkent, Uzbekistan',
        experience: [
          {
            company: 'NeoBank Digital',
            position: 'Senior Product Designer',
            startDate: '2022-03',
            endDate: null,
            isCurrent: true,
            location: 'Tashkent',
            description:
              'Lead design for a mobile banking app end-to-end: from user research to final mockups and developer handoff. Shipped an onboarding redesign that cut drop-off by 24%. Built and maintain a shared design system used by 4 product teams.',
          },
          {
            company: 'Bright Studio',
            position: 'UX/UI Designer',
            startDate: '2019-06',
            endDate: '2022-02',
            isCurrent: false,
            location: 'Tashkent',
            description:
              'Designed interfaces for 10+ client projects across fintech, e-commerce, and edtech. Ran usability tests and user interviews, delivered clickable prototypes in Figma.',
          },
        ],
        education: [
          {
            institution: 'National University of Uzbekistan',
            degree: "Bachelor's Degree",
            fieldOfStudy: 'Information Technology',
            startDate: '2014-09',
            endDate: '2018-06',
          },
        ],
        skills: [
          { name: 'Figma', level: 5 },
          { name: 'UX research', level: 4 },
          { name: 'Design systems', level: 5 },
          { name: 'Prototyping', level: 4 },
          { name: 'HTML/CSS', level: 3 },
        ],
        languages: [
          { name: 'Uzbek', level: 'native' },
          { name: 'Russian', level: 'C1' },
          { name: 'English', level: 'B2' },
        ],
        summary:
          'Product designer with 5+ years in fintech and e-commerce. I pair deep UX research with strong visual craft — taking a product from hypothesis to measurable impact. I build and maintain design systems that speed up entire teams.',
        strengths: [
          'Cut onboarding drop-off by 24% through a data-driven redesign',
          'Built a design system used by 4 product teams',
          'Full-cycle experience: from research to pixel-perfect handoff',
        ],
      },
      uz: {
        jobTitle: 'Product-dizayner',
        location: 'Toshkent, O‘zbekiston',
        experience: [
          {
            company: 'NeoBank Digital',
            position: 'Katta Product-dizayner',
            startDate: '2022-03',
            endDate: null,
            isCurrent: true,
            location: 'Toshkent',
            description:
              'Mobil banking ilovasi dizaynini boshdan-oxirigacha boshqaraman: foydalanuvchi tadqiqotidan yakuniy maketlargacha va dasturchilarga topshirishgacha. Chekinish darajasini 24% ga kamaytirgan onboarding qayta dizaynini ishga tushirdim. 4 ta mahsulot jamoasi foydalanadigan yagona dizayn tizimini yaratdim va qo‘llab-quvvatlayman.',
          },
          {
            company: 'Bright Studio',
            position: 'UX/UI-dizayner',
            startDate: '2019-06',
            endDate: '2022-02',
            isCurrent: false,
            location: 'Toshkent',
            description:
              'Fintech, e-commerce va ta’lim texnologiyalari sohalarida 10+ mijoz loyihasi uchun interfeyslar yaratdim. Foydalanuvchilar bilan intervyu va qulaylik testlarini o‘tkazdim, Figma’da bosiladigan prototiplar tayyorladim.',
          },
        ],
        education: [
          {
            institution: 'O‘zbekiston Milliy universiteti',
            degree: 'Bakalavr',
            fieldOfStudy: 'Axborot texnologiyalari',
            startDate: '2014-09',
            endDate: '2018-06',
          },
        ],
        skills: [
          { name: 'Figma', level: 5 },
          { name: 'UX tadqiqotlari', level: 4 },
          { name: 'Dizayn tizimlari', level: 5 },
          { name: 'Prototiplash', level: 4 },
          { name: 'HTML/CSS', level: 3 },
        ],
        languages: [
          { name: 'O‘zbek tili', level: 'native' },
          { name: 'Rus tili', level: 'C1' },
          { name: 'Ingliz tili', level: 'B2' },
        ],
        summary:
          'Fintech va e-commerce sohasida 5+ yillik tajribaga ega Product-dizayner. Chuqur UX tadqiqotlarini kuchli vizual taqdimot bilan birlashtiraman — mahsulotni gipotezadan o‘lchovli natijalarga olib chiqaman. Butun jamoalar ishini tezlashtiradigan dizayn tizimlarini yarataman va qo‘llab-quvvatlayman.',
        strengths: [
          'Ma’lumotlarga asoslangan qayta dizayn orqali onboarding bosqichida chekinishni 24% ga kamaytirdim',
          '4 ta mahsulot jamoasi foydalanadigan dizayn tizimini yaratdim',
          'To‘liq tsikl tajribasi: tadqiqotdan piksel-perfekt natijagacha',
        ],
      },
    },
  },

  {
    id: 'timur',
    fullName: 'Тимур Азизов',
    birthDate: '1994-09-03',
    email: 'timur.azizov@example.com',
    phone: '+998 91 234 56 78',
    linkedin: 'linkedin.com/in/timur-azizov',
    github: 'github.com/tazizov',
    templateId: 'sidebar',
    themeId: 'emerald',
    byLang: {
      ru: {
        jobTitle: 'Backend-разработчик',
        location: 'Самарканд, Узбекистан',
        experience: [
          {
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
            institution: 'Самаркандский государственный университет',
            degree: 'Бакалавр',
            fieldOfStudy: 'Прикладная математика и информатика',
            startDate: '2012-09',
            endDate: '2016-06',
          },
        ],
        skills: [
          { name: 'Node.js', level: 5 },
          { name: 'PostgreSQL', level: 5 },
          { name: 'TypeScript', level: 4 },
          { name: 'Docker', level: 4 },
          { name: 'Redis', level: 3 },
          { name: 'Kafka', level: 3 },
        ],
        languages: [
          { name: 'Узбекский', level: 'native' },
          { name: 'Русский', level: 'C1' },
          { name: 'Английский', level: 'B1' },
        ],
        summary:
          'Backend-разработчик с 7-летним опытом проектирования высоконагруженных сервисов на Node.js. Специализируюсь на платёжных системах и микросервисной архитектуре — от проектирования схемы БД до продакшен-мониторинга.',
        strengths: [
          'Спроектировал платёжный сервис, выдерживающий 2000+ запросов в секунду',
          'Сократил время отклика API на 40% через асинхронную обработку очередей',
          'Провёл миграцию монолита на микросервисы без простоя продакшена',
        ],
      },
      en: {
        jobTitle: 'Backend Developer',
        location: 'Samarkand, Uzbekistan',
        experience: [
          {
            company: 'Ist Digital',
            position: 'Senior Backend Developer',
            startDate: '2021-05',
            endDate: null,
            isCurrent: true,
            location: 'remote',
            description:
              'Design and maintain a microservice architecture for a payments platform on Node.js/PostgreSQL handling 2000+ RPS. Introduced message queues for asynchronous transaction processing, cutting API response time by 40%.',
          },
          {
            company: 'CodeLine LLC',
            position: 'Backend Developer',
            startDate: '2018-08',
            endDate: '2021-04',
            isCurrent: false,
            location: 'Samarkand',
            description:
              'Built REST/GraphQL APIs for an e-commerce platform, wrote database migrations, and covered code with integration tests. Took part in migrating the monolith to a service-based architecture.',
          },
        ],
        education: [
          {
            institution: 'Samarkand State University',
            degree: "Bachelor's Degree",
            fieldOfStudy: 'Applied Mathematics and Computer Science',
            startDate: '2012-09',
            endDate: '2016-06',
          },
        ],
        skills: [
          { name: 'Node.js', level: 5 },
          { name: 'PostgreSQL', level: 5 },
          { name: 'TypeScript', level: 4 },
          { name: 'Docker', level: 4 },
          { name: 'Redis', level: 3 },
          { name: 'Kafka', level: 3 },
        ],
        languages: [
          { name: 'Uzbek', level: 'native' },
          { name: 'Russian', level: 'C1' },
          { name: 'English', level: 'B1' },
        ],
        summary:
          'Backend developer with 7 years designing high-load services on Node.js. I specialize in payment systems and microservice architecture — from database schema design to production monitoring.',
        strengths: [
          'Designed a payment service handling 2000+ requests per second',
          'Cut API response time by 40% through asynchronous queue processing',
          'Migrated a monolith to microservices with zero production downtime',
        ],
      },
      uz: {
        jobTitle: 'Backend-dasturchi',
        location: 'Samarqand, O‘zbekiston',
        experience: [
          {
            company: 'Ist Digital',
            position: 'Katta Backend-dasturchi',
            startDate: '2021-05',
            endDate: null,
            isCurrent: true,
            location: 'masofaviy',
            description:
              'Node.js/PostgreSQL asosida 2000+ RPS ni ushlab turadigan to‘lov tizimi uchun mikroservis arxitekturasini loyihalashtiraman va qo‘llab-quvvatlayman. Tranzaksiyalarni asinxron qayta ishlash uchun xabar navbatlarini joriy etdim, bu API javob vaqtini 40% ga qisqartirdi.',
          },
          {
            company: 'CodeLine LLC',
            position: 'Backend-dasturchi',
            startDate: '2018-08',
            endDate: '2021-04',
            isCurrent: false,
            location: 'Samarqand',
            description:
              'E-commerce platformasi uchun REST/GraphQL API’lar yaratdim, migratsiyalar yozdim va kodni integratsion testlar bilan qopladim. Monolitdan servis arxitekturasiga o‘tishda ishtirok etdim.',
          },
        ],
        education: [
          {
            institution: 'Samarqand davlat universiteti',
            degree: 'Bakalavr',
            fieldOfStudy: 'Amaliy matematika va informatika',
            startDate: '2012-09',
            endDate: '2016-06',
          },
        ],
        skills: [
          { name: 'Node.js', level: 5 },
          { name: 'PostgreSQL', level: 5 },
          { name: 'TypeScript', level: 4 },
          { name: 'Docker', level: 4 },
          { name: 'Redis', level: 3 },
          { name: 'Kafka', level: 3 },
        ],
        languages: [
          { name: 'O‘zbek tili', level: 'native' },
          { name: 'Rus tili', level: 'C1' },
          { name: 'Ingliz tili', level: 'B1' },
        ],
        summary:
          'Node.js’da yuqori yuklama xizmatlarini loyihalashtirish bo‘yicha 7 yillik tajribaga ega Backend-dasturchi. To‘lov tizimlari va mikroservis arxitekturasiga ixtisoslashganman — DB sxemasini loyihalashtirishdan production monitoringigacha.',
        strengths: [
          'Soniyasiga 2000+ so‘rovni ushlab turadigan to‘lov xizmatini loyihalashtirdim',
          'Asinxron navbat qayta ishlash orqali API javob vaqtini 40% ga qisqartirdim',
          'Production’da uzilishsiz monolitni mikroservislarga ko‘chirdim',
        ],
      },
    },
  },

  {
    id: 'madina',
    fullName: 'Мадина Юсупова',
    birthDate: '1992-11-20',
    email: 'madina.yusupova@example.com',
    phone: '+998 93 345 67 89',
    website: 'madinayusupova.com',
    linkedin: 'linkedin.com/in/madina-yusupova',
    telegram: '@madina_marketing',
    templateId: 'sales-vibrant',
    themeId: 'sunset',
    byLang: {
      ru: {
        jobTitle: 'Руководитель отдела маркетинга',
        location: 'Ташкент, Узбекистан',
        experience: [
          {
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
            institution: 'Ташкентский государственный экономический университет',
            degree: 'Магистр',
            fieldOfStudy: 'Маркетинг',
            startDate: '2014-09',
            endDate: '2016-06',
          },
        ],
        skills: [
          { name: 'Performance-маркетинг', level: 5 },
          { name: 'Аналитика (GA4)', level: 5 },
          { name: 'Управление командой', level: 4 },
          { name: 'Бренд-стратегия', level: 4 },
          { name: 'SEO', level: 3 },
        ],
        languages: [
          { name: 'Узбекский', level: 'native' },
          { name: 'Русский', level: 'native' },
          { name: 'Английский', level: 'C1' },
        ],
        summary:
          'Маркетинг-руководитель с 9-летним опытом: от performance-кампаний до построения бренд-стратегии и управления командой. Мыслю метриками — каждое решение подкрепляю данными и считаю в деньгах.',
        strengths: [
          'Вывела ROMI маркетинговых кампаний на уровень 3.2x',
          'Увеличила органический трафик сайта в 2.5 раза за 18 месяцев',
          'Построила и возглавила команду маркетинга из 8 человек',
        ],
      },
      en: {
        jobTitle: 'Head of Marketing',
        location: 'Tashkent, Uzbekistan',
        experience: [
          {
            company: 'BrightWave Group',
            position: 'Head of Marketing',
            startDate: '2020-02',
            endDate: null,
            isCurrent: true,
            location: 'Tashkent',
            description:
              'Lead a team of 8 marketers, own brand strategy and performance marketing across 3 markets. Raised campaign ROMI to 3.2x and grew organic site traffic 2.5x in 18 months.',
          },
          {
            company: 'Orient Retail',
            position: 'Marketing Analyst',
            startDate: '2016-09',
            endDate: '2020-01',
            isCurrent: false,
            location: 'Tashkent',
            description:
              'Launched and optimized ad campaigns on Google Ads/Meta Ads, tracked sales funnel analytics, and prepared weekly reports for leadership.',
          },
        ],
        education: [
          {
            institution: 'Tashkent State University of Economics',
            degree: "Master's Degree",
            fieldOfStudy: 'Marketing',
            startDate: '2014-09',
            endDate: '2016-06',
          },
        ],
        skills: [
          { name: 'Performance marketing', level: 5 },
          { name: 'Analytics (GA4)', level: 5 },
          { name: 'Team management', level: 4 },
          { name: 'Brand strategy', level: 4 },
          { name: 'SEO', level: 3 },
        ],
        languages: [
          { name: 'Uzbek', level: 'native' },
          { name: 'Russian', level: 'native' },
          { name: 'English', level: 'C1' },
        ],
        summary:
          'Marketing leader with 9 years of experience: from performance campaigns to brand strategy and team leadership. I think in metrics — every decision is backed by data and measured in revenue.',
        strengths: [
          'Raised marketing campaign ROMI to 3.2x',
          'Grew organic site traffic 2.5x in 18 months',
          'Built and led an 8-person marketing team',
        ],
      },
      uz: {
        jobTitle: 'Marketing bo‘limi rahbari',
        location: 'Toshkent, O‘zbekiston',
        experience: [
          {
            company: 'BrightWave Group',
            position: 'Marketing bo‘limi rahbari',
            startDate: '2020-02',
            endDate: null,
            isCurrent: true,
            location: 'Toshkent',
            description:
              '8 nafar marketolog jamoasiga rahbarlik qilaman, 3 ta bozor bo‘yicha brend strategiyasi va performance-marketing uchun javobgarman. Kampaniyalar ROMI ko‘rsatkichini 3.2x ga oshirdim, 18 oy ichida saytning organik trafigini 2.5 barobar oshirdim.',
          },
          {
            company: 'Orient Retail',
            position: 'Marketing-analitik',
            startDate: '2016-09',
            endDate: '2020-01',
            isCurrent: false,
            location: 'Toshkent',
            description:
              'Google Ads/Meta Ads’da reklama kampaniyalarini ishga tushirdim va optimallashtirdim, sotuv voronkasi tahlilini yuritdim, rahbariyat uchun haftalik hisobotlar tayyorladim.',
          },
        ],
        education: [
          {
            institution: 'Toshkent davlat iqtisodiyot universiteti',
            degree: 'Magistr',
            fieldOfStudy: 'Marketing',
            startDate: '2014-09',
            endDate: '2016-06',
          },
        ],
        skills: [
          { name: 'Performance-marketing', level: 5 },
          { name: 'Analitika (GA4)', level: 5 },
          { name: 'Jamoa boshqaruvi', level: 4 },
          { name: 'Brend strategiyasi', level: 4 },
          { name: 'SEO', level: 3 },
        ],
        languages: [
          { name: 'O‘zbek tili', level: 'native' },
          { name: 'Rus tili', level: 'native' },
          { name: 'Ingliz tili', level: 'C1' },
        ],
        summary:
          '9 yillik tajribaga ega marketing rahbari: performance-kampaniyalardan brend strategiyasi va jamoa boshqaruvigacha. Men ko‘rsatkichlar bilan fikrlayman — har bir qaror ma’lumotlarga asoslanadi va pulda o‘lchanadi.',
        strengths: [
          'Marketing kampaniyalari ROMI ko‘rsatkichini 3.2x darajasiga chiqardim',
          '18 oy ichida saytning organik trafigini 2.5 barobar oshirdim',
          '8 kishilik marketing jamoasini tuzdim va boshqardim',
        ],
      },
    },
  },
];

export function getShowcaseResumes(lang: UiLanguage): ResumeData[] {
  return PEOPLE.map((person) => {
    const content = person.byLang[lang];
    const base = createEmptyResumeData();
    const resume: ResumeData = {
      ...base,
      uiLanguage: lang,
      viewMode: 'document',
      selectedTemplateId: person.templateId,
      selectedThemeId: person.themeId,
      personalInfo: {
        fullName: person.fullName,
        jobTitle: content.jobTitle,
        birthDate: person.birthDate,
        photo: null,
      },
      contacts: {
        email: person.email,
        phone: person.phone,
        location: content.location,
        website: person.website ?? '',
        linkedin: person.linkedin ?? '',
        telegram: person.telegram ?? '',
        github: person.github ?? '',
      },
      experience: content.experience.map((exp, index) => ({
        id: `${person.id}-exp-${index}`,
        ...exp,
      })),
      education: content.education.map((edu, index) => ({
        id: `${person.id}-edu-${index}`,
        ...edu,
        description: '',
      })),
      skills: content.skills.map((skill, index) => ({
        id: `${person.id}-skill-${index}`,
        ...skill,
      })),
      languages: content.languages.map((language, index) => ({
        id: `${person.id}-lang-${index}`,
        ...language,
      })),
      aiContent: {
        summary: content.summary,
        strengths: content.strengths,
        generatedAt: '2026-01-15T10:00:00.000Z',
        sourceHash: `showcase-${person.id}`,
      },
    };
    return resume;
  });
}
