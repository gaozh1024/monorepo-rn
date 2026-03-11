import { generateColorPalette, generateColorPalettes } from '../src/palette';

describe('palette', () => {
  describe('generateColorPalette', () => {
    it('should generate palette with all required keys', () => {
      const palette = generateColorPalette('#f38b32');

      expect(palette).toHaveProperty('0');
      expect(palette).toHaveProperty('50');
      expect(palette).toHaveProperty('100');
      expect(palette).toHaveProperty('200');
      expect(palette).toHaveProperty('300');
      expect(palette).toHaveProperty('400');
      expect(palette).toHaveProperty('500');
      expect(palette).toHaveProperty('600');
      expect(palette).toHaveProperty('700');
      expect(palette).toHaveProperty('800');
      expect(palette).toHaveProperty('900');
      expect(palette).toHaveProperty('950');
    });

    it('should generate correct base color at 500', () => {
      const palette = generateColorPalette('#f38b32');
      expect(palette[500]).toBe('243 139 50');
    });
  });

  describe('generateColorPalettes', () => {
    it('should generate multiple palettes', () => {
      const palettes = generateColorPalettes({
        primary: '#f38b32',
        secondary: '#4A5568',
      });

      expect(palettes).toHaveProperty('primary');
      expect(palettes).toHaveProperty('secondary');
      expect(palettes.primary[500]).toBe('243 139 50');
    });
  });
});
