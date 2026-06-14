import { useMemo } from "react";

/**
 * Custom React Hook for fast performance-isolated text scoring.
 * Employs a clean regex token parsing structure completely free of localized domain locks.
 */
export function useAtsAnalysis(cvData, jobDescription) {
  return useMemo(() => {
    if (!jobDescription || !jobDescription.trim()) {
      return { score: 0, missingKeywords: [] };
    }

    // Comprehensive token parsing for multi-lingual compliance (French/English character sets)
    const jobTokens =
      jobDescription.toLowerCase().match(/\b[a-zàâäçèéêëîïôûüœ]{4,}\b/g) || [];
    const absoluteJobKeywords = [...new Set(jobTokens)];

    // Standard high-performance non-technical stopword optimization matrix
    const exclusionArray = new Set([
      "avec",
      "dans",
      "pour",
      "dans",
      "plus",
      "nous",
      "vous",
      "votre",
      "notre",
      "sont",
      "être",
      "avoir",
      "faire",
      "this",
      "that",
      "with",
      "from",
      "your",
      "their",
      "have",
      "will",
      "shall",
      "should",
      "could",
    ]);
    const filteredKeywords = absoluteJobKeywords.filter(
      (word) => !exclusionArray.has(word),
    );

    // Consolidate full data content matrix for text-based analysis parsing
    const structuralStringRepresentation = `
      ${cvData.title || ""} 
      ${cvData.summary || ""} 
      ${(cvData.skills || []).join(" ")} 
      ${(cvData.experiences || []).map((e) => `${e.role} ${e.company} ${e.description}`).join(" ")}
      ${(cvData.educations || []).map((edu) => `${edu.degree} ${edu.school}`).join(" ")}
    `.toLowerCase();

    const matchedTokens = filteredKeywords.filter((word) =>
      structuralStringRepresentation.includes(word),
    );

    const gapIdentifiedArray = filteredKeywords.filter(
      (word) => !structuralStringRepresentation.includes(word),
    );

    // Score mathematical normalization curve based on realistic threshold metrics
    const dynamicCalculatedScore =
      filteredKeywords.length > 0
        ? Math.min(
            Math.round(
              (matchedTokens.length / (filteredKeywords.length * 0.45)) * 100,
            ),
            100,
          )
        : 0;

    return {
      score: dynamicCalculatedScore,
      missingKeywords: gapIdentifiedArray.slice(0, 10),
    };
  }, [cvData, jobDescription]);
}
