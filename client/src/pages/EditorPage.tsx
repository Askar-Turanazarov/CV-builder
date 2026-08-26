import { useNavigate } from 'react-router-dom';
import FormWizard from '../components/form/FormWizard';
import LivePreviewPanel from '../components/form/LivePreviewPanel';
import styles from './EditorPage.module.css';

export default function EditorPage() {
  const navigate = useNavigate();

  return (
    <div className={`container ${styles.grid}`}>
      <FormWizard onFinish={() => navigate('/preview')} />
      <LivePreviewPanel />
    </div>
  );
}
