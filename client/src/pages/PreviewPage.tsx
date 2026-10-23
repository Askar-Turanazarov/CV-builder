import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../store/resumeStore';
import { getTemplateComponent } from '../components/templates/templateRegistry';
import TemplateSwitcher from '../components/theme/TemplateSwitcher';
import ThemeSwitcher from '../components/theme/ThemeSwitcher';
import ViewModeToggle from '../components/theme/ViewModeToggle';
import Button from '../components/common/Button';
import PdfProgressOverlay from '../components/common/PdfProgressOverlay';
import ErrorBanner from '../components/common/ErrorBanner';
import ResumeInsightsPanel from '../components/preview/ResumeInsightsPanel';
import { printResume, downloadPdf } from '../lib/pdfExport';
import { copyResumeAsText } from '../lib/textExport';
import { warmUpPdf } from '../lib/api';
import { getSampleResume, isResumeEmpty } from '../data/sampleResume';
import styles from './PreviewPage.module.css';

export default function PreviewPage() {
  const { t } = useTranslation('common');
  const data = useResumeStore((s) => s.data);
  const setViewMode = useResumeStore((s) => s.setViewMode);
  const TemplateComponent = getTemplateComponent(data.selectedTemplateId);
  // An empty resume renders as a blank page; show the chosen template with
  // sample content instead, clearly marked as an example.
  const isEmpty = isResumeEmpty(data);
  const shownData = useMemo(() => (isEmpty ? getSampleResume(data.uiLanguage, data) : data), [isEmpty, data]);

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');

  useEffect(warmUpPdf, []);

  const handlePrint = () => printResume(data.viewMode, setViewMode);

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    setDownloadError(null);
    try {
      await downloadPdf(data);
    } catch {
      setDownloadError(t('errors.pdfFailed'));
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyText = async () => {
    try {
      await copyResumeAsText(data);
      setCopyState('copied');
    } catch {
      setCopyState('error');
    } finally {
      setTimeout(() => setCopyState('idle'), 2000);
    }
  };

  return (
    <div>
      <div className={`container ${styles.controls} preview-controls no-print`}>
        <div className={styles.controlsRow}>
          <TemplateSwitcher />
          <ThemeSwitcher />
          <ViewModeToggle />
        </div>
        <div className={styles.pdfActions}>
          <Button onClick={handleDownloadPdf} disabled={isDownloading}>
            {isDownloading ? t('actions.downloadingPdf') : t('actions.downloadPdf')}
          </Button>
          <Button variant="secondary" onClick={handlePrint} title={t('actions.printHint')}>
            {t('actions.print')}
          </Button>
          <Button variant="ghost" onClick={handleCopyText}>
            {copyState === 'copied' ? `✓ ${t('actions.copied')}` : copyState === 'error' ? t('actions.copyFailed') : t('actions.copyText')}
          </Button>
        </div>
        {downloadError && <ErrorBanner message={downloadError} />}
        <PdfProgressOverlay active={isDownloading} />
      </div>

      <div
        className={styles.stage}
        data-theme={data.selectedThemeId}
        data-color-mode={data.colorMode}
        data-view-mode={data.viewMode}
      >
        {isEmpty && (
          <div className={`container no-print`}>
            <div className={styles.sampleBanner}>
              <span>👀 {t('samplePreview.banner')}</span>
              <Link to="/editor">
                <Button variant="secondary">{t('samplePreview.cta')}</Button>
              </Link>
            </div>
          </div>
        )}
        <div className={`container ${styles.stageGrid}`}>
          <div className="resume-frame">
            <TemplateComponent data={shownData} />
          </div>
          <div className={`${styles.insightsColumn} no-print`}>
            <ResumeInsightsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
