import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../store/resumeStore';
import { getTemplateComponent } from '../components/templates/templateRegistry';
import TemplateSwitcher from '../components/theme/TemplateSwitcher';
import ThemeSwitcher from '../components/theme/ThemeSwitcher';
import ColorModeToggle from '../components/theme/ColorModeToggle';
import ViewModeToggle from '../components/theme/ViewModeToggle';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import ErrorBanner from '../components/common/ErrorBanner';
import { printResume, downloadPdf } from '../lib/pdfExport';
import styles from './PreviewPage.module.css';

export default function PreviewPage() {
  const { t } = useTranslation('common');
  const data = useResumeStore((s) => s.data);
  const setViewMode = useResumeStore((s) => s.setViewMode);
  const TemplateComponent = getTemplateComponent(data.selectedTemplateId);

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

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

  return (
    <div>
      <div className={`${styles.controls} preview-controls no-print`}>
        <div className={styles.controlsRow}>
          <TemplateSwitcher />
          <ThemeSwitcher />
          <ColorModeToggle />
          <ViewModeToggle />
        </div>
        <div className={styles.pdfActions}>
          <Button onClick={handleDownloadPdf} disabled={isDownloading}>
            {isDownloading ? (
              <>
                <Spinner /> {t('actions.downloadingPdf')}
              </>
            ) : (
              t('actions.downloadPdf')
            )}
          </Button>
          <Button variant="secondary" onClick={handlePrint} title={t('actions.printHint')}>
            {t('actions.print')}
          </Button>
        </div>
        {downloadError && <ErrorBanner message={downloadError} />}
      </div>

      <div
        className={styles.stage}
        data-theme={data.selectedThemeId}
        data-color-mode={data.colorMode}
        data-view-mode={data.viewMode}
      >
        <div className={styles.stageInner}>
          <TemplateComponent data={data} />
        </div>
      </div>
    </div>
  );
}
