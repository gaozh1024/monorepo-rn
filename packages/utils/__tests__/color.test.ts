import { hexToRgb, rgbaToRgb } from '../src/color';

describe('color', () => {
  describe('hexToRgb', () => {
    it('should convert 6-digit hex to RGB', () => {
      expect(hexToRgb('#f38b32')).toBe('243 139 50');
    });

    it('should convert 3-digit hex to RGB', () => {
      expect(hexToRgb('#f38')).toBe('255 51 136');
    });

    it('should handle uppercase hex', () => {
      expect(hexToRgb('#F38B32')).toBe('243 139 50');
    });
  });

  describe('rgbaToRgb', () => {
    it('should convert rgba to RGB', () => {
      expect(rgbaToRgb('rgba(243, 139, 50, 0.5)')).toBe('243 139 50');
    });

    it('should convert rgb to RGB', () => {
      expect(rgbaToRgb('rgb(243, 139, 50)')).toBe('243 139 50');
    });
  });
});
