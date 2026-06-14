export default function CvPage({ children, variant = "modern", className = "" }) {
  const variantClass =
    variant === "serif"
      ? "cv-page--serif"
      : variant === "ats"
        ? "cv-page--ats"
        : "";

  return (
    <article className={`cv-page ${variantClass} ${className}`.trim()}>
      {children}
    </article>
  );
}
