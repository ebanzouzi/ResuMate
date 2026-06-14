import { useState } from "react";
import { Code, X } from "lucide-react";

export default function SkillsSection({ skills, setCvData }) {
  const [skillInput, setSkillInput] = useState("");

  const addSkill = (e) => {
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (!trimmed) return;

    setCvData((prev) => ({
      ...prev,
      skills: [...prev.skills, trimmed],
    }));
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setCvData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  return (
    <div className="space-y-3">
      <h2 className="text-md font-black uppercase text-primary border-b pb-1 flex items-center gap-2">
        <Code size={18} /> Compétences
      </h2>
      <form onSubmit={addSkill} className="flex gap-2">
        <input
          type="text"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          className="input input-bordered input-sm w-full"
          placeholder="ex: React..."
        />
        <button type="submit" className="btn btn-sm btn-primary px-4">
          OK
        </button>
      </form>
      <div className="flex flex-wrap gap-1">
        {skills.map((skill) => (
          <span
            key={skill}
            className="bg-base-200 border text-xs px-2 py-1 rounded-lg flex items-center gap-1"
          >
            {skill}
            <X
              size={12}
              className="cursor-pointer text-error"
              onClick={() => removeSkill(skill)}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
