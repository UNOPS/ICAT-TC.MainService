import {
  floorToHalf,
  floorToHalfOrNull,
  floorToWholeForMatrix,
  scoresMatchMatrixCell,
} from './score-rounding.util';

describe('score-rounding.util', () => {
  describe('floorToHalf', () => {
    it('floors to the nearest half-integer', () => {
      expect(floorToHalf(2.9)).toBe(2.5);
      expect(floorToHalf(2.5)).toBe(2.5);
      expect(floorToHalf(2.3)).toBe(2);
      expect(floorToHalf(-1.3)).toBe(-1.5);
      expect(floorToHalf(-1.1)).toBe(-1.5);
    });
  });

  describe('floorToHalfOrNull', () => {
    it('returns null for nullish values', () => {
      expect(floorToHalfOrNull(null)).toBeNull();
      expect(floorToHalfOrNull(undefined)).toBeNull();
    });
  });

  describe('floorToWholeForMatrix', () => {
    it('floors display scores for matrix placement', () => {
      expect(floorToWholeForMatrix(2.9)).toBe(2);
      expect(floorToWholeForMatrix(2.5)).toBe(2);
      expect(floorToWholeForMatrix(-0.5)).toBe(-1);
    });
  });

  describe('scoresMatchMatrixCell', () => {
    it('matches matrix cells using floored coordinates', () => {
      expect(scoresMatchMatrixCell(2.9, 1.5, 2, 1)).toBe(true);
      expect(scoresMatchMatrixCell(2.5, 2.5, 2, 2)).toBe(true);
      expect(scoresMatchMatrixCell(2.5, 2.5, 3, 2)).toBe(false);
    });
  });
});
