import { initialState, reducer, SearchState } from './search.reducer';
import {
  loadSearchs,
  loadSearchsFailure,
  loadSearchsSuccess
} from './search.actions';
import { HttpErrorResponse } from '@angular/common/http';

describe('Search Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const result = reducer(initialState, {} as any);
      expect(result).toBe(initialState);
      expect(result.httpError).toBeFalsy();
      expect(result.searchPerformed).toBeFalse();
    });
    it('should delete the searchPerformed flag if loadSearchs action', () => {
      const stateBefore: SearchState = {
        ...initialState,
        searchPerformed: true
      };
      const stateAfter: SearchState = {
        ...initialState,
        searchPerformed: false
      };
      const result = reducer(stateBefore, loadSearchs);
      expect(result).toEqual(stateAfter);
    });
    it('should delete the searchPerformed flag if loadSearchSuccess action', () => {
      const aBook = {
        title: 'string',
        authors: ['author'],
        published: new Date('2020-02-02'),
        isbn: '1234'
      };
      const stateBefore: SearchState = {
        ...initialState,
        searchPerformed: false
      };
      const stateAfter: SearchState = {
        ...initialState,
        searchPerformed: true,
        books: [aBook]
      };
      const result = reducer(
        stateBefore,
        loadSearchsSuccess({ searchResults: [aBook] })
      );
      expect(result).toEqual(stateAfter);
    });
    it('should delete the searchPerformed flag if loadSearchFailure action', () => {
      const httpError = new HttpErrorResponse({ status: 404 });
      const stateBefore: SearchState = {
        ...initialState,
        searchPerformed: false
      };
      const stateAfter: SearchState = {
        ...initialState,
        searchPerformed: true,
        httpError: httpError
      };
      const result = reducer(
        stateBefore,
        loadSearchsFailure({ error: httpError })
      );
      expect(result).toEqual(stateAfter);
    });
  });
});
