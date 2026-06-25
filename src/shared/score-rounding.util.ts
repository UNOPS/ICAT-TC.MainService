/**
 * Rounds a score down to the nearest half-integer (0, 0.5, 1, 1.5, …).
 */
export function floorToHalf(value: number): number {
  return Math.floor(value * 2) / 2;
}

export function floorToHalfOrNull(
  value: number | null | undefined,
): number | null {
  if (value == null) {
    return null;
  }

  return floorToHalf(value);
}

/**
 * Maps a display score to the whole-integer matrix grid coordinate (always rounds down).
 */
export function floorToWholeForMatrix(value: number): number {
  return Math.floor(value);
}

export function scoresMatchMatrixCell(
  processScore: number,
  outcomeScore: number,
  matrixProcessY: number,
  matrixOutcomeX: number,
): boolean {
  return (
    floorToWholeForMatrix(processScore) === matrixProcessY &&
    floorToWholeForMatrix(outcomeScore) === matrixOutcomeX
  );
}
