import { z } from 'zod';
import { getValidationErrors, hasErrors, getFieldError } from '../src/validation';

describe('validation', () => {
  describe('getValidationErrors', () => {
    it('should convert ZodError to field error map', () => {
      const schema = z.object({
        email: z.string().email(),
        age: z.number().min(18),
      });

      try {
        schema.parse({ email: 'invalid', age: 16 });
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors = getValidationErrors(error);
          expect(errors.email).toBeDefined();
          expect(errors.age).toBeDefined();
        }
      }
    });
  });

  describe('hasErrors', () => {
    it('should return true when errors exist', () => {
      expect(hasErrors({ email: 'error' })).toBe(true);
    });

    it('should return false when no errors', () => {
      expect(hasErrors({})).toBe(false);
    });
  });

  describe('getFieldError', () => {
    it('should return error for existing field', () => {
      const errors = { email: 'Invalid email' };
      expect(getFieldError(errors, 'email')).toBe('Invalid email');
    });

    it('should return undefined for non-existing field', () => {
      const errors = { email: 'Invalid email' };
      expect(getFieldError(errors, 'password')).toBeUndefined();
    });
  });
});
