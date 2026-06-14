export default function CvSection({
  title,
  children,
  accent = false,
  light = false,
  className = "",
}) {
  return (
    <section className={`mb-5 last:mb-0 ${className}`}>
      <h3
        className={`cv-section-title ${accent ? "cv-section-title--accent" : ""} ${light ? "cv-section-title--light" : ""}`}
      >
        {title}
      </h3>
      {children}
    </section>
  );
}
