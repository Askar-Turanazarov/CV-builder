import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../store/resumeStore';
import { generateCoverLetter } from '../lib/api';
import { downloadCoverLetter } from '../lib/coverLetterExport';
import CoverLetterDocument from '../components/coverLetter/CoverLetterDocument';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import ErrorBanner from '../components/common/ErrorBanner';
import type { CoverLetterContent } from '../types/resume';
import styles from './CoverLetterPage.module.css';

export default function CoverLetterPage() {
  const { t } = useTranslation('insights');
  const data = useResumeStore((s) => s.data);
  const setCoverLetter = useResumeStore((s) => s.setCoverLetter);

  const coverLetter = data.coverLetter;
  const targetRole = coverLetter?.targetRole ?? '';
  const targetCompany = coverLetter?.targetCompany ?? '';
  const content = coverLetter?.content ?? '';

  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const patchCoverLetter = (patch: Partial<CoverLetterContent>) => {
    const base: CoverLetterContent = coverLetter ?? { content: '', targetRole: '', targetCompany: '', generatedAt: null };
    setCoverLetter({ ...base, ...patch });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerateError(null);
    try {
      const result = await generateCoverLetter({
        uiLanguage: data.uiLanguage,
        fullName: data.personalInfo.fullName,
        jobTitle: data.personalInfo.jobTitle,
        targetRole,
        targetCompany,
        summary: data.aiContent?.summary ?? '',
        strengths: data.aiContent?.strengths ?? [],
        experience: data.experience.map((e) => ({
          position: e.position,
          company: e.company,
          description: e.description,
        })),
        skills: data.skills.map((s) => s.name),
      });
      setCoverLetter({ content: result.content, targetRole, targetCompany, generatedAt: result.generatedAt });
    } catch {
      setGenerateError(t('coverLetter.generateError'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadError(null);
    try {
      await downloadCoverLetter({
        fullName: data.personalInfo.fullName,
        email: data.contacts.email,
        phone: data.contacts.phone,
        location: data.contacts.location,
        content,
        targetRole,
        targetCompany,
        selectedThemeId: data.selectedThemeId,
        colorMode: data.colorMode,
        uiLanguage: data.uiLanguage,
      });
    } catch {
      setDownloadError(t('coverLetter.downloadError'));
    } finally {
      setIsDownloading(false);
    }
  };

  const dateIso = new Date().toISOString().slice(0, 10);

  return (
    <div className={`container ${styles.grid}`}>
      <div className={styles.formColumn}>
        <h1 className={styles.title}>{t('coverLetter.title')}</h1>
        <p className={styles.subtitle}>{t('coverLetter.subtitle')}</p>

        <label className={styles.field}>
          <span className={styles.label}>{t('coverLetter.targetRoleLabel')}</span>
          <input
            type="text"
            className={styles.input}
            placeholder={t('coverLetter.targetRolePlaceholder')}
            value={targetRole}
            onChange={(e) => patchCoverLetter({ targetRole: e.target.value })}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t('coverLetter.targetCompanyLabel')}</span>
          <input
            type="text"
            className={styles.input}
            placeholder={t('coverLetter.targetCompanyPlaceholder')}
            value={targetCompany}
            onChange={(e) => patchCoverLetter({ targetCompany: e.target.value })}
          />
        </label>

        <Button onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Spinner /> {t('coverLetter.generating')}
            </>
          ) : coverLetter ? (
            t('coverLetter.regenerate')
          ) : (
            t('coverLetter.generate')
          )}
        </Button>
        {generateError && <ErrorBanner message={generateError} />}

        <label className={styles.field}>
          <span className={styles.label}>{t('coverLetter.editableLabel')}</span>
          <textarea
            className={styles.textarea}
            value={content}
            placeholder={coverLetter ? undefined : t('coverLetter.noContentHint')}
            onChange={(e) => patchCoverLetter({ content: e.target.value })}
            rows={14}
          />
        </label>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={handleDownload} disabled={isDownloading || content.trim() === ''}>
            {isDownloading ? (
              <>
                <Spinner /> {t('coverLetter.downloadingPdf')}
              </>
            ) : (
              t('coverLetter.downloadPdf')
            )}
          </Button>
        </div>
        {downloadError && <ErrorBanner message={downloadError} />}
      </div>

      <div className={styles.previewColumn}>
        <div className={styles.sticky}>
          <div
            className="resume-frame"
            data-theme={data.selectedThemeId}
            data-color-mode={data.colorMode}
          >
            <CoverLetterDocument
              data={{
                fullName: data.personalInfo.fullName,
                email: data.contacts.email,
                phone: data.contacts.phone,
                location: data.contacts.location,
                content,
                targetRole,
                targetCompany,
                uiLanguage: data.uiLanguage,
                dateIso,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
