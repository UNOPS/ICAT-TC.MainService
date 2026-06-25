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

  return Math.round(valid.reduce((sum, score) => sum + score, 0) / valid.length);
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
