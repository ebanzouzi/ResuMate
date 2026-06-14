import { Target, AlertCircle } from "lucide-react";

export default function AtsOptimizer({
  jobDescription,
  onJobDescriptionChange,
  atsAnalysis,
}) {
  return (
    <div className="p-5 bg-slate-900 rounded-2xl border border-indigo-500/30 text-white shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-black text-sm flex items-center gap-2 tracking-wider">
          <Target size={18} className="text-indigo-400" /> OPTIMISATION ATS
        </h3>
        <div
          className={`text-xl font-black ${atsAnalysis.score > 70 ? "text-green-400" : "text-amber-400"}`}
        >
          {atsAnalysis.score}%
        </div>
      </div>
      <textarea
        placeholder="Collez ici la description de l'offre d'emploi pour voir si votre CV correspond..."
        value={jobDescription}
        onChange={(e) => onJobDescriptionChange(e.target.value)}
        className="textarea textarea-bordered w-full bg-slate-800 border-indigo-500/20 text-xs h-24 mb-3"
      />
      {jobDescription && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-indigo-300">
            <AlertCircle size={12} /> Ajoutez ces mots-clés :
          </div>
          <div className="flex flex-wrap gap-1">
            {atsAnalysis.missingKeywords.map((word, i) => (
              <span
                key={i}
                className="bg-indigo-500/20 border border-indigo-500/40 px-2 py-0.5 rounded-full text-[10px] text-indigo-100"
              >
                + {word}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
