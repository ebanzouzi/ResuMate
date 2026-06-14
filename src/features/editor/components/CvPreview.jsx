import { CV_TEMPLATES } from "../templates";

const TEMPLATE_LABELS = {
  modern: "Moderne",
  minimal: "Minimal",
  creative: "Créatif",
  ats: "ATS",
};

export default function CvPreview({
  selectedTemplate,
  cvData,
  profileImage,
}) {
  const Template = CV_TEMPLATES[selectedTemplate];
  const templateLabel = TEMPLATE_LABELS[selectedTemplate] ?? "CV";

  return (
    <div className="cv-preview-shell flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 shrink-0">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            Aperçu du CV
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Format A4 · Modèle {templateLabel}
          </p>
        </div>
        <span className="text-[10px] font-medium text-slate-500 bg-slate-800/80 border border-white/10 px-2.5 py-1 rounded-full">
          210 × 297 mm
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-8 flex justify-center items-start">
        <div
          id="cv-preview"
          className="cv-paper shrink-0 origin-top scale-[0.82] sm:scale-[0.88] lg:scale-100 transition-transform duration-300"
        >
          {Template && (
            <Template cvData={cvData} profileImage={profileImage} />
          )}
        </div>
      </div>
    </div>
  );
}
