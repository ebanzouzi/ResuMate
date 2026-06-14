import CvPage from "./shared/CvPage";
import CvContactLines from "./shared/CvContactLines";
import {
  CvSummaryBlock,
  CvSkillsBlock,
  CvLanguagesBlock,
  CvExperiencesBlock,
  CvEducationsBlock,
} from "./shared/CvBlocks";
import { fullName, hasText } from "./shared/formatters";

export default function MinimalTemplate({ cvData, profileImage }) {
  return (
    <CvPage variant="serif" className="px-[14mm] py-[14mm] text-left">
      <header className="flex items-start justify-between gap-6 border-b border-stone-300 pb-6 mb-7">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-stone-900 leading-none">
            {fullName(cvData)}
          </h1>
          {hasText(cvData.title) && (
            <p className="mt-2 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
              {cvData.title}
            </p>
          )}
          <div className="mt-4 font-sans">
            <CvContactLines email={cvData.email} phone={cvData.phone} />
          </div>
        </div>
        {profileImage && (
          <img
            src={profileImage}
            alt="Profil"
            className="h-[24mm] w-[24mm] shrink-0 rounded-sm border border-stone-200 object-cover grayscale"
          />
        )}
      </header>

      <div className="space-y-6 font-sans">
        <CvSummaryBlock summary={cvData.summary} />
        <CvExperiencesBlock experiences={cvData.experiences} />
        <div className="grid grid-cols-2 gap-8">
          <CvEducationsBlock educations={cvData.educations} />
          <CvSkillsBlock skills={cvData.skills} />
        </div>
        <CvLanguagesBlock languages={cvData.languages} />
      </div>
    </CvPage>
  );
}
