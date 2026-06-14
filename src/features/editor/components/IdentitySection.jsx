import { Upload } from "lucide-react";
import Input from "../../../components/Input";

export default function IdentitySection({
  cvData,
  profileImage,
  onFieldChange,
  onImageChange,
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-md font-black uppercase text-primary border-b pb-1">
        Identité & Contact
      </h2>
      <div className="flex items-center gap-4">
        <label className="w-16 h-16 rounded-full border-2 border-dashed border-base-300 flex items-center justify-center cursor-pointer bg-base-200">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profil"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <Upload size={16} />
          )}
          <input type="file" className="hidden" onChange={onImageChange} />
        </label>
        <div className="text-xs font-bold uppercase opacity-60">
          Photo de profil
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Prénom"
          name="firstName"
          value={cvData.firstName}
          onChange={onFieldChange}
        />
        <Input
          label="Nom"
          name="lastName"
          value={cvData.lastName}
          onChange={onFieldChange}
        />
      </div>
      <Input
        label="Poste actuel ou visé"
        name="title"
        value={cvData.title}
        onChange={onFieldChange}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Email"
          name="email"
          value={cvData.email}
          onChange={onFieldChange}
        />
        <Input
          label="Téléphone"
          name="phone"
          value={cvData.phone}
          onChange={onFieldChange}
        />
      </div>
      <textarea
        name="summary"
        value={cvData.summary}
        onChange={onFieldChange}
        className="textarea textarea-bordered w-full h-24 text-sm"
        placeholder="Parlez brièvement de votre parcours..."
      />
    </div>
  );
}
