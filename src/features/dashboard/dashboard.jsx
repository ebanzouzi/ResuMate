/**
 * dashboard.jsx — Version Production Multi-Responsive & Centrée
 */

import React, { useMemo, useCallback, memo } from "react";
import {
  FileText,
  Edit3,
  CheckCircle,
  TrendingUp,
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";

/** Item de checklist ATS — mémoïsé */
const ChecklistItem = memo(({ done, label }) => (
  <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold py-1">
    <CheckCircle
      size={16}
      className={done ? "text-success" : "opacity-25"}
      aria-hidden="true"
    />
    <span className={done ? "line-through opacity-40 font-medium" : "text-base-content/80"}>
      {label}
    </span>
  </div>
));

/** Composants de cartes mémoïsés pour éviter les cycles de recalculs */
const ProfileCard = memo(({ completionRate }) => (
  <div className="card bg-base-100 border border-base-200 shadow-sm p-5 sm:p-6 rounded-2xl flex flex-col justify-between">
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-base-content/50">
          Complétion du Profil
        </h3>
        <TrendingUp size={16} className="text-primary" />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl sm:text-4xl font-black tracking-tight">{completionRate}%</span>
        <span className="text-xs font-bold text-success">Optimisé</span>
      </div>
    </div>
    <div className="w-full mt-5">
      <progress
        className="progress progress-primary w-full h-2 rounded-full"
        value={completionRate}
        max="100"
        role="progressbar"
        aria-valuenow={completionRate}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label="Taux de complétion"
      />
    </div>
  </div>
));

const AtsChecklist = memo(({ cvData }) => {
  const checks = useMemo(() => [
    { label: "Résumé renseigné", done: !!cvData.summary?.trim() },
    { label: "Au moins 2 compétences techniques", done: (cvData.skills?.length || 0) >= 2 },
    { label: "Parcours professionnel listé", done: (cvData.experiences?.length || 0) >= 1 },
    { label: "Formations & diplômes spécifiés", done: (cvData.educations?.length || 0) >= 1 },
  ], [cvData]);

  return (
    <div className="card bg-base-100 border border-base-200 shadow-sm p-5 sm:p-6 rounded-2xl md:col-span-2">
      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-base-content/50 mb-4 flex items-center gap-1.5">
        <Sparkles size={14} className="text-secondary" /> Conformité aux critères ATS
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
        {checks.map((c, i) => (
          <ChecklistItem key={i} done={c.done} label={c.label} />
        ))}
      </div>
    </div>
  );
});

export default function Dashboard({ cvData, onNavigate, onReset, currentTheme, onToggleTheme }) {
  
  const completionRate = useMemo(() => {
    let score = 0;
    if (cvData.firstName && cvData.lastName) score += 20;
    if (cvData.title) score += 15;
    if (cvData.summary?.trim()) score += 20;
    if (cvData.skills?.length > 0) score += 15;
    if (cvData.experiences?.length > 0) score += 15;
    if (cvData.educations?.length > 0) score += 15;
    return score;
  }, [cvData]);

  const goToEditor = useCallback(() => onNavigate("editor"), [onNavigate]);

  return (
    <div className="min-h-screen bg-base-200/50 text-base-content antialiased flex flex-col w-full">
      
      {/* BANDEAU TOP BAR HEADER */}
      <header className="w-full bg-base-100 border-b border-base-200 px-4 sm:px-8 py-3 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary text-primary-content font-black flex items-center justify-center text-lg shadow-sm shadow-primary/30">
              R
            </div>
            <span className="font-black text-base sm:text-lg tracking-tight">
              Resu<span className="text-primary">Mate</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleTheme}
              className="btn btn-ghost btn-sm btn-square rounded-xl"
              aria-label="Changer de thème"
            >
              {currentTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* ZONE DE CONTENU CENTRALISÉE */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-8 py-8 sm:py-12 space-y-8 flex flex-col justify-start">
        
        {/* En-tête de bienvenue personnalisé */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2">
              Bonjour,{" "}
              <span className="text-primary truncate max-w-[250px] sm:max-w-none inline-block">
                {cvData.firstName || "Cher Candidat"}
              </span>{" "}
              👋
            </h1>
            <p className="text-xs sm:text-sm text-base-content/60 mt-1 font-semibold">
              {cvData.title || "Définissez votre poste cible dans l'éditeur"}
            </p>
          </div>
          <button
            onClick={goToEditor}
            className="btn btn-primary w-full sm:w-auto rounded-xl font-bold text-sm shadow-lg shadow-primary/10 gap-2 px-5 py-2.5 h-auto"
          >
            <Edit3 size={16} aria-hidden="true" />
            Ouvrir l'Éditeur Pro
          </button>
        </div>

        {/* Section Analytique des cartes */}
        <section
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full"
          aria-label="Métriques de votre CV"
        >
          <ProfileCard completionRate={completionRate} />
          <AtsChecklist cvData={cvData} />
        </section>

        {/* Notification d'aide contextuelle */}
        {completionRate < 30 && (
          <div
            className="alert alert-info text-xs sm:text-sm font-semibold rounded-2xl border-none shadow-sm p-4 w-full"
            role="status"
            aria-live="polite"
          >
            <span>
              💡 Commencez par remplir vos coordonnées d'identité et votre résumé professionnel dans l'éditeur pour rendre votre profil attractif.
            </span>
          </div>
        )}

        {/* Aperçu rapide du document local */}
        <div className="bg-base-100 p-4 sm:p-5 rounded-2xl border border-base-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm w-full">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
              <FileText size={24} />
            </div>
            <div className="truncate">
              <p className="font-bold text-sm text-base-content truncate max-w-[280px] sm:max-w-xs">
                {cvData.lastName ? `CV_${cvData.lastName}_Export.pdf` : "Mon_CV_ResuMate.pdf"}
              </p>
              <p className="text-[11px] opacity-50 font-medium mt-0.5">
                Modifications synchronisées localement
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onReset}
              className="btn btn-ghost btn-xs text-error font-bold rounded-lg px-2"
            >
              Réinitialiser
            </button>
            <button
              onClick={goToEditor}
              className="btn btn-ghost btn-sm text-primary font-bold rounded-xl px-3"
            >
              Modifier
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}