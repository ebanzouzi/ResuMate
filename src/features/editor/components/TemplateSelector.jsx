import { Layout } from "lucide-react";
import { TEMPLATE_OPTIONS } from "../templates";

export default function TemplateSelector({ selectedTemplate, onSelect }) {
  return (
    <div className="p-4 bg-base-200 rounded-2xl border border-base-300 space-y-3">
      <h3 className="font-bold text-sm flex items-center gap-2">
        <Layout size={16} className="text-primary" /> Modèle
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {TEMPLATE_OPTIONS.map(({ id, label, accent }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={`btn btn-xs rounded-xl ${
              selectedTemplate === id
                ? accent
                  ? "btn-secondary text-white"
                  : "btn-primary"
                : accent
                  ? "btn-outline btn-secondary"
                  : "btn-outline"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
