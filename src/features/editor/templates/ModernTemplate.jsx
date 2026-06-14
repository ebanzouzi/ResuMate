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

export default function ModernTemplate({ cvData, profileImage }) {
  return (
    <CvPage className="flex min-h-[297mm]">
      {/* Sidebar */}
      <aside className="w-[34%] shrink-0 bg-slate-900 text-white px-[10mm] py-[12mm] flex flex-col gap-1">
        {profileImage && (
          <div className="mb-4 flex justify-center">
            <div className="h-[22mm] w-[22mm] overflow-hidden rounded-full ring-2 ring-indigo-400/80 ring-offset-2 ring-offset-slate-900">
              <img
                src={profileImage}
                alt="Profil"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}

        <CvContactLines
          email={cvData.email}
          phone={cvData.phone}
          light
        />

        <div className="mt-5 space-y-5">
          <CvSkillsBlock skills={cvData.skills} light darkTags />
          <CvLanguagesBlock languages={cvData.languages} light />
          <CvEducationsBlock educations={cvData.educations} light />
        </div>
      </aside>

      {/* Main column */}
      <main className="flex-1 px-[12mm] py-[12mm] text-left bg-white">
        <header className="mb-6 border-b border-slate-200 pb-5">
          <h1 className="text-[26px] font-bold tracking-tight text-slate-900 leading-tight">
            {fullName(cvData)}
          </h1>
          {hasText(cvData.title) && (
            <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-indigo-600">
              {cvData.title}
            </p>
          )}
        </header>

        <CvSummaryBlock summary={cvData.summary} accent />
        <CvExperiencesBlock experiences={cvData.experiences} accent />
      </main>
    </CvPage>
  );
}
