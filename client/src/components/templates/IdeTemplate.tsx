import type { ResumeTemplateProps } from '../../types/resume';
import { descriptionLines, useTemplateKit } from './shared/templateKit';
import styles from './IdeTemplate.module.css';

// The resume as a source file open in a code editor: tabs, explorer, line
// numbers, syntax colours, a minimap and a status bar. Identifiers come
// from the locale too (Unicode identifiers are valid TypeScript), so a
// Russian resume reads `const кандидат = { имя: … }`.

type TokenKind = 'kw' | 'var' | 'prop' | 'str' | 'num' | 'com' | 'pun';
type Token = [TokenKind, string, string?]; // kind, text, link
interface Line {
  indent: number;
  tokens: Token[];
}
interface Block {
  entry: boolean;
  lines: Line[];
}

const quote = (text: string) => `'${text.replace(/'/g, '’')}'`;

function slug(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 18) || 'file'
  );
}

export default function IdeTemplate({ data }: ResumeTemplateProps) {
  const { t, range, birthDate, summary, strengths } = useTemplateKit(data);
  const id = (key: string) => t(`ide.id.${key}`);
  const { fullName, jobTitle } = data.personalInfo;
  const c = data.contacts;

  const blocks: Block[] = [];
  let current: Block = { entry: false, lines: [] };
  const line = (indent: number, ...tokens: Token[]) => current.lines.push({ indent, tokens });
  const blank = () => line(0);
  const startEntry = () => {
    blocks.push(current);
    current = { entry: true, lines: [] };
  };
  const endEntry = () => {
    blocks.push(current);
    current = { entry: false, lines: [] };
  };
  const prop = (indent: number, key: string, value: string, link?: string) =>
    line(indent, ['prop', id(key)], ['pun', ': '], ['str', quote(value), link], ['pun', ',']);

  if (summary) {
    line(0, ['com', `/**`]);
    line(0, ['com', ` * ${t('sections.summary')}`]);
    line(0, ['com', ` *`]);
    for (const sentence of summary.split(/(?<=[.!?])\s+/)) line(0, ['com', ` * ${sentence}`]);
    line(0, ['com', ` */`]);
    blank();
  }

  startEntry();
  line(0, ['kw', 'const '], ['var', id('candidate')], ['pun', ' = {']);
  prop(1, 'name', fullName || '—');
  if (jobTitle) prop(1, 'title', jobTitle);
  if (birthDate) prop(1, 'born', birthDate);
  if (c.location) prop(1, 'city', c.location);
  if (c.email) prop(1, 'email', c.email, `mailto:${c.email}`);
  if (c.phone) prop(1, 'phone', c.phone, `tel:${c.phone.replace(/[^+\d]/g, '')}`);
  const links: [string, string][] = [];
  if (c.website) links.push([c.website, c.website]);
  if (c.linkedin) links.push([c.linkedin, c.linkedin]);
  if (c.github) links.push([c.github, c.github]);
  if (c.telegram) links.push([c.telegram, `t.me/${c.telegram.replace(/^@/, '').replace(/^https?:\/\/t\.me\//i, '')}`]);
  if (links.length) {
    line(1, ['prop', id('links')], ['pun', ': [']);
    for (const [label, url] of links) {
      line(2, ['str', quote(label), /^https?:/i.test(url) ? url : `https://${url}`], ['pun', ',']);
    }
    line(1, ['pun', '],']);
  }
  line(0, ['pun', '};']);
  endEntry();

  if (strengths.length) {
    blank();
    line(0, ['kw', 'const '], ['var', id('strengths')], ['pun', ' = [']);
    for (const s of strengths) line(1, ['str', quote(s)], ['pun', ',']);
    line(0, ['pun', '];']);
  }

  if (data.experience.length) {
    blank();
    line(0, ['kw', 'const '], ['var', id('experience')], ['pun', ' = [']);
    for (const exp of data.experience) {
      line(1, ['pun', '{']);
      prop(2, 'company', exp.company);
      prop(2, 'position', exp.position);
      prop(2, 'period', range(exp.startDate, exp.endDate));
      if (exp.location) prop(2, 'location', exp.location);
      for (const detail of descriptionLines(exp.description)) line(2, ['com', `// ${detail}`]);
      line(1, ['pun', '},']);
    }
    line(0, ['pun', '];']);
  }

  if (data.education.length) {
    blank();
    line(0, ['kw', 'const '], ['var', id('education')], ['pun', ' = [']);
    for (const edu of data.education) {
      startEntry();
      line(1, ['pun', '{']);
      prop(2, 'institution', edu.institution);
      prop(2, 'degree', [edu.degree, edu.fieldOfStudy].filter(Boolean).join(', '));
      prop(2, 'period', range(edu.startDate, edu.endDate));
      if (edu.description) line(2, ['com', `// ${edu.description}`]);
      line(1, ['pun', '},']);
      endEntry();
    }
    line(0, ['pun', '];']);
  }

  if (data.skills.length) {
    blank();
    line(0, ['kw', 'const '], ['var', id('skills')], ['pun', ' = {']);
    for (const skill of data.skills) {
      line(1, ['str', quote(skill.name)], ['pun', ': '], skill.level ? ['num', String(skill.level)] : ['kw', 'true'], ['pun', ',']);
    }
    line(0, ['pun', '};']);
  }

  if (data.languages.length) {
    blank();
    startEntry();
    line(0, ['kw', 'const '], ['var', id('languages')], ['pun', ' = {']);
    for (const lang of data.languages) {
      line(1, ['str', quote(lang.name)], ['pun', ': '], ['str', quote(lang.level === 'native' ? t('nativeLanguage') : lang.level)], ['pun', ',']);
    }
    line(0, ['pun', '};']);
    endEntry();
  }

  blank();
  line(0, ['kw', 'export default '], ['var', id('candidate')], ['pun', ';']);
  blocks.push(current);

  const totalLines = blocks.reduce((sum, block) => sum + block.lines.length, 0);
  const fileName = `${t('ide.file')}.tsx`;
  const companyFiles = data.experience.map((exp) => `${slug(exp.company)}.ts`);
  let number = 0;

  return (
    <div className={`${styles.page} resume-document`}>
      <div className={styles.titleBar}>
        <span className={styles.dots} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className={styles.tabActive}>{fileName}</span>
        <span className={styles.tab}>{t('ide.readme')}.md</span>
        <span className={styles.tab}>package.json</span>
      </div>

      <div className={styles.body}>
        <aside className={styles.explorer} aria-hidden="true">
          <div className={styles.explorerTitle}>{t('ide.explorer')}</div>
          <div className={styles.folder}>▾ {slug(fullName || 'cv')}</div>
          <div className={`${styles.file} ${styles.fileActive}`}>⚛ {fileName}</div>
          <div className={styles.file}>ⓘ {t('ide.readme')}.md</div>
          {companyFiles.length > 0 && <div className={styles.folder}>▾ {id('experience')}</div>}
          {companyFiles.map((file, i) => (
            <div key={i} className={`${styles.file} ${styles.nested}`}>
              ʦ {file}
            </div>
          ))}
          <div className={styles.file}>{'{}'} package.json</div>
        </aside>

        <div className={styles.code}>
          <h1 className={`${styles.srOnly} resume-name`}>{fullName}</h1>
          {blocks
            .filter((block) => block.lines.length > 0)
            .map((block, b) => (
              <div key={b} className={block.entry ? 'resume-entry' : undefined}>
                {block.lines.map((ln) => {
                  number += 1;
                  return (
                    <div key={number} className={styles.line}>
                      <span className={styles.number}>{number}</span>
                      <span className={styles.text} style={{ paddingLeft: `${ln.indent * 2}ch` }}>
                        {ln.tokens.map(([kind, text, link], k) =>
                          link ? (
                            <a key={k} href={link} className={styles[kind]} target="_blank" rel="noopener noreferrer">
                              {text}
                            </a>
                          ) : (
                            <span key={k} className={styles[kind]}>
                              {text}
                            </span>
                          ),
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
        </div>

        <div className={styles.minimap} aria-hidden="true">
          {blocks.flatMap((block, b) =>
            block.lines.map((ln, i) => {
              const length = ln.tokens.reduce((sum, [, text]) => sum + text.length, 0) + ln.indent * 2;
              return <i key={`${b}-${i}`} style={{ width: `${Math.min(100, length * 1.6)}%`, marginLeft: `${ln.indent * 6}%` }} />;
            }),
          )}
        </div>
      </div>

      <div className={styles.statusBar}>
        <span>⎇ {t('ide.branch')}</span>
        <span className={styles.statusRight}>
          <span>✓ {t('ide.noErrors')}</span>
          <span>{t('ide.lines', { count: totalLines })}</span>
          <span>UTF-8</span>
          <span>TypeScript JSX</span>
        </span>
      </div>
    </div>
  );
}
