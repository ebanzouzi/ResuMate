import ModernTemplate from "./ModernTemplate";
import MinimalTemplate from "./MinimalTemplate";
import CreativeTemplate from "./CreativeTemplate";
import AtsFriendlyTemplate from "./AtsFriendlyTemplate";

export const CV_TEMPLATES = {
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  creative: CreativeTemplate,
  ats: AtsFriendlyTemplate,
};

export const TEMPLATE_OPTIONS = [
  { id: "modern", label: "MODERNE" },
  { id: "minimal", label: "MINIMAL" },
  { id: "creative", label: "CRÉATIF" },
  { id: "ats", label: "SIMPLE ATS", accent: true },
];
