import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Button from './Button';
import styles from './PhotoUpload.module.css';

interface PhotoUploadProps {
  photo: string | null;
  onFileSelected: (file: File | null) => void;
  isProcessing?: boolean;
  error?: string | null;
}

export default function PhotoUpload({ photo, onFileSelected, isProcessing, error }: PhotoUploadProps) {
  const { t } = useTranslation('common');
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={styles.wrapper}>
      <div className={styles.preview}>
        {photo ? <img src={photo} alt="" /> : <span className={styles.placeholder}>{t('actions.addPhoto')}</span>}
      </div>
      <div className={styles.actions}>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className={styles.hiddenInput}
          onChange={(e) => {
            onFileSelected(e.target.files?.[0] ?? null);
            e.target.value = '';
          }}
        />
        <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()} disabled={isProcessing}>
          {t('actions.addPhoto')}
        </Button>
        {photo && (
          <Button type="button" variant="ghost" onClick={() => onFileSelected(null)}>
            {t('actions.removePhoto')}
          </Button>
        )}
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
