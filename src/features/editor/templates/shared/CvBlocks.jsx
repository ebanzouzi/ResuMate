import CvSection from "./CvSection";
import { hasItems, hasText } from "./formatters";

export function CvSummaryBlock({ summary, accent, light, className = "" }) {
  if (!hasText(summary)) return null;

  return (
    <CvSection title="Profil" accent={accent} light={light} className={className}>
      <p
        className={`leading-relaxed ${light ? "text-slate-300" : "text-slate-600"}`}
      >
        {summary}
      </p>
    </CvSection>
  );
}

export function CvSkillsBlock({
  skills,
  accent,
  light,
  darkTags = false,
  className = "",
}) {
  if (!hasItems(skills)) return null;

  return (
    <CvSection
      title="Compétences"
      accent={accent}
      light={light}
      className={className}
    >
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill) => (
          <span
            key={skill}
            className={darkTags ? "cv-skill-tag cv-skill-tag--dark" : "cv-skill-tag"}
          >
            {skill}
          </span>
        ))}
      </div>
    </CvSection>
  );
}

export function CvLanguagesBlock({ languages, accent, light, className = "" }) {
  if (!hasItems(languages)) return null;

  return (
    <CvSection title="Langues" accent={accent} light={light} className={className}>
      <ul className={`space-y-1.5 ${light ? "text-slate-300" : "text-slate-600"}`}>
        {languages.map((lang) => (
          <li key={lang.id} className="flex justify-between gap-3 text-[10px]">
            <span className="font-medium">{lang.name || "—"}</span>
            <span className={light ? "text-slate-400" : "text-slate-400"}>
              {lang.level}
            </span>
          </li>
        ))}
      </ul>
    </CvSection>
  );
}

export function CvExperiencesBlock({
  experiences,
  accent,
  light,
  className = "",
}) {
  if (!hasItems(experiences)) return null;

  return (
    <CvSection
      title="Expérience professionnelle"
      accent={accent}
      light={light}
      className={className}
    >
      <div className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="group">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="cv-entry-title">{exp.role || "Poste"}</p>
                <p className={`text-[10px] font-medium mt-0.5 ${accent ? "text-indigo-600" : "text-slate-500"}`}>
                  {exp.company || "Entreprise"}
                </p>
              </div>
              {exp.period && (
                <span className="cv-entry-meta">{exp.period}</span>
              )}
            </div>
            {hasText(exp.description) && (
              <p className="cv-entry-body whitespace-pre-line">{exp.description}</p>
            )}
          </div>
        ))}
      </div>
    </CvSection>
  );
}

export function CvEducationsBlock({
  educations,
  accent,
  light,
  className = "",
}) {
  if (!hasItems(educations)) return null;

  return (
    <CvSection title="Formation" accent={accent} light={light} className={className}>
      <div className="space-y-3">
        {educations.map((edu) => (
          <div key={edu.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="cv-entry-title">{edu.degree || "Diplôme"}</p>
                <p
                  className={`text-[10px] mt-0.5 ${light ? "text-slate-400" : "text-slate-500"}`}
                >
                  {edu.school || "Établissement"}
                </p>
              </div>
              {edu.period && (
                <span className="cv-entry-meta">{edu.period}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </CvSection>
  );
}
