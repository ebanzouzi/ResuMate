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

export default function CreativeTemplate({ cvData, profileImage }) {
  return (
    <CvPage className="flex min-h-[297mm]">
      <aside className="relative w-[32%] shrink-0 bg-slate-950 px-[9mm] py-[12mm] text-white">
        <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-amber-400 via-amber-500 to-orange-500" />

        {profileImage && (
          <div className="mb-5 flex justify-center">
            <img
              src={profileImage}
              alt="Profil"
              className="h-[26mm] w-[26mm] rounded-xl border-2 border-amber-400/90 object-cover shadow-lg"
            />
          </div>
        )}

        <div className="text-center mb-6">
          <h2 className="text-[15px] font-bold leading-snug">{fullName(cvData)}</h2>
          {hasText(cvData.title) && (
            <p className="mt-1 text-[10px] font-medium text-amber-400">
              {cvData.title}
            </p>
          )}
        </div>

        <CvContactLines email={cvData.email} phone={cvData.phone} light />

        <div className="mt-6 space-y-5">
          <CvSkillsBlock skills={cvData.skills} light darkTags />
          <CvLanguagesBlock languages={cvData.languages} light />
        </div>
      </aside>

      <main className="flex-1 px-[11mm] py-[12mm] text-left bg-white">
        <CvSummaryBlock summary={cvData.summary} accent className="mb-6" />
        <CvExperiencesBlock experiences={cvData.experiences} accent />
        <CvEducationsBlock
          educations={cvData.educations}
          accent
          className="mt-6"
        />
      </main>
    </CvPage>
  );
}
