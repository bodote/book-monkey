import { loaderState, reducer } from './router.reducer';

describe('Router Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(loaderState, action);

      expect(result).toBe(loaderState);
    });
  });
});
