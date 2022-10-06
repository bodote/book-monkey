import { initialBookEntityState, reducer } from './book-entity.reducer';

describe('BookEntity Reducer', () => {
  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialBookEntityState, action);

      expect(result).toBe(initialBookEntityState);
    });
  });
});
