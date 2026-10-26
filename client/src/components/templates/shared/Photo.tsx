import { useTranslation } from 'react-i18next';
import type { ResumeData } from '../../../types/resume';

interface PhotoProps {
  data: ResumeData;
  className?: string;
  /** Shown instead of the "no photo" hint, e.g. initials */
  fallback?: string;
}

/**
 * The photo, or a hint to upload one. The hint's `photoPlaceholder` class
 * makes print.css drop the whole frame from the PDF.
 */
export default function Photo({ data, className, fallback }: PhotoProps) {
  const { t } = useTranslation('templates');
  const { photo, fullName } = data.personalInfo;
  return (
    <div className={`${className ?? ''} resume-photo`}>
      {photo ? (
        <img src={photo} alt={fullName} />
      ) : fallback ? (
        <span>{fallback}</span>
      ) : (
        <span className="photoPlaceholder">{t('noPhoto')}</span>
      )}
    </div>
  );
}
