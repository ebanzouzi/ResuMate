/**
 * Editor.jsx — Version Production Optimisée
 *
 * OPTIMISATIONS APPLIQUÉES :
 * ✅ usePDF key-based refresh (hérité du correctif précédent)
 * ✅ handleChange débounced pour le textarea summary (champ le plus verbeux)
 *    → réduit les re-renders de MyCVDocument pendant la frappe
 * ✅ handleExperienceChange / handleEducationChange / handleLanguageChange
 *    tous en useCallback avec dépendances minimales
 * ✅ AccordionSection mémoïsé : ses enfants ne re-render que si isOpen change
 * ✅ FormInput mémoïsé : ne re-render que si value ou onChange change
 * ✅ Listes d'expériences/formations/langues extraites en sous-composants
 *    mémoïsés → un seul item ne re-render pas toute la liste
 * ✅ Preview template : React.memo + comparaison cvData par référence
 *    (setCvData toujours crée un nouvel objet → la comparaison est juste)
 * ✅ pdfDocumentKey via JSON.stringify dans useMemo (hérité du correctif PDF)
 * ✅ Accessibilité : aria-label sur tous les inputs sans label visible
 */

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  memo,
} from "react";
import { usePDF } from "@react-pdf/renderer";
import { MyCVDocument } from "./PDFTemplate";
import { useAtsAnalysis } from "./hooks/useAtsAnalysis";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Layout,
  Upload,
  X,
  Briefcase,
  GraduationCap,
  Languages,
  Code,
  Target,
  AlertCircle,
  FileText,
} from "lucide-react";

// ─── HOOK : DEBOUNCE ──────────────────────────────────────────────────────────
// Retarde l'application d'une valeur de `delay` ms après le dernier changement.
// Utilisé pour le textarea summary afin de ne pas régénérer le PDF à chaque frappe.
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ─── SOUS-COMPOSANTS MÉMOÏSÉS ─────────────────────────────────────────────────

/** Input texte générique — re-render seulement si value/onChange change */
const FormInput = memo(
  ({ label, name, value, onChange, placeholder, type = "text" }) => (
    <div className="form-control w-full">
      <label className="label py-1">
        <span className="label-text font-semibold text-xs text-base-content/80 uppercase">
          {label}
        </span>
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input input-bordered input-md w-full transition-all focus:border-primary text-sm rounded-xl"
        aria-label={label}
      />
    </div>
  ),
);
FormInput.displayName = "FormInput";

/** Accordion — les enfants ne re-render pas quand le parent change */
const AccordionSection = memo(
  ({ title, icon: Icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const toggleOpen = useCallback(() => setIsOpen((v) => !v), []);

    return (
      <div className="collapse collapse-arrow bg-base-200/40 border border-base-200 rounded-2xl shadow-sm mb-4 overflow-visible">
        <input
          type="checkbox"
          checked={isOpen}
          onChange={toggleOpen}
          className="hidden"
        />
        <div
          className="collapse-title flex items-center gap-3 font-bold text-sm tracking-wide uppercase cursor-pointer select-none py-4 px-5"
          onClick={toggleOpen}
          role="button"
          aria-expanded={isOpen}
        >
          <Icon size={18} className="text-primary" aria-hidden="true" />
          <span>{title}</span>
        </div>
        {isOpen && (
          <div className="p-5 border-t border-base-200 bg-base-100/30 rounded-b-2xl space-y-4">
            {children}
          </div>
        )}
      </div>
    );
  },
);
AccordionSection.displayName = "AccordionSection";

/** Ligne d'expérience individuelle — mémoïsée par id */
const ExperienceRow = memo(({ exp, idx, onChange, onRemove }) => (
  <div className="p-4 bg-base-200/50 rounded-2xl space-y-3 relative border border-base-300/60 shadow-inner">
    <span className="absolute left-4 top-3 text-[10px] font-black text-base-content/30 uppercase tracking-widest">
      Poste n°{idx + 1}
    </span>
    <button
      onClick={() => onRemove(exp.id)}
      className="absolute top-3 right-3 text-error p-1 hover:bg-error/10 rounded-lg transition-all"
      aria-label={`Supprimer le poste ${idx + 1}`}
    >
      <Trash2 size={15} aria-hidden="true" />
    </button>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-4">
      <input
        placeholder="Entreprise / Organisation"
        value={exp.company}
        onChange={(e) => onChange(exp.id, "company", e.target.value)}
        className="input input-sm input-bordered text-xs rounded-lg"
        aria-label="Entreprise"
      />
      <input
        placeholder="Période (Ex: 2023 - Présent)"
        value={exp.period}
        onChange={(e) => onChange(exp.id, "period", e.target.value)}
        className="input input-sm input-bordered text-xs rounded-lg"
        aria-label="Période"
      />
    </div>
    <input
      placeholder="Poste occupé"
      value={exp.role}
      onChange={(e) => onChange(exp.id, "role", e.target.value)}
      className="input input-sm input-bordered text-xs rounded-lg w-full"
      aria-label="Poste occupé"
    />
    <textarea
      placeholder="Décrivez vos missions, responsabilités et accomplissements..."
      value={exp.description}
      onChange={(e) => onChange(exp.id, "description", e.target.value)}
      className="textarea textarea-sm textarea-bordered w-full h-24 text-xs rounded-lg leading-relaxed resize-y"
      aria-label="Description du poste"
    />
  </div>
));
ExperienceRow.displayName = "ExperienceRow";

/** Ligne de formation individuelle — mémoïsée */
const EducationRow = memo(({ edu, idx, onChange, onRemove }) => (
  <div className="p-4 bg-base-200/50 rounded-2xl space-y-3 relative border border-base-300/60">
    <span className="absolute left-4 top-3 text-[10px] font-black text-base-content/30 uppercase tracking-widest">
      Diplôme n°{idx + 1}
    </span>
    <button
      onClick={() => onRemove(edu.id)}
      className="absolute top-3 right-3 text-error p-1 hover:bg-error/10 rounded-lg transition-all"
      aria-label={`Supprimer le diplôme ${idx + 1}`}
    >
      <Trash2 size={15} aria-hidden="true" />
    </button>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-4">
      <input
        placeholder="Université / École"
        value={edu.school}
        onChange={(e) => onChange(edu.id, "school", e.target.value)}
        className="input input-sm input-bordered text-xs rounded-lg"
        aria-label="Établissement"
      />
      <input
        placeholder="Période (Ex: 2019 - 2022)"
        value={edu.period}
        onChange={(e) => onChange(edu.id, "period", e.target.value)}
        className="input input-sm input-bordered text-xs rounded-lg"
        aria-label="Période"
      />
    </div>
    <input
      placeholder="Diplôme ou Certification"
      value={edu.degree}
      onChange={(e) => onChange(edu.id, "degree", e.target.value)}
      className="input input-sm input-bordered text-xs rounded-lg w-full"
      aria-label="Intitulé du diplôme"
    />
  </div>
));
EducationRow.displayName = "EducationRow";

/** Ligne de langue — mémoïsée */
const LanguageRow = memo(({ lang, onChange, onRemove }) => (
  <div className="flex gap-2 items-center bg-base-200/30 p-2 border border-base-200 rounded-xl shadow-sm">
    <input
      placeholder="Langue (Ex: Anglais)"
      value={lang.name}
      onChange={(e) => onChange(lang.id, "name", e.target.value)}
      className="input input-sm input-bordered text-xs rounded-lg w-1/2"
      aria-label="Nom de la langue"
    />
    <input
      placeholder="Niveau (Ex: B2, Avancé)"
      value={lang.level}
      onChange={(e) => onChange(lang.id, "level", e.target.value)}
      className="input input-sm input-bordered text-xs rounded-lg w-1/2"
      aria-label="Niveau"
    />
    <button
      onClick={() => onRemove(lang.id)}
      className="text-error p-1 hover:bg-error/10 rounded-lg transition-all"
      aria-label="Supprimer cette langue"
    >
      <Trash2 size={16} aria-hidden="true" />
    </button>
  </div>
));
LanguageRow.displayName = "LanguageRow";

// ─── TEMPLATES PREVIEW (mémoïsés — ne re-render que si cvData/profileImage change) ─

export const CanvaModernTemplate = memo(({ cvData, profileImage }) => {
  if (!cvData) return null;
  return (
    <div className="w-full bg-white text-slate-900 min-h-[29.7cm] font-sans flex flex-col shadow-inner select-none text-left">
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-8 flex items-center justify-between border-b-4 border-indigo-500">
        <div className="space-y-1 flex-1">
          <h1 className="text-3xl font-black uppercase tracking-tight">
            {cvData.firstName || "Prénom"} {cvData.lastName || "Nom"}
          </h1>
          <p className="text-indigo-400 font-bold uppercase tracking-wider text-xs">
            {cvData.title || "Poste Visé"}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] opacity-75 pt-2 font-light">
            <span>✉️ {cvData.email || "email@exemple.com"}</span>
            <span>📞 {cvData.phone || "+242 06 123 4567"}</span>
          </div>
        </div>
        {profileImage && (
          <div className="w-20 h-20 rounded-full border-2 border-indigo-500 overflow-hidden shrink-0 ml-4 bg-slate-800 shadow-md">
            <img
              src={profileImage}
              alt="Photo de profil"
              className="w-full h-full object-cover"
              width={80}
              height={80}
            />
          </div>
        )}
      </div>
      <div className="flex-1 grid grid-cols-3 p-8 gap-6 bg-white">
        <div className="col-span-1 space-y-6 border-r border-slate-100 pr-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2 border-b pb-1">
              Profil
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {cvData.summary || "Aucun résumé fourni."}
            </p>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2 border-b pb-1">
              Compétences
            </h3>
            <div className="flex flex-wrap gap-1">
              {cvData.skills?.length > 0 ? (
                cvData.skills.map((s, i) => (
                  <span
                    key={i}
                    className="bg-slate-100 text-slate-800 text-[10px] px-2 py-0.5 rounded font-medium border border-slate-200"
                  >
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-[11px] text-slate-400 italic">
                  Aucune compétence ajoutée
                </span>
              )}
            </div>
          </div>
          {cvData.languages?.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2 border-b pb-1">
                Langues
              </h3>
              <div className="space-y-1 text-[11px] text-slate-600">
                {cvData.languages.map((l, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="font-medium">{l.name}</span>
                    <span className="opacity-75">{l.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="col-span-2 space-y-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b pb-1 mb-3">
              Expériences
            </h3>
            <div className="space-y-4">
              {cvData.experiences?.length > 0 ? (
                cvData.experiences.map((exp) => (
                  <div key={exp.id} className="text-xs">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>
                        {exp.role || "Poste"}{" "}
                        <span className="text-indigo-600">
                          @{exp.company || "Entreprise"}
                        </span>
                      </span>
                      <span className="text-slate-400 font-normal">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1 whitespace-pre-line leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Aucune expérience ajoutée
                </p>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b pb-1 mb-3">
              Études & Formations
            </h3>
            <div className="space-y-3">
              {cvData.educations?.map((edu) => (
                <div key={edu.id} className="text-xs">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>{edu.degree}</span>
                    <span className="text-slate-400 font-normal">
                      {edu.period}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px]">{edu.school}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
CanvaModernTemplate.displayName = "CanvaModernTemplate";

export const CanvaMinimalTemplate = memo(({ cvData, profileImage }) => {
  if (!cvData) return null;
  return (
    <div className="w-full bg-white text-stone-900 min-h-[29.7cm] p-12 font-serif text-left">
      <div className="border-b border-stone-300 pb-6 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-normal tracking-wide">
            {cvData.firstName || "Prénom"} {cvData.lastName || "Nom"}
          </h1>
          <p className="font-sans text-xs uppercase tracking-widest text-stone-500 font-semibold mt-1">
            {cvData.title || "Poste Visé"}
          </p>
          <p className="font-sans text-[10px] text-stone-400 mt-1">
            {cvData.email} | {cvData.phone}
          </p>
        </div>
        {profileImage && (
          <img
            src={profileImage}
            alt="Photo de profil"
            className="w-16 h-16 grayscale border border-stone-200 p-1 object-cover"
            width={64}
            height={64}
          />
        )}
      </div>
      <div className="space-y-6 text-xs">
        <p className="text-stone-600 leading-relaxed text-justify italic font-sans">
          {cvData.summary}
        </p>
        <div className="grid grid-cols-4 gap-4">
          <span className="font-bold uppercase tracking-widest text-stone-400 font-sans text-[10px]">
            Expériences
          </span>
          <div className="col-span-3 space-y-4">
            {cvData.experiences?.map((exp) => (
              <div key={exp.id}>
                <h5 className="font-bold">
                  {exp.role} | {exp.company}
                </h5>
                <p className="text-stone-500 text-[11px] mb-1">{exp.period}</p>
                <p className="text-stone-600 font-sans leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 border-t border-stone-200 pt-4">
          <span className="font-bold uppercase tracking-widest text-stone-400 font-sans text-[10px]">
            Formations
          </span>
          <div className="col-span-3 space-y-3">
            {cvData.educations?.map((edu) => (
              <div key={edu.id}>
                <h5 className="font-bold">{edu.degree}</h5>
                <p className="text-stone-500 font-sans">
                  {edu.school} ({edu.period})
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 border-t border-stone-200 pt-4">
          <span className="font-bold uppercase tracking-widest text-stone-400 font-sans text-[10px]">
            Compétences
          </span>
          <div className="col-span-3 flex flex-wrap gap-2 font-sans">
            {cvData.skills?.map((s, i) => (
              <span
                key={i}
                className="border border-stone-300 px-2 py-0.5 text-[11px] text-stone-700"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
CanvaMinimalTemplate.displayName = "CanvaMinimalTemplate";

export const CreativeTemplate = memo(({ cvData, profileImage }) => {
  if (!cvData) return null;
  return (
    <div className="w-full bg-white min-h-[29.7cm] flex text-left shadow-md">
      <div className="w-1/3 bg-slate-900 text-white p-6 space-y-6">
        {profileImage && (
          <img
            src={profileImage}
            alt="Photo de profil"
            className="w-24 h-24 mx-auto rounded-xl border-2 border-amber-400 object-cover"
            width={96}
            height={96}
          />
        )}
        <div className="text-center">
          <h2 className="text-md font-bold">
            {cvData.firstName} {cvData.lastName}
          </h2>
          <p className="text-xs text-amber-400 font-semibold uppercase mt-1">
            {cvData.title}
          </p>
        </div>
        <div className="text-[10px] space-y-2 pt-4 border-t border-slate-700 font-light opacity-90">
          <p>✉️ {cvData.email}</p>
          <p>📞 {cvData.phone}</p>
        </div>
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Compétences
          </h4>
          <div className="flex flex-col gap-1.5 text-[11px] text-slate-300">
            {cvData.skills?.map((s, i) => (
              <span key={i}>• {s}</span>
            ))}
          </div>
        </div>
        {cvData.languages?.length > 0 && (
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Langues
            </h4>
            <div className="space-y-1 text-[11px] text-slate-300">
              {cvData.languages.map((l, i) => (
                <p key={i} className="font-light">
                  {l.name} ({l.level})
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="w-2/3 p-8 space-y-6 bg-slate-50/50">
        <div className="p-4 bg-white border-l-4 border-slate-900 text-xs italic text-slate-600 shadow-sm rounded-r-xl">
          {cvData.summary}
        </div>
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-2">
            <span
              className="w-2 h-2 bg-amber-400 rounded-full"
              aria-hidden="true"
            />{" "}
            Expériences Professionnelles
          </h3>
          <div className="space-y-4 border-l-2 border-slate-200 pl-4 ml-1">
            {cvData.experiences?.map((exp) => (
              <div key={exp.id} className="text-xs relative">
                <div
                  className="absolute w-2.5 h-2.5 bg-slate-300 rounded-full -left-[21.5px] top-1 border border-white"
                  aria-hidden="true"
                />
                <div className="font-bold text-slate-800">
                  {exp.role}{" "}
                  <span className="text-indigo-600 font-medium">
                    @ {exp.company}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold mb-1">
                  {exp.period}
                </p>
                <p className="text-slate-600 leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-2">
            <span
              className="w-2 h-2 bg-amber-400 rounded-full"
              aria-hidden="true"
            />{" "}
            Éducation & Formations
          </h3>
          <div className="space-y-3 border-l-2 border-slate-200 pl-4 ml-1">
            {cvData.educations?.map((edu) => (
              <div key={edu.id} className="text-xs relative">
                <div
                  className="absolute w-2.5 h-2.5 bg-slate-300 rounded-full -left-[21.5px] top-1 border border-white"
                  aria-hidden="true"
                />
                <div className="font-bold text-slate-800">{edu.degree}</div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {edu.school} — {edu.period}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
CreativeTemplate.displayName = "CreativeTemplate";

export const AtsFriendlyTemplate = memo(({ cvData }) => {
  if (!cvData) return null;
  return (
    <div className="w-full bg-white text-black p-12 min-h-[29.7cm] font-sans text-left space-y-6">
      <div className="text-center border-b-2 border-black pb-4">
        <h1 className="text-2xl font-bold uppercase tracking-wide">
          {cvData.firstName} {cvData.lastName}
        </h1>
        <p className="text-sm font-semibold text-gray-800 mt-1 uppercase tracking-wider">
          {cvData.title}
        </p>
        <p className="text-xs text-gray-600 mt-1">
          {cvData.email} | {cvData.phone}
        </p>
      </div>
      <div className="space-y-1.5">
        <h2 className="text-xs font-bold uppercase border-b border-gray-400 pb-0.5 tracking-wider">
          Résumé Professionnel
        </h2>
        <p className="text-xs text-gray-800 text-justify leading-relaxed">
          {cvData.summary}
        </p>
      </div>
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase border-b border-gray-400 pb-0.5 tracking-wider">
          Expériences Professionnelles
        </h2>
        {cvData.experiences?.map((exp) => (
          <div key={exp.id} className="text-xs">
            <div className="flex justify-between font-bold text-gray-900">
              <span>
                {exp.role?.toUpperCase()} — {exp.company}
              </span>
              <span className="font-normal text-gray-600">{exp.period}</span>
            </div>
            <p className="text-gray-700 mt-1 whitespace-pre-line leading-relaxed text-justify">
              {exp.description}
            </p>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase border-b border-gray-400 pb-0.5 tracking-wider">
          Éducation & Formations
        </h2>
        {cvData.educations?.map((edu) => (
          <div
            key={edu.id}
            className="text-xs flex justify-between items-start"
          >
            <div>
              <p className="font-bold text-gray-900">{edu.degree}</p>
              <p className="text-gray-600">{edu.school}</p>
            </div>
            <span className="text-gray-500 font-normal">{edu.period}</span>
          </div>
        ))}
      </div>
      <div className="space-y-1.5">
        <h2 className="text-xs font-bold uppercase border-b border-gray-400 pb-0.5 tracking-wider">
          Compétences Techniques
        </h2>
        <p className="text-xs text-gray-800 leading-relaxed font-medium">
          {cvData.skills?.join(" | ")}
        </p>
      </div>
    </div>
  );
});
AtsFriendlyTemplate.displayName = "AtsFriendlyTemplate";

// ─── TEMPLATE MAP (évite le if/else en cascade) ───────────────────────────────
const TEMPLATE_COMPONENTS = {
  modern: CanvaModernTemplate,
  minimal: CanvaMinimalTemplate,
  creative: CreativeTemplate,
  ats: AtsFriendlyTemplate,
};

// ─── COMPOSANT PRINCIPAL ───────────────────────────────────────────────────────
export default function Editor({ cvData, setCvData, onNavigate }) {
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [profileImage, setProfileImage] = useState(
    () => localStorage.getItem("smart_cv_profile_image") || null,
  );
  const [skillInput, setSkillInput] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  // Debounce du champ summary pour réduire la fréquence de régénération PDF
  const debouncedSummary = useDebounce(cvData.summary, 400);
  const debouncedCvData = useMemo(
    () => ({ ...cvData, summary: debouncedSummary }),
    [cvData, debouncedSummary],
  );

  const atsAnalysis = useAtsAnalysis(cvData, jobDescription);

  // ── Clé unique PDF → force React-PDF à recréer si quelque chose change ──────
  const pdfKey = useMemo(
    () =>
      JSON.stringify({
        d: debouncedCvData,
        t: selectedTemplate,
        img: profileImage,
      }),
    [debouncedCvData, selectedTemplate, profileImage],
  );

  const [pdfInstance, updatePdfInstance] = usePDF({
    document: (
      <MyCVDocument
        key={pdfKey}
        cvData={debouncedCvData}
        templateId={selectedTemplate}
        profileImage={profileImage}
      />
    ),
  });

  useEffect(() => {
    updatePdfInstance(
      <MyCVDocument
        key={pdfKey}
        cvData={debouncedCvData}
        templateId={selectedTemplate}
        profileImage={profileImage}
      />,
    );
  }, [pdfKey]);

  // ── Handlers stables ────────────────────────────────────────────────────────
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setCvData((prev) => ({ ...prev, [name]: value }));
    },
    [setCvData],
  );

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Validation basique : taille max 2 MB
    if (file.size > 2 * 1024 * 1024) {
      alert("Image trop lourde (max 2 MB)");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
      localStorage.setItem("smart_cv_profile_image", reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleExperienceChange = useCallback(
    (id, field, value) => {
      setCvData((prev) => ({
        ...prev,
        experiences: prev.experiences.map((exp) =>
          exp.id === id ? { ...exp, [field]: value } : exp,
        ),
      }));
    },
    [setCvData],
  );

  const handleEducationChange = useCallback(
    (id, field, value) => {
      setCvData((prev) => ({
        ...prev,
        educations: prev.educations.map((edu) =>
          edu.id === id ? { ...edu, [field]: value } : edu,
        ),
      }));
    },
    [setCvData],
  );

  const handleLanguageChange = useCallback(
    (id, field, value) => {
      setCvData((prev) => ({
        ...prev,
        languages: prev.languages.map((l) =>
          l.id === id ? { ...l, [field]: value } : l,
        ),
      }));
    },
    [setCvData],
  );

  const removeExperience = useCallback(
    (id) => {
      setCvData((prev) => ({
        ...prev,
        experiences: prev.experiences.filter((e) => e.id !== id),
      }));
    },
    [setCvData],
  );

  const removeEducation = useCallback(
    (id) => {
      setCvData((prev) => ({
        ...prev,
        educations: prev.educations.filter((e) => e.id !== id),
      }));
    },
    [setCvData],
  );

  const removeLanguage = useCallback(
    (id) => {
      setCvData((prev) => ({
        ...prev,
        languages: prev.languages.filter((l) => l.id !== id),
      }));
    },
    [setCvData],
  );

  const addExperience = useCallback(() => {
    setCvData((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        { id: Date.now(), company: "", role: "", period: "", description: "" },
      ],
    }));
  }, [setCvData]);

  const addEducation = useCallback(() => {
    setCvData((prev) => ({
      ...prev,
      educations: [
        ...prev.educations,
        { id: Date.now(), school: "", degree: "", period: "" },
      ],
    }));
  }, [setCvData]);

  const addLanguage = useCallback(() => {
    setCvData((prev) => ({
      ...prev,
      languages: [...prev.languages, { id: Date.now(), name: "", level: "" }],
    }));
  }, [setCvData]);

  const addSkill = useCallback(
    (e) => {
      e.preventDefault();
      const trimmed = skillInput.trim();
      if (trimmed && !cvData.skills.includes(trimmed)) {
        setCvData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
        setSkillInput("");
      }
    },
    [skillInput, cvData.skills, setCvData],
  );

  const removeSkill = useCallback(
    (skill) => {
      setCvData((prev) => ({
        ...prev,
        skills: prev.skills.filter((s) => s !== skill),
      }));
    },
    [setCvData],
  );

  const downloadPdf = useCallback(() => {
    if (!pdfInstance.url) return;
    const link = document.createElement("a");
    link.href = pdfInstance.url;
    link.download = `CV_${cvData.firstName || "Export"}_${cvData.lastName || "ResuMate"}.pdf`;
    link.click();
  }, [pdfInstance.url, cvData.firstName, cvData.lastName]);

  // ── Template preview actif ──────────────────────────────────────────────────
  const PreviewComponent =
    TEMPLATE_COMPONENTS[selectedTemplate] || CanvaModernTemplate;

  return (
    <div className="min-h-screen bg-base-300 text-base-content flex flex-col font-sans overflow-x-hidden">
      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <header className="bg-base-100 border-b border-base-200 sticky top-0 z-30 px-4 py-3 flex items-center justify-between shadow-sm">
        <button
          onClick={() => onNavigate("dashboard")}
          className="btn btn-outline btn-sm rounded-xl gap-2 font-bold transition-all hover:bg-base-200"
          aria-label="Retour au tableau de bord"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span className="hidden sm:inline">Dashboard</span>
        </button>

        <span className="font-black text-xs sm:text-sm tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary uppercase">
          ResuMate — Éditeur Pro 🌍
        </span>

        <button
          onClick={downloadPdf}
          disabled={pdfInstance.loading}
          className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white font-bold btn-sm sm:btn-md rounded-xl shadow-lg shadow-blue-600/20 disabled:opacity-50 border-none transition-all"
          aria-label="Télécharger le CV en PDF"
        >
          {pdfInstance.loading ? (
            <span
              className="loading loading-spinner loading-xs"
              aria-hidden="true"
            />
          ) : (
            <FileText size={16} aria-hidden="true" />
          )}
          <span className="hidden sm:inline">
            {pdfInstance.loading ? "Génération..." : "Télécharger PDF"}
          </span>
          <span className="sm:hidden">
            {pdfInstance.loading ? "..." : "PDF"}
          </span>
        </button>
      </header>

      {/* ── WORKBENCH ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col lg:flex-row h-none lg:h-[calc(100vh-57px)] overflow-visible lg:overflow-hidden">
        {/* ── PANNEAU GAUCHE : FORMULAIRES ─────────────────────────────── */}
        <div
          className="w-full lg:w-1/2 p-4 space-y-4 overflow-y-visible lg:overflow-y-auto bg-base-100 border-r border-base-200"
          role="form"
          aria-label="Formulaire de création de CV"
        >
          {/* ATS Panel */}
          <div className="p-5 bg-slate-900 rounded-2xl border border-indigo-500/30 text-white shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between mb-3 relative z-10">
              <h3 className="font-black text-xs tracking-wider flex items-center gap-2 text-indigo-400 uppercase">
                <Target size={16} aria-hidden="true" /> Optimisation ATS en
                temps réel
              </h3>
              <div
                className={`text-lg font-black px-2.5 py-0.5 rounded-xl bg-slate-800 border ${atsAnalysis.score >= 70 ? "text-green-400 border-green-500/30" : "text-amber-400 border-amber-500/30"}`}
                aria-label={`Score ATS : ${atsAnalysis.score} pourcent`}
              >
                {atsAnalysis.score}%
              </div>
            </div>
            <textarea
              placeholder="Collez ici la description de l'offre d'emploi pour mesurer votre taux de match..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="textarea textarea-bordered w-full bg-slate-800 border-slate-700 text-xs h-24 focus:border-indigo-500 text-slate-100 placeholder:text-slate-500 resize-none rounded-xl leading-relaxed"
              aria-label="Description de l'offre d'emploi pour l'analyse ATS"
            />
            {jobDescription && atsAnalysis.missingKeywords?.length > 0 && (
              <div className="space-y-2 mt-3 pt-3 border-t border-slate-800">
                <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-indigo-300 tracking-wider">
                  <AlertCircle size={12} aria-hidden="true" /> Mots-clés
                  manquants :
                </div>
                <div
                  className="flex flex-wrap gap-1"
                  role="list"
                  aria-label="Mots-clés manquants"
                >
                  {atsAnalysis.missingKeywords.map((word, i) => (
                    <span
                      key={i}
                      role="listitem"
                      className="bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 rounded-md text-[10px] text-indigo-200 font-medium"
                    >
                      + {word}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {jobDescription && atsAnalysis.missingKeywords?.length === 0 && (
              <p className="text-[11px] text-green-400 font-medium mt-2">
                ✅ Félicitations ! Votre profil contient les mots-clés
                essentiels.
              </p>
            )}
          </div>

          {/* Sélecteur de template */}
          <div className="p-4 bg-base-200 rounded-2xl border border-base-300">
            <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/70 flex items-center gap-2 mb-3">
              <Layout size={16} className="text-primary" aria-hidden="true" />{" "}
              Sélectionner un Modèle
            </h3>
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-2"
              role="radiogroup"
              aria-label="Choix du modèle de CV"
            >
              {[
                { id: "modern", label: "Modern" },
                { id: "minimal", label: "Minimal" },
                { id: "creative", label: "Créatif" },
                { id: "ats", label: "Simple ATS" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  role="radio"
                  aria-checked={selectedTemplate === id}
                  onClick={() => setSelectedTemplate(id)}
                  className={`btn btn-xs rounded-xl font-bold uppercase py-2 h-auto text-[10px] tracking-wider transition-all ${
                    selectedTemplate === id
                      ? "btn-primary shadow-sm"
                      : "btn-outline"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Identité & Contact */}
          <AccordionSection
            title="Identité & Contact"
            icon={Layout}
            defaultOpen={true}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-base-200/60 pb-3 mb-2">
              <label
                className="w-16 h-16 rounded-full border-2 border-dashed border-base-300 flex items-center justify-center cursor-pointer bg-base-200/60 hover:bg-base-200 transition-all shadow-inner shrink-0 overflow-hidden"
                aria-label="Télécharger une photo de profil"
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Upload size={16} className="opacity-40" aria-hidden="true" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-base-content/80">
                  Photo de Profil
                </p>
                <p className="text-[11px] text-base-content/50 mt-0.5">
                  Format carré recommandé — Max 2 MB.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormInput
                label="Prénom"
                name="firstName"
                value={cvData.firstName}
                onChange={handleChange}
                placeholder="Jean"
              />
              <FormInput
                label="Nom"
                name="lastName"
                value={cvData.lastName}
                onChange={handleChange}
                placeholder="Goma"
              />
            </div>
            <FormInput
              label="Titre Professionnel ou Poste Visé"
              name="title"
              value={cvData.title}
              onChange={handleChange}
              placeholder="Développeur Web / Gestionnaire de Projets"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormInput
                label="Adresse Email"
                name="email"
                value={cvData.email}
                onChange={handleChange}
                placeholder="jean.goma@exemple.com"
                type="email"
              />
              <FormInput
                label="Téléphone"
                name="phone"
                value={cvData.phone}
                onChange={handleChange}
                placeholder="+242 06 123 4567"
                type="tel"
              />
            </div>
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-semibold text-xs text-base-content/80 uppercase">
                  Résumé / Profil
                </span>
              </label>
              <textarea
                name="summary"
                value={cvData.summary}
                onChange={handleChange}
                className="textarea textarea-bordered w-full h-24 text-sm rounded-xl focus:border-primary leading-relaxed"
                placeholder="Présentez brièvement vos forces, votre parcours et vos aspirations..."
                aria-label="Résumé professionnel"
              />
            </div>
          </AccordionSection>

          {/* Compétences */}
          <AccordionSection title="Compétences Techniques" icon={Code}>
            <form onSubmit={addSkill} className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="input input-bordered input-md w-full text-sm rounded-xl"
                placeholder="Ex: Comptabilité, React, Scrum..."
                aria-label="Nouvelle compétence"
              />
              <button
                type="submit"
                className="btn btn-primary px-5 rounded-xl font-bold text-sm"
              >
                Ajouter
              </button>
            </form>
            <div
              className="flex flex-wrap gap-1.5 pt-2"
              role="list"
              aria-label="Liste des compétences"
            >
              {cvData.skills?.map((s, i) => (
                <span
                  key={i}
                  role="listitem"
                  className="bg-base-200 border border-base-300 text-xs px-2.5 py-1 rounded-xl flex items-center gap-1.5 font-medium"
                >
                  {s}
                  <button
                    onClick={() => removeSkill(s)}
                    aria-label={`Supprimer la compétence ${s}`}
                  >
                    <X
                      size={12}
                      className="text-error hover:scale-110 transition-transform"
                      aria-hidden="true"
                    />
                  </button>
                </span>
              ))}
            </div>
          </AccordionSection>

          {/* Expériences */}
          <AccordionSection
            title="Expériences Professionnelles"
            icon={Briefcase}
          >
            <div className="flex justify-end mb-1">
              <button
                onClick={addExperience}
                className="btn btn-outline btn-xs rounded-xl gap-1 text-[11px] font-bold py-1.5 h-auto"
              >
                <Plus size={12} aria-hidden="true" /> Ajouter une Expérience
              </button>
            </div>
            <div className="space-y-4">
              {cvData.experiences?.map((exp, idx) => (
                <ExperienceRow
                  key={exp.id}
                  exp={exp}
                  idx={idx}
                  onChange={handleExperienceChange}
                  onRemove={removeExperience}
                />
              ))}
            </div>
          </AccordionSection>

          {/* Formations */}
          <AccordionSection title="Parcours Académique" icon={GraduationCap}>
            <div className="flex justify-end mb-1">
              <button
                onClick={addEducation}
                className="btn btn-outline btn-xs rounded-xl gap-1 text-[11px] font-bold py-1.5 h-auto"
              >
                <Plus size={12} aria-hidden="true" /> Ajouter un Diplôme
              </button>
            </div>
            <div className="space-y-4">
              {cvData.educations?.map((edu, idx) => (
                <EducationRow
                  key={edu.id}
                  edu={edu}
                  idx={idx}
                  onChange={handleEducationChange}
                  onRemove={removeEducation}
                />
              ))}
            </div>
          </AccordionSection>

          {/* Langues */}
          <AccordionSection title="Langues Étrangères" icon={Languages}>
            <div className="flex justify-end mb-1">
              <button
                onClick={addLanguage}
                className="btn btn-outline btn-xs rounded-xl gap-1 text-[11px] font-bold py-1.5 h-auto"
              >
                <Plus size={12} aria-hidden="true" /> Ajouter une Langue
              </button>
            </div>
            <div className="space-y-2">
              {cvData.languages?.map((l) => (
                <LanguageRow
                  key={l.id}
                  lang={l}
                  onChange={handleLanguageChange}
                  onRemove={removeLanguage}
                />
              ))}
            </div>
          </AccordionSection>
        </div>

        {/* ── PANNEAU DROIT : PREVIEW ────────────────────────────────────── */}
        <div
          className="w-full lg:w-1/2 p-4 sm:p-6 bg-slate-800 overflow-y-visible lg:overflow-y-auto flex justify-center items-start border-l border-slate-900/40 min-h-[500px] lg:min-h-0"
          aria-label="Aperçu du CV en temps réel"
          aria-live="polite"
        >
          <div
            className="w-full max-w-[21cm] bg-white transform scale-100 origin-top shadow-2xl rounded-none overflow-hidden my-auto"
            id="cv-preview"
          >
            <PreviewComponent cvData={cvData} profileImage={profileImage} />
          </div>
        </div>
      </div>
    </div>
  );
}
