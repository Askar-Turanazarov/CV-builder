import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../store/resumeStore';
import { getTemplateComponent } from '../components/templates/templateRegistry';
import Button from '../components/common/Button';
import styles from './ResumesPage.module.css';

export default function ResumesPage() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const resumes = useResumeStore((s) => s.resumes);
  const resumeNames = useResumeStore((s) => s.resumeNames);
  const activeResumeId = useResumeStore((s) => s.activeResumeId);
  const createResume = useResumeStore((s) => s.createResume);
  const duplicateResume = useResumeStore((s) => s.duplicateResume);
  const renameResume = useResumeStore((s) => s.renameResume);
  const deleteResume = useResumeStore((s) => s.deleteResume);
  const switchResume = useResumeStore((s) => s.switchResume);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  const ids = Object.keys(resumes);

  const handleCreate = () => {
    createResume(t('resumes.defaultName', { count: ids.length + 1 }));
    navigate('/editor');
  };

  const handleOpen = (id: string) => {
    switchResume(id);
    navigate('/editor');
  };

  const handleDuplicate = (id: string) => {
    const sourceName = resumeNames[id] ?? '';
    duplicateResume(id, t('resumes.copyName', { name: sourceName }));
  };

  const startRename = (id: string) => {
    setEditingId(id);
    setDraftName(resumeNames[id] ?? '');
  };

  const commitRename = (id: string) => {
    const trimmed = draftName.trim();
    if (trimmed) renameResume(id, trimmed);
    setEditingId(null);
  };

  const handleDeleteClick = (id: string) => {
    if (confirmingDeleteId === id) {
      deleteResume(id);
      setConfirmingDeleteId(null);
    } else {
      setConfirmingDeleteId(id);
    }
  };

  return (
    <div className="container">
      <div className={styles.header}>
        <h1 className={styles.title}>{t('resumes.title')}</h1>
        <Button onClick={handleCreate}>{t('resumes.create')}</Button>
      </div>

      <div className={styles.grid}>
        {ids.map((id) => {
          const resumeData = resumes[id];
          const TemplateComponent = getTemplateComponent(resumeData.selectedTemplateId);
          const isActive = id === activeResumeId;
          const isConfirmingDelete = confirmingDeleteId === id;

          return (
            <div key={id} className={`${styles.card} ${isActive ? styles.cardActive : ''}`}>
              {editingId === id ? (
                <input
                  className={styles.nameInput}
                  value={draftName}
                  autoFocus
                  onChange={(e) => setDraftName(e.target.value)}
                  onBlur={() => commitRename(id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitRename(id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                />
              ) : (
                <button type="button" className={styles.nameButton} onClick={() => startRename(id)}>
                  {resumeNames[id] ?? id} ✎
                </button>
              )}

              <div className={styles.previewFrame} onClick={() => handleOpen(id)}>
                <div
                  className={styles.previewScale}
                  data-theme={resumeData.selectedThemeId}
                  data-color-mode="light"
                >
                  <TemplateComponent data={resumeData} />
                </div>
              </div>

              <div className={styles.actions}>
                <button type="button" className={styles.actionButton} onClick={() => handleOpen(id)}>
                  {t('resumes.open')}
                </button>
                <button type="button" className={styles.actionButton} onClick={() => handleDuplicate(id)}>
                  {t('resumes.duplicate')}
                </button>
                <button
                  type="button"
                  className={`${styles.actionButton} ${isConfirmingDelete ? styles.actionButtonDanger : ''}`}
                  onClick={() => handleDeleteClick(id)}
                  onBlur={() => setConfirmingDeleteId(null)}
                >
                  {isConfirmingDelete ? t('resumes.confirmDelete') : t('resumes.delete')}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
