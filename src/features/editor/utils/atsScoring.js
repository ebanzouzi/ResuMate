/**
 * ATS Scoring utilities for realistic CV analysis
 * Provides comprehensive keyword matching, prioritization, and recommendations
 */

/**
 * Extract and prioritize keywords from job description
 * Prioritizes based on frequency and linguistic patterns
 */
export function extractAndPrioritizeKeywords(jobDescription) {
  if (!jobDescription.trim()) return { priority: [], nice: [] };

  const text = jobDescription.toLowerCase();

  // Extract multi-word phrases (2-4 words) first - usually more specific/important
  const phraseRegex = /\b([a-zàâäçèéêëîïôûüœ]{3,}(?:\s+[a-zàâäçèéêëîïôûüœ]{3,}){1,3})\b/g;
  const phrases = [...new Set(text.match(phraseRegex) || [])].filter(
    (p) => p.split(" ").length <= 4,
  );

  // Extract single words (4+ chars) as secondary
  const singleWordRegex = /\b[a-zàâäçèéêëîïôûüœ]{4,}\b/g;
  const singleWords = [...new Set(text.match(singleWordRegex) || [])];

  // Filter out common English/French stopwords
  const stopwords = new Set([
    "able", "about", "above", "after", "again", "all", "also", "among",
    "another", "area", "areas", "around", "back", "based", "become",
    "been", "before", "being", "best", "between", "both", "business",
    "but", "could", "develop", "did", "different", "do", "does",
    "done", "during", "each", "early", "either", "end", "enough",
    "even", "ever", "every", "face", "fact", "federal", "feel", "few",
    "first", "five", "for", "form", "found", "from", "full", "further",
    "general", "give", "given", "going", "good", "government", "group",
    "had", "have", "having", "head", "help", "here", "high", "high",
    "history", "home", "how", "however", "human", "idea", "identify",
    "if", "image", "important", "include", "including", "increase",
    "individual", "information", "inside", "instead", "interest",
    "into", "issue", "its", "just", "keep", "kind", "know", "large",
    "last", "later", "least", "left", "life", "likely", "line", "live",
    "local", "long", "look", "made", "main", "major", "make", "making",
    "many", "may", "maybe", "mean", "meaning", "meet", "might", "mind",
    "more", "most", "movement", "must", "name", "nation", "natural",
    "nature", "near", "necessary", "need", "never", "new", "next", "no",
    "none", "nor", "north", "not", "note", "nothing", "now", "number",
    "occur", "often", "one", "only", "open", "opportunity", "other",
    "our", "out", "over", "own", "page", "part", "past", "people",
    "perhaps", "person", "point", "political", "possible", "present",
    "president", "pretty", "previous", "probably", "process", "produce",
    "provide", "providing", "public", "pull", "put", "question", "quite",
    "rather", "reach", "read", "ready", "real", "reason", "receive",
    "recent", "record", "reduce", "reflect", "region", "right", "role",
    "room", "rule", "running", "safe", "said", "same", "scale", "scene",
    "school", "score", "section", "seem", "seen", "self", "sense", "sent",
    "serve", "service", "set", "seven", "several", "shall", "share",
    "she", "should", "shoulder", "shown", "side", "significant", "similar",
    "simple", "simply", "since", "site", "situation", "six", "size",
    "small", "so", "social", "some", "something", "sometimes", "son",
    "soon", "sort", "source", "south", "space", "speak", "special",
    "specific", "speech", "spend", "spring", "staff", "stage", "stand",
    "start", "state", "statement", "station", "stay", "step", "still",
    "stock", "stop", "story", "straight", "strategy", "street", "strong",
    "structure", "student", "stuff", "style", "subject", "success",
    "such", "suddenly", "suffer", "sufficient", "suggest", "summer",
    "support", "suppose", "sure", "surface", "system", "table", "take",
    "talk", "team", "tell", "ten", "tend", "term", "test", "text", "than",
    "thank", "that", "the", "their", "them", "themselves", "then", "theory",
    "there", "these", "they", "thing", "things", "think", "third", "this",
    "though", "thought", "three", "through", "throughout", "thus", "time",
    "tired", "to", "today", "together", "told", "tomorrow", "tone", "tonight",
    "too", "took", "total", "tough", "town", "track", "trade", "training",
    "travel", "treat", "tree", "trend", "trial", "tribe", "tried", "tries",
    "trip", "trouble", "true", "truth", "try", "turn", "twice", "type",
    "under", "understand", "unit", "united", "until", "unusual", "up",
    "upon", "use", "used", "useful", "usual", "usually", "value", "various",
    "vast", "very", "view", "visit", "voice", "vote", "wait", "walk", "wall",
    "want", "war", "warm", "watch", "water", "wave", "ways", "wealth",
    "wear", "week", "weight", "well", "went", "were", "west", "what",
    "whatever", "when", "where", "whether", "which", "while", "white",
    "who", "whole", "whose", "wide", "wife", "will", "window", "wish",
    "with", "within", "without", "woman", "women", "wonder", "words",
    "work", "world", "worry", "would", "write", "writing", "written",
    "wrong", "wrote", "yard", "yeah", "year", "young", "your", "yourself",
    // French stopwords
    "à", "un", "une", "des", "de", "le", "la", "les", "et", "ou", "mais",
    "pour", "par", "avec", "sans", "dans", "sur", "sous", "entre", "vers",
    "lui", "elle", "ils", "elles", "je", "tu", "nous", "vous", "moi",
    "toi", "ce", "cet", "cette", "ceux", "celle", "ce", "c", "qu", "qui",
    "que", "quoi", "quel", "quelle", "pas", "plus", "moins", "bien",
    "aussi", "encore", "seulement", "alors", "donc", "où", "quand",
    "comment", "pourquoi", "combien", "beaucoup", "peu", "rien",
    "tout", "quelque", "certain", "autre", "même", "tel", "tant",
    "très", "assez", "plutôt", "tellement", "avoir", "être", "faire",
    "aller", "pouvoir", "devoir", "vouloir", "savoir", "voir", "dire",
    "donner", "trouver", "prendre", "mettre", "porter", "venir",
    "aller", "partir", "arriver", "passer", "rester", "tenir", "venir",
    "savoir", "croire", "penser", "sembler", "paraître", "sentir",
    "écouter", "entendre", "regarder", "voir", "montrer", "présenter",
    "obtenir", "recevoir", "donner", "offrir", "proposer", "suggérer",
    "demander", "poser", "répondre", "dire", "parler", "discuter",
    "expliquer", "comprendre", "saisir", "percevoir", "connaître",
  ]);

  // Get keyword frequency
  const keywordFreq = new Map();
  phrases.forEach((phrase) => {
    const count = (text.match(new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
    keywordFreq.set(phrase, count);
  });
  singleWords
    .filter((word) => !stopwords.has(word))
    .forEach((word) => {
      if (!keywordFreq.has(word)) {
        const count = (text.match(new RegExp(`\\b${word}\\b`, "g")) || []).length;
        keywordFreq.set(word, count);
      }
    });

  // Separate into priority (appears 2+ times) and nice-to-have (appears 1 time)
  const priority = [];
  const nice = [];

  keywordFreq.forEach((freq, keyword) => {
    if (freq >= 2) {
      priority.push(keyword);
    } else {
      nice.push(keyword);
    }
  });

  // Sort by frequency (descending)
  priority.sort((a, b) => keywordFreq.get(b) - keywordFreq.get(a));
  nice.sort((a, b) => keywordFreq.get(b) - keywordFreq.get(a));

  return {
    priority: priority.slice(0, 8), // Top 8 priority keywords
    nice: nice.slice(0, 8), // Top 8 nice-to-have
  };
}

/**
 * Find where keywords appear in CV content
 */
export function findKeywordMatches(cvData) {
  const sections = {
    title: cvData.title?.toLowerCase() || "",
    summary: cvData.summary?.toLowerCase() || "",
    skills: (cvData.skills || []).join(" ").toLowerCase(),
    experiences: (cvData.experiences || [])
      .map((e) => `${e.role} ${e.description}`)
      .join(" ")
      .toLowerCase(),
    educations: (cvData.educations || [])
      .map((e) => `${e.degree} ${e.school}`)
      .join(" ")
      .toLowerCase(),
    languages: (cvData.languages || []).map((l) => l.name).join(" ").toLowerCase(),
  };

  return {
    search: (keyword) => {
      const matches = {};
      Object.entries(sections).forEach(([section, content]) => {
        if (content.includes(keyword.toLowerCase())) {
          matches[section] = true;
        }
      });
      return matches;
    },
    getSectionContent: (section) => sections[section],
  };
}

/**
 * Calculate comprehensive ATS score with section breakdown
 */
export function calculateAtsScore(cvData, priorityKeywords, niceKeywords) {
  const matcher = findKeywordMatches(cvData);
  let score = 0;
  const weights = {
    title: 0.3,
    skills: 0.3,
    summary: 0.2,
    experiences: 0.15,
    others: 0.05,
  };

  // Count matched priority keywords (more important)
  const priorityMatches = priorityKeywords.filter((kw) => {
    const matches = matcher.search(kw);
    return Object.values(matches).some((v) => v);
  });

  // Count matched nice-to-have keywords
  const niceMatches = niceKeywords.filter((kw) => {
    const matches = matcher.search(kw);
    return Object.values(matches).some((v) => v);
  });

  // Section-specific scoring
  const sectionScores = {
    title: cvData.title && priorityKeywords.some((kw) => cvData.title.toLowerCase().includes(kw))
      ? 1
      : 0.5,
    skills: cvData.skills.length > 0
      ? Math.min(1, cvData.skills.length / 5)
      : 0,
    summary: cvData.summary?.trim().length > 20
      ? Math.min(1, cvData.summary.trim().length / 200)
      : 0,
    experiences: cvData.experiences.length > 0
      ? Math.min(1, cvData.experiences.length / 3)
      : 0,
  };

  // Calculate weighted score
  score +=
    sectionScores.title * weights.title +
    sectionScores.skills * weights.skills +
    sectionScores.summary * weights.summary +
    sectionScores.experiences * weights.experiences;

  // Bonus for matched keywords
  const priorityBonus = Math.min(0.2, (priorityMatches.length / priorityKeywords.length) * 0.2);
  const niceBonus = Math.min(0.1, (niceMatches.length / niceKeywords.length) * 0.1);

  score += priorityBonus + niceBonus;

  return {
    score: Math.round(Math.min(score * 100, 100)),
    matchedPriority: priorityMatches,
    matchedNice: niceMatches,
    missingPriority: priorityKeywords.filter((kw) => !priorityMatches.includes(kw)),
    missingNice: niceKeywords.filter((kw) => !niceMatches.includes(kw)),
    sectionScores,
  };
}

/**
 * Generate actionable recommendations based on ATS analysis
 */
export function generateRecommendations(cvData, atsResult, jobDescription) {
  const recommendations = [];

  if (!jobDescription.trim()) {
    return [
      {
        priority: "high",
        category: "General",
        message: "Paste a job description above to get personalized ATS recommendations",
        action: null,
      },
    ];
  }

  // Title recommendations
  if (atsResult.sectionScores.title < 0.7) {
    recommendations.push({
      priority: "high",
      category: "Job Title",
      message: "Your job title doesn't match the position. Update it to include relevant keywords from the job description.",
      action: "update-title",
      keywords: atsResult.missingPriority.slice(0, 3),
    });
  }

  // Skills recommendations
  if (atsResult.missingPriority.length > 0) {
    const skillGap = atsResult.missingPriority.slice(0, 5);
    recommendations.push({
      priority: "high",
      category: "Skills Section",
      message: `Add these critical skills: ${skillGap.join(", ")}`,
      action: "add-skills",
      keywords: skillGap,
    });
  }

  // Summary recommendations
  if (atsResult.sectionScores.summary < 0.5) {
    recommendations.push({
      priority: "medium",
      category: "Professional Summary",
      message: "Write a more comprehensive professional summary that includes key skills and experience from the job posting.",
      action: "improve-summary",
      keywords: atsResult.missingPriority.slice(0, 2),
    });
  }

  // Experience recommendations
  if (atsResult.sectionScores.experiences < 0.5 && cvData.experiences.length === 0) {
    recommendations.push({
      priority: "high",
      category: "Experience",
      message: "Add work experiences to demonstrate relevant background for this position.",
      action: "add-experience",
    });
  } else if (atsResult.missingPriority.length > 0) {
    recommendations.push({
      priority: "medium",
      category: "Experience Details",
      message: "Update your experience descriptions to include relevant achievements and skills from the job description.",
      action: "update-experience",
      keywords: atsResult.missingNice.slice(0, 3),
    });
  }

  // Nice-to-have recommendations
  if (atsResult.missingNice.length > 3) {
    recommendations.push({
      priority: "low",
      category: "Additional Keywords",
      message: `Consider adding: ${atsResult.missingNice.slice(0, 3).join(", ")}`,
      action: "add-optional-keywords",
      keywords: atsResult.missingNice.slice(0, 3),
    });
  }

  return recommendations;
}

/**
 * Get score interpretation
 */
export function getScoreInterpretation(score) {
  if (score >= 85) {
    return {
      level: "Excellent",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30",
      message: "Your CV is well-optimized for this position",
    };
  } else if (score >= 70) {
    return {
      level: "Good",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      message: "Your CV matches well, but could be improved",
    };
  } else if (score >= 50) {
    return {
      level: "Fair",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/30",
      message: "Your CV has some relevant content, but needs improvements",
    };
  } else {
    return {
      level: "Needs Work",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
      message: "Significant updates needed to match this position",
    };
  }
}
