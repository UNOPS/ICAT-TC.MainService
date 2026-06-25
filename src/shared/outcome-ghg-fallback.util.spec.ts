import {
  averageValidOutcomeScores,
  isGhgOutcomeModuleUsed,
  shouldFallbackGhgScaleToSdg13,
  shouldFallbackGhgSustainedToSdg13,
} from './outcome-ghg-fallback.util';

describe('outcome-ghg-fallback.util', () => {
  describe('isGhgOutcomeModuleUsed', () => {
    it('returns false when all scores are outside boundaries or unset', () => {
      expect(isGhgOutcomeModuleUsed([null, 99, -99, undefined])).toBe(false);
    });

    it('returns true when at least one valid score exists', () => {
      expect(isGhgOutcomeModuleUsed([null, 0, 99])).toBe(true);
      expect(isGhgOutcomeModuleUsed([3])).toBe(true);
    });
  });

  describe('averageValidOutcomeScores', () => {
    it('averages valid scores and ignores outside-boundary values', () => {
      expect(averageValidOutcomeScores([3, 3, -99, null])).toBe(3);
      expect(averageValidOutcomeScores([-99, null])).toBeNull();
    });
  });

  describe.each([
    ['scale', shouldFallbackGhgScaleToSdg13],
    ['sustained', shouldFallbackGhgSustainedToSdg13],
  ])('shouldFallbackGhg%sToSdg13', (_label, shouldFallback) => {
    it('falls back when the GHG module was not used', () => {
      expect(shouldFallback([null, 99], null, 3)).toBe(true);
    });

    it('falls back when GHG score is none but SDG 13 has impact', () => {
      expect(shouldFallback([0, 0], 0, 3)).toBe(true);
    });

    it('does not fall back when GHG score already reflects impact', () => {
      expect(shouldFallback([2, 2], 2, 3)).toBe(false);
    });

    it('does not fall back without SDG 13 data', () => {
      expect(shouldFallback([null, 99], null, null)).toBe(false);
    });
  });
});
