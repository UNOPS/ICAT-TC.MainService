export const SDG_CLIMATE_ACTION_NUMBER = 13;

export const SDG_CLIMATE_ACTION_SCALE_NAME_PREFIX = 'SDG 13 -';

export function isGhgOutcomeModuleUsed(
  scores: (number | null | undefined)[],
): boolean {
  return scores.some(
    (score) => score != null && score !== 99 && score !== -99,
  );
}

export function averageValidOutcomeScores(
  scores: (number | null | undefined)[],
): number | null {
  const valid = scores.filter(
    (score) => score != null && score !== 99 && score !== -99,
  ) as number[];

  if (valid.length === 0) {
    return null;
  }

  return valid.reduce((sum, score) => sum + score, 0) / valid.length;
}

/**
 * Averages the sub-scores that are relevant (e.g. scale + sustained within an
 * outcome dimension), excluding any that were marked not relevant (null /
 * undefined) instead of counting them as zero. Returns null when none of the
 * sub-scores are relevant.
 */
export function averageRelevantScores(
  scores: (number | null | undefined)[],
): number | null {
  const relevant = scores.filter(
    (score): score is number => score !== null && score !== undefined,
  );

  if (relevant.length === 0) {
    return null;
  }

  return relevant.reduce((sum, score) => sum + score, 0) / relevant.length;
}

export function shouldFallbackGhgCategoryToSdg13(
  ghgScores: (number | null | undefined)[],
  currentGhgCategoryScore: number | null | undefined,
  sdg13CategoryScore: number | null,
): boolean {
  if (sdg13CategoryScore == null) {
    return false;
  }

  if (!isGhgOutcomeModuleUsed(ghgScores)) {
    return true;
  }

  if (currentGhgCategoryScore !== 0) {
    return false;
  }

  const usedScores = ghgScores.filter(
    (score) => score != null && score !== 99 && score !== -99,
  ) as number[];

  return (
    usedScores.length > 0 &&
    usedScores.every((score) => score === 0) &&
    sdg13CategoryScore !== 0
  );
}

export const shouldFallbackGhgScaleToSdg13 = shouldFallbackGhgCategoryToSdg13;

export const shouldFallbackGhgSustainedToSdg13 =
  shouldFallbackGhgCategoryToSdg13;
