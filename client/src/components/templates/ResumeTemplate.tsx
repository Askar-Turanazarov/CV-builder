import { getResumeLanguage, type ResumeData } from '../../types/resume';
import { getTemplateComponent } from './templateRegistry';
import ResumeI18n from './shared/ResumeI18n';

/** Renders the resume's chosen template in the resume's own language. */
export default function ResumeTemplate({ data }: { data: ResumeData }) {
  const lang = getResumeLanguage(data);
  const TemplateComponent = getTemplateComponent(data.selectedTemplateId);
  return (
    <ResumeI18n lang={lang}>
      {/* Templates format dates by data.uiLanguage */}
      <TemplateComponent data={lang === data.uiLanguage ? data : { ...data, uiLanguage: lang }} />
    </ResumeI18n>
  );
}
