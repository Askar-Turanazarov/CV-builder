import { useCallback, useState } from 'react';
import { resizeAndCompressImage } from '../lib/imageResize';

export function usePhotoUpload(onChange: (dataUrl: string | null) => void) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File | null) => {
      if (!file) {
        onChange(null);
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Пожалуйста, выберите файл изображения');
        return;
      }
      setIsProcessing(true);
      setError(null);
      try {
        const dataUrl = await resizeAndCompressImage(file);
        onChange(dataUrl);
      } catch {
        setError('Не удалось обработать изображение');
      } finally {
        setIsProcessing(false);
      }
    },
    [onChange],
  );

  return { handleFile, isProcessing, error };
}
