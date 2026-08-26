import { useTranslation } from 'react-i18next';
import { formatFullDate } from '../templates/shared/dateFormat';
import type { UiLanguage } from '../../types/resume';
import styles from './CoverLetterDocument.module.css';

export interface CoverLetterDocumentData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  content: string;
  targetRole: string;
  targetCompany: string;
  uiLanguage: UiLanguage;
  dateIso: string;
}

export default function CoverLetterDocument({ data }: { data: CoverLetterDocumentData }) {
  const { t } = useTranslation('insights');
  const paragraphs = data.content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const contactLine = [data.email, data.phone, data.location].filter(Boolean).join('  •  ');
  const subjectLine = data.targetRole
    ? data.targetCompany
      ? t('coverLetter.subjectWithCompany', { role: data.targetRole, company: data.targetCompany })
      : t('coverLetter.subjectRoleOnly', { role: data.targetRole })
    : '';

  return (
    <div className={`${styles.document} resume-document`}>
      <header className={styles.header}>
        <div className={styles.name}>{data.fullName}</div>
        {contactLine && <div className={styles.contacts}>{contactLine}</div>}
      </header>

      <div className={styles.date}>{formatFullDate(data.dateIso, data.uiLanguage)}</div>

      {data.targetRole && <div className={styles.subject}>{subjectLine}</div>}

      <div className={styles.body}>
        {paragraphs.length > 0 ? (
          paragraphs.map((p, i) => (
            <p key={i} className={styles.paragraph}>
              {p.split('\n').map((line, j, arr) => (
                <span key={j}>
                  {line}
                  {j < arr.length - 1 && <br />}
                </span>
              ))}
            </p>
          ))
        ) : (
          <p className={styles.placeholder}>{t('coverLetter.emptyPlaceholder')}</p>
        )}
      </div>
    </div>
  );
}
