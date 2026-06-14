import { Mail, Phone } from "lucide-react";
import { hasText } from "./formatters";

export default function CvContactLines({ email, phone, light = false }) {
  if (!hasText(email) && !hasText(phone)) return null;

  const iconClass = light ? "text-indigo-300" : "text-indigo-500";
  const textClass = light ? "text-slate-300" : "text-slate-600";

  return (
    <div className={`space-y-1.5 text-[10px] ${textClass}`}>
      {hasText(email) && (
        <p className="flex items-center gap-2 break-all">
          <Mail size={11} className={`shrink-0 ${iconClass}`} />
          <span>{email}</span>
        </p>
      )}
      {hasText(phone) && (
        <p className="flex items-center gap-2">
          <Phone size={11} className={`shrink-0 ${iconClass}`} />
          <span>{phone}</span>
        </p>
      )}
    </div>
  );
}
