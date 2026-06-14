import { GraduationCap, Plus, Trash2 } from "lucide-react";
import Button from "../../../components/Button";

export default function EducationsSection({ educations, setCvData }) {
  const updateEducation = (id, field, value) => {
    setCvData((prev) => ({
      ...prev,
      educations: prev.educations.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu,
      ),
    }));
  };

  const addEducation = () => {
    setCvData((prev) => ({
      ...prev,
      educations: [
        ...prev.educations,
        { id: Date.now(), school: "", degree: "", period: "" },
      ],
    }));
  };

  const removeEducation = (id) => {
    setCvData((prev) => ({
      ...prev,
      educations: prev.educations.filter((edu) => edu.id !== id),
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b pb-1">
        <h2 className="text-md font-black uppercase text-primary flex items-center gap-2">
          <GraduationCap size={18} /> Études
        </h2>
        <Button
          onClick={addEducation}
          variant="outline"
          size="xs"
          icon={<Plus size={14} />}
        >
          Ajouter
        </Button>
      </div>
      {educations.map((edu) => (
        <div
          key={edu.id}
          className="p-3 bg-base-200 rounded-xl space-y-2 relative border border-base-300"
        >
          <button
            type="button"
            onClick={() => removeEducation(edu.id)}
            className="absolute top-2 right-2 text-error"
          >
            <Trash2 size={16} />
          </button>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <input
              placeholder="Université / École"
              value={edu.school}
              onChange={(e) =>
                updateEducation(edu.id, "school", e.target.value)
              }
              className="input input-sm input-bordered"
            />
            <input
              placeholder="Période"
              value={edu.period}
              onChange={(e) =>
                updateEducation(edu.id, "period", e.target.value)
              }
              className="input input-sm input-bordered"
            />
          </div>
          <input
            placeholder="Diplôme obtenu"
            value={edu.degree}
            onChange={(e) =>
              updateEducation(edu.id, "degree", e.target.value)
            }
            className="input input-sm input-bordered w-full"
          />
        </div>
      ))}
    </div>
  );
}
