import { useNavigate } from 'react-router-dom';
import FormWizard from '../components/form/FormWizard';

export default function EditorPage() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <FormWizard onFinish={() => navigate('/preview')} />
    </div>
  );
}
