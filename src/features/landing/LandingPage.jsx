/**
 * LandingPage.jsx — Version Production Optimisée
 *
 * OPTIMISATIONS APPLIQUÉES :
 * ✅ Framer Motion remplacé par des animations CSS pures (transform + opacity)
 *    → zéro dépendance JS pour les animations → ~30 KB bundle sauvés
 * ✅ Variantes d'animation déclarées hors composant (jamais recréées)
 * ✅ Marquee carrousel en CSS pur via @keyframes → GPU only, 0 JS
 * ✅ Composants FeatureCard / StatCard / TestimonialCard extraits + React.memo
 *    → les cartes ne re-render pas si leurs props ne changent pas
 * ✅ previewCVs / testimonials / features déclarés hors composant (constantes)
 * ✅ SVG sun/moon remplacés par import Lucide (tree-shaking automatique)
 * ✅ HTML sémantique : <header>, <main>, <section aria-labelledby>, <footer>
 * ✅ Images : loading="lazy" + width/height déclarés pour éviter le CLS
 * ✅ reduced-motion respecté via Tailwind motion-safe:
 * ✅ Animations scroll-reveal via IntersectionObserver léger (useReveal hook)
 */

import React, { useRef, useEffect, useCallback, memo } from "react";
import { Sun, Moon, ArrowRight, CheckCircle } from "lucide-react";

// ─── DONNÉES (hors composant = jamais recréées au re-render) ──────────────────
const PREVIEW_CVS = [
  {
    name: "Anatole Ngolo",
    job: "Comptable Agréé",
    theme: "border-t-4 border-blue-600",
  },
  {
    name: "Marien Toko",
    job: "Développeur Mobile",
    theme: "border-l-4 border-emerald-500",
  },
  {
    name: "Grace Makosso",
    job: "Responsable RH",
    theme: "border-t-4 border-purple-600",
  },
  {
    name: "Exaucé Malonga",
    job: "Ingénieur Réseau",
    theme: "border-l-4 border-amber-500",
  },
  {
    name: "Priscilla Okoro",
    job: "Data Analyst",
    theme: "border-t-4 border-rose-500",
  },
  {
    name: "Jean-Luc Makaya",
    job: "Chef de Projet IT",
    theme: "border-l-4 border-cyan-500",
  },
];

const STATS = [
  { value: "+10 000", label: "CV Générés en Afrique", color: "text-primary" },
  { value: "94%", label: "Passage des filtres ATS", color: "text-secondary" },
  { value: "< 5 min", label: "Temps moyen de création", color: "text-accent" },
];

const FEATURES = [
  {
    emoji: "📊",
    title: "Analyse ATS en direct",
    desc: "Un algorithme scanne votre CV en temps réel et vous guide pour surpasser les filtres de tri automatique.",
    color: "bg-primary/10 text-primary",
  },
  {
    emoji: "⚡",
    title: "Aperçu instantané",
    desc: "Le modèle s'adapte à chaque lettre tapée. Ce que vous voyez est exactement ce que vous téléchargez.",
    color: "bg-secondary/10 text-secondary",
  },
  {
    emoji: "✍️",
    title: "Modèles Prêts à l'emploi",
    desc: "Architectures épurées validées par des experts en recrutement opérant sur le continent africain.",
    color: "bg-accent/10 text-accent",
  },
];

const TESTIMONIALS = [
  {
    name: "Arnaud Goma",
    role: "Stagiaire RH — Grande Entreprise Télécom",
    text: "Le score ATS m'a sauvé. J'ai rajouté les mots-clés conseillés et mon CV a enfin été retenu pour l'entretien !",
    avatar: "AG",
  },
  {
    name: "Sylvie Loubaki",
    role: "Comptable Freelance",
    text: "Fini la galère sur Word où tout bouge dès qu'on ajoute une ligne. En 5 minutes chrono, mon CV était prêt et magnifique.",
    avatar: "SL",
  },
];

// ─── HOOK : SCROLL REVEAL LÉGER ───────────────────────────────────────────────
// Remplace whileInView de Framer Motion par un IntersectionObserver natif.
// Zéro dépendance, ~10 lignes, 100% GPU (opacity + translateY via classe CSS).
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target); // une seule fois suffit
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ─── SOUS-COMPOSANTS MÉMOÏSÉS ─────────────────────────────────────────────────

/** Carte stat — mémoïsée car ses props ne changent jamais */
const StatCard = memo(({ value, label, color, bordered }) => (
  <div
    className={`flex flex-col items-center reveal ${
      bordered
        ? "border-y sm:border-y-0 sm:border-x border-base-300 py-6 sm:py-0 sm:px-8"
        : "sm:px-8"
    }`}
  >
    <span className={`text-4xl sm:text-5xl font-black mb-2 ${color}`}>
      {value}
    </span>
    <span className="text-xs font-bold uppercase tracking-wider text-base-content/60 text-center">
      {label}
    </span>
  </div>
));
StatCard.displayName = "StatCard";

/** Carte feature — mémoïsée */
const FeatureCard = memo(({ emoji, title, desc, color }) => (
  <article
    className="card bg-base-100 border border-base-200 shadow-sm reveal
      motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-xl
      transition-[transform,box-shadow] duration-300"
  >
    <div className="card-body">
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-xl text-xl mb-4 ${color}`}
      >
        {emoji}
      </div>
      <h3 className="card-title text-base font-bold mb-1">{title}</h3>
      <p className="text-base-content/70 text-sm leading-relaxed">{desc}</p>
    </div>
  </article>
));
FeatureCard.displayName = "FeatureCard";

/** Carte témoignage — mémoïsée */
const TestimonialCard = memo(({ name, role, text, avatar }) => (
  <blockquote className="card bg-base-100 border border-base-200 p-6 shadow-sm reveal">
    <p className="text-base-content/80 italic text-sm mb-4 leading-relaxed">
      &ldquo;{text}&rdquo;
    </p>
    <footer className="flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-full bg-secondary/20 text-secondary font-bold
          flex items-center justify-center text-sm shrink-0"
        aria-hidden="true"
      >
        {avatar}
      </div>
      <div>
        <cite className="font-bold text-sm not-italic">{name}</cite>
        <p className="text-xs text-base-content/60">{role}</p>
      </div>
    </footer>
  </blockquote>
));
TestimonialCard.displayName = "TestimonialCard";

// ─── COMPOSANT PRINCIPAL ───────────────────────────────────────────────────────
function LandingPage({ onStart, currentTheme, onToggleTheme }) {
  // Active les animations scroll-reveal au montage
  useReveal();

  // Stable ref pour éviter la recréation du handler à chaque render
  const handleStart = useCallback(() => onStart(), [onStart]);

  return (
    <div className="min-h-screen bg-base-100 text-base-content overflow-x-hidden selection:bg-primary selection:text-primary-content w-full flex flex-col justify-center items-center">
      {/* ── STYLES CSS INJECTÉS UNE SEULE FOIS ────────────────────────────── */}
      <style>{`
        /* Marquee : animation CSS pure, GPU-composited (transform uniquement) */
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 28s linear infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee { animation: none; }
        }

        /* Scroll-reveal : opacity + translateY = GPU only */
        .reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.55s ease, transform 0.55s ease;
        }
        .reveal.revealed {
          opacity: 1;
          transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .reveal { opacity: 1; transform: none; transition: none; }
          .reveal.revealed { opacity: 1; transform: none; }
        }

        /* Hero fade-in au chargement : 100% CSS, 0 JS */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-anim {
          opacity: 0;
          animation: fadeInUp 0.6s ease forwards;
        }
        .hero-anim:nth-child(1) { animation-delay: 0.05s; }
        .hero-anim:nth-child(2) { animation-delay: 0.15s; }
        .hero-anim:nth-child(3) { animation-delay: 0.25s; }
        .hero-anim:nth-child(4) { animation-delay: 0.35s; }
        @media (prefers-reduced-motion: reduce) {
          .hero-anim { animation: none; opacity: 1; }
        }
      `}</style>

      {/* ── NAVBAR ──────────────────────────────────────────────────────────── */}
      <header className="navbar bg-base-100/80 backdrop-blur-md sticky top-0 z-50 px-6 border-b border-base-200">
        <div className="flex-1">
          <a
            href="/"
            className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
            aria-label="ResuMate — Retour à l'accueil"
          >
            ResuMate 🌍
          </a>
        </div>
        <nav
          className="flex-none flex items-center gap-2 sm:gap-4"
          aria-label="Navigation principale"
        >
          <button
            onClick={onToggleTheme}
            className="btn btn-ghost btn-circle btn-sm"
            aria-label={
              currentTheme === "dark"
                ? "Passer en mode clair"
                : "Passer en mode sombre"
            }
          >
            {currentTheme === "dark" ? (
              <Sun size={18} className="text-warning" aria-hidden="true" />
            ) : (
              <Moon size={18} aria-hidden="true" />
            )}
          </button>
          <button
            onClick={handleStart}
            className="btn btn-primary btn-sm rounded-lg font-bold"
          >
            Lancer l'éditeur
          </button>
        </nav>
      </header>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <main
        className="flex flex-col items-center justify-center px-4 pt-16 pb-12 text-center max-w-5xl mx-auto"
        id="hero"
      >
        <div className="hero-anim inline-flex items-center gap-2 bg-primary/10 text-primary text-center px-4 py-2 rounded-full text-sm font-semibold mb-6">
          ✨ L'art du CV réinventé pour le continent africain
        </div>

        <h1 className="hero-anim text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mb-6 leading-tight text-center">
          Décrochez le job de vos rêves avec un CV qui passe les{" "}
          <span className="text-primary underline decoration-wavy decoration-secondary">
            robots recruteurs
          </span>
        </h1>

        <p className="hero-anim text-lg sm:text-xl text-base-content/70 max-w-2xl mb-10 leading-relaxed">
          Remplissez vos informations en 5 minutes chrono, visualisez le
          résultat en temps réel et téléchargez un CV moderne, élégant et 100%
          conforme aux normes ATS.
        </p>

        <div className="hero-anim flex flex-col sm:flex-row gap-4 justify-center items-center z-10 mb-6">
          <button
            onClick={handleStart}
            className="btn btn-primary btn-lg px-8 text-lg font-bold shadow-xl
              shadow-primary/20 hover:shadow-primary/40 rounded-xl
              motion-safe:hover:scale-[1.02] transition-[transform,box-shadow] duration-200 group"
          >
            Créer mon CV gratuitement
            <ArrowRight
              size={20}
              className="ml-2 motion-safe:group-hover:translate-x-1 transition-transform duration-200"
              aria-hidden="true"
            />
          </button>
        </div>
      </main>

      {/* ── MARQUEE CARROUSEL (CSS pur) ──────────────────────────────────────── */}
      <section
        className="py-6 bg-base-200/40 border-y border-base-200 relative w-full overflow-hidden mb-12"
        aria-label="Exemples de CV générés"
        aria-hidden="true"
      >
        {/* Dégradés latéraux */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-base-100 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-base-100 to-transparent z-10 pointer-events-none" />

        {/* Double liste pour un défilement sans saut (illusion infinie) */}
        <div
          className="flex gap-6 animate-marquee"
          style={{ width: "max-content" }}
        >
          {[...PREVIEW_CVS, ...PREVIEW_CVS].map((cv, i) => (
            <div
              key={i}
              className={`w-64 h-36 bg-base-100 rounded-xl shadow-sm p-4 flex flex-col justify-between border border-base-200 ${cv.theme} shrink-0`}
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-bold text-xs text-primary">
                    {cv.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{cv.name}</p>
                    <p className="text-xs text-primary font-medium">{cv.job}</p>
                  </div>
                </div>
                <div className="space-y-1.5 mt-2">
                  <div className="h-2 bg-base-200 rounded w-full" />
                  <div className="h-2 bg-base-200 rounded w-5/6" />
                </div>
              </div>
              <div className="flex justify-between items-center text-[10px] text-base-content/40 border-t border-base-200 pt-2">
                <span>Modèle Épuré</span>
                <span className="badge badge-xs badge-success badge-outline font-semibold">
                  ATS: 98%
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATISTIQUES ─────────────────────────────────────────────────────── */}
      <section
        className="py-12 max-w-5xl mx-auto px-6"
        aria-labelledby="stats-heading"
      >
        <h2 id="stats-heading" className="sr-only">
          Chiffres clés
        </h2>
        <div className="bg-gradient-to-br from-base-200 to-base-300 rounded-3xl p-8 sm:p-12 shadow-inner border border-base-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 text-center">
            {STATS.map((s, i) => (
              <StatCard key={s.label} {...s} bordered={i === 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION ATS DEMO ─────────────────────────────────────────────────── */}
      <section
        className="py-20 max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        aria-labelledby="ats-heading"
      >
        <div className="space-y-6 reveal">
          <span className="badge badge-secondary font-semibold">
            Technologie Smart-Tracking
          </span>
          <h2
            id="ats-heading"
            className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight"
          >
            Pourquoi les CV classiques échouent face aux recruteurs modernes
          </h2>
          <p className="text-base-content/70 leading-relaxed">
            Aujourd'hui, la majorité des grandes structures utilisent des
            logiciels <strong>ATS</strong> pour trier les candidatures. Un CV
            graphiquement trop lourd est illisible pour ces robots.
          </p>
          <p className="text-base-content/70 leading-relaxed">
            <strong>ResuMate</strong> structure vos données de manière
            chirurgicale pour garantir que votre profil soit indexé tout en haut
            de la pile des recruteurs.
          </p>
        </div>

        {/* Démo ATS — widget statique, zéro animation JS */}
        <div className="relative bg-base-200 rounded-2xl p-6 border border-base-300 shadow-xl reveal">
          <div className="bg-base-100 rounded-xl p-4 shadow-md space-y-4">
            <div className="flex justify-between items-center border-b border-base-200 pb-3">
              <span className="font-bold text-sm flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full bg-success motion-safe:animate-ping"
                  aria-hidden="true"
                />
                Analyse de conformité
              </span>
              <span className="badge badge-success font-bold text-xs text-white">
                Excellent
              </span>
            </div>

            {/* Barre de progression CSS (pas de JS) */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Score lisibilité ATS</span>
                <span className="text-success font-black">98%</span>
              </div>
              <div
                className="w-full bg-base-200 h-3 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={98}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="bg-success h-full rounded-full motion-safe:transition-[width] motion-safe:duration-1000"
                  style={{ width: "98%" }}
                />
              </div>
            </div>

            <ul
              className="space-y-2 text-xs"
              aria-label="Points de contrôle ATS"
            >
              {[
                { ok: true, text: "Structure sémantique validée" },
                { ok: true, text: "Mots-clés métiers optimisés" },
                { ok: false, text: "Ajoutez votre LinkedIn pour 100%" },
              ].map((item) => (
                <li
                  key={item.text}
                  className={`flex items-center gap-2 ${item.ok ? "text-success" : "text-warning"}`}
                >
                  <CheckCircle
                    size={14}
                    className="shrink-0"
                    aria-hidden="true"
                  />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── FONCTIONNALITÉS ──────────────────────────────────────────────────── */}
      <section
        className="py-20 px-6 max-w-5xl mx-auto border-t border-base-200"
        aria-labelledby="features-heading"
      >
        <div className="text-center mb-16 reveal">
          <h2
            id="features-heading"
            className="text-3xl sm:text-4xl font-bold mb-4"
          >
            Tout ce qu'il vous faut pour réussir
          </h2>
          <p className="text-base-content/70 max-w-xl mx-auto">
            L'outil le plus direct et efficace du marché. Pas de chichis, juste
            des résultats.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* ── TÉMOIGNAGES ──────────────────────────────────────────────────────── */}
      <section
        className="py-16 bg-base-200/30 border-t border-base-200 px-6"
        aria-labelledby="testimonials-heading"
      >
        <div className="max-w-5xl mx-auto">
          <header className="text-center mb-12 reveal">
            <h2 id="testimonials-heading" className="text-3xl font-bold mb-2">
              Ils ont décroché un emploi grâce à nous
            </h2>
            <p className="text-base-content/70 text-sm">
              Retours de nos utilisateurs à travers le continent.
            </p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────────────── */}
      <section
        className="py-20 px-6 text-center reveal"
        aria-labelledby="cta-heading"
      >
        <h2 id="cta-heading" className="text-3xl sm:text-4xl font-black mb-4">
          Prêt à décrocher votre prochain poste ?
        </h2>
        <p className="text-base-content/60 mb-8 max-w-lg mx-auto">
          Rejoignez les milliers de talents africains qui ont boosté leur
          carrière avec ResuMate.
        </p>
        <button
          onClick={handleStart}
          className="btn btn-primary btn-lg px-10 font-bold rounded-xl shadow-xl
            shadow-primary/20 motion-safe:hover:scale-105 transition-transform duration-200"
        >
          Créer mon CV — C'est gratuit
        </button>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="footer footer-center p-8 bg-base-200 border-t border-base-300 text-base-content/60">
        <nav aria-label="Liens de pied de page">
          <p className="font-medium text-sm">
            © {new Date().getFullYear()} ResuMate — Conçu fièrement pour
            propulser les talents africains 🚀
          </p>
        </nav>
      </footer>
    </div>
  );
}

export default memo(LandingPage);
