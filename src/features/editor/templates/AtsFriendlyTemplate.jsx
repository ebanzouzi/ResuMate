import CvPage from "./shared/CvPage";
import {
  CvSummaryBlock,
  CvLanguagesBlock,
  CvExperiencesBlock,
  CvEducationsBlock,
} from "./shared/CvBlocks";
import { fullName, hasText } from "./shared/formatters";

export default function AtsFriendlyTemplate({ cvData }) {
  const contact = [cvData.email, cvData.phone].filter(hasText).join("  ·  ");

  return (
    <CvPage variant="ats" className="px-[15mm] py-[14mm] text-left">
      <header className="text-center border-b border-gray-300 pb-4 mb-6">
        <h1 className="text-[22px] font-bold uppercase tracking-wide text-gray-900">
          {fullName(cvData)}
        </h1>
        {hasText(cvData.title) && (
          <p className="mt-1 text-[12px] font-semibold text-gray-700">
            {cvData.title}
          </p>
        )}
        {contact && (
          <p className="mt-2 text-[10px] text-gray-600">{contact}</p>
        )}
      </header>

      <div className="space-y-5 [&_.cv-section-title]:border-gray-400 [&_.cv-section-title]:text-gray-800 [&_.cv-entry-subtitle]:text-gray-700">
        <CvSummaryBlock summary={cvData.summary} />
        <CvExperiencesBlock experiences={cvData.experiences} />
        <CvEducationsBlock educations={cvData.educations} />
        {cvData.skills?.length > 0 && (
          <section>
            <h3 className="cv-section-title text-gray-800 border-gray-400">
              Compétences
            </h3>
            <p className="text-[11px] text-gray-800 leading-relaxed">
              {cvData.skills.join(" · ")}
            </p>
          </section>
        )}
        <CvLanguagesBlock languages={cvData.languages} />
      </div>
    </CvPage>
  );
}
