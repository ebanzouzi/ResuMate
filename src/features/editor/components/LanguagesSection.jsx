import { Languages, Plus, Trash2 } from "lucide-react";
import Button from "../../../components/Button";

export default function LanguagesSection({ languages, setCvData }) {
  const updateLanguage = (id, field, value) => {
    setCvData((prev) => ({
      ...prev,
      languages: prev.languages.map((lang) =>
        lang.id === id ? { ...lang, [field]: value } : lang,
      ),
    }));
  };

  const addLanguage = () => {
    setCvData((prev) => ({
      ...prev,
      languages: [
        ...prev.languages,
        { id: Date.now(), name: "", level: "" },
      ],
    }));
  };

  const removeLanguage = (id) => {
    setCvData((prev) => ({
      ...prev,
      languages: prev.languages.filter((lang) => lang.id !== id),
    }));
  };

  return (
    <div className="space-y-4 pb-8">
      <div className="flex justify-between items-center border-b pb-1">
        <h2 className="text-md font-black uppercase text-primary flex items-center gap-2">
          <Languages size={18} /> Langues
        </h2>
        <Button
          onClick={addLanguage}
          variant="outline"
          size="xs"
          icon={<Plus size={14} />}
        >
          Ajouter
        </Button>
      </div>
      {languages.map((lang) => (
        <div key={lang.id} className="flex gap-2 items-center">
          <input
            placeholder="Langue"
            value={lang.name}
            onChange={(e) => updateLanguage(lang.id, "name", e.target.value)}
            className="input input-sm input-bordered w-1/2"
          />
          <input
            placeholder="Niveau"
            value={lang.level}
            onChange={(e) => updateLanguage(lang.id, "level", e.target.value)}
            className="input input-sm input-bordered w-1/2"
          />
          <button
            type="button"
            onClick={() => removeLanguage(lang.id)}
            className="text-error"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
