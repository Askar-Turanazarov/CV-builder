import { useResumeStore } from '../../store/resumeStore';
import { getTemplateComponent } from '../templates/templateRegistry';
import styles from './LivePreviewPanel.module.css';

// Read-only reflection of the resume being edited, shown next to the form
// wizard on wide screens — same rendering approach as PreviewPage.tsx
// (getTemplateComponent + data-theme/data-color-mode), but no template/
// theme controls here: those stay exclusively on /preview.
export default function LivePreviewPanel() {
  const data = useResumeStore((s) => s.data);
  const TemplateComponent = getTemplateComponent(data.selectedTemplateId);

  return (
    <div className={styles.panel}>
      <div className={styles.sticky}>
        <div className={styles.frame} data-theme={data.selectedThemeId} data-color-mode={data.colorMode}>
          <div className="resume-frame">
            <TemplateComponent data={{ ...data, viewMode: 'document' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
