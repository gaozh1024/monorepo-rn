import { BaseAPI, APIError, ApiErrorCode } from '../src/api/base-api';

describe('BaseAPI', () => {
  let api: BaseAPI;

  beforeEach(() => {
    api = new BaseAPI({
      baseURL: 'https://api.example.com',
    });
  });

  describe('constructor', () => {
    it('should create instance with config', () => {
      expect(api).toBeInstanceOf(BaseAPI);
    });
  });

  describe('token management', () => {
    it('should set and get token', () => {
      api.setToken('test-token');
      expect(api.getToken()).toBe('test-token');
    });

    it('should clear token', () => {
      api.setToken('test-token');
      api.clearToken();
      expect(api.getToken()).toBeUndefined();
    });
  });
});
