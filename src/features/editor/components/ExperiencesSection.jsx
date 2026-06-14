import { Briefcase, Plus, Trash2 } from "lucide-react";
import Button from "../../../components/Button";

export default function ExperiencesSection({ experiences, setCvData }) {
  const updateExperience = (id, field, value) => {
    setCvData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp,
      ),
    }));
  };

  const addExperience = () => {
    setCvData((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          id: Date.now(),
          company: "",
          role: "",
          period: "",
          description: "",
        },
      ],
    }));
  };

  const removeExperience = (id) => {
    setCvData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((exp) => exp.id !== id),
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b pb-1">
        <h2 className="text-md font-black uppercase text-primary flex items-center gap-2">
          <Briefcase size={18} /> Expériences
        </h2>
        <Button
          onClick={addExperience}
          variant="outline"
          size="xs"
          icon={<Plus size={14} />}
        >
          Ajouter
        </Button>
      </div>
      {experiences.map((exp) => (
        <div
          key={exp.id}
          className="p-3 bg-base-200 rounded-xl space-y-2 relative border border-base-300 shadow-inner"
        >
          <button
            type="button"
            onClick={() => removeExperience(exp.id)}
            className="absolute top-2 right-2 text-error"
          >
            <Trash2 size={16} />
          </button>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <input
              placeholder="Entreprise"
              value={exp.company}
              onChange={(e) =>
                updateExperience(exp.id, "company", e.target.value)
              }
              className="input input-sm input-bordered"
            />
            <input
              placeholder="Période"
              value={exp.period}
              onChange={(e) =>
                updateExperience(exp.id, "period", e.target.value)
              }
              className="input input-sm input-bordered"
            />
          </div>
          <input
            placeholder="Poste"
            value={exp.role}
            onChange={(e) => updateExperience(exp.id, "role", e.target.value)}
            className="input input-sm input-bordered w-full"
          />
          <textarea
            placeholder="Décrivez vos missions..."
            value={exp.description}
            onChange={(e) =>
              updateExperience(exp.id, "description", e.target.value)
            }
            className="textarea textarea-sm textarea-bordered w-full h-20"
          />
        </div>
      ))}
    </div>
  );
}
