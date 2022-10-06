import { initialSearchState, SearchState } from './search.reducer';
import {
  selectHttpError,
  selectSearchPerformed,
  selectSearchResults,
  selectSearchState
} from './search.selectors';
import { mockState } from '../store/index.spec';
import { HttpErrorResponse } from '@angular/common/http';
import { of, toArray } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { select } from '@ngrx/store';
import { searchFeatureKey } from '../store';
import { BookEntity } from '../books/store/book-entity/book-entity.model';

describe('Search Selectors', () => {
  const aBook: BookEntity = {
    authors: [],
    isbn: '123',
    published: new Date('2020-02-02'),
    title: 'mytitle'
  };
  it('should select the feature state', () => {
    const rootState = mockState({ [searchFeatureKey]: initialSearchState });
    expect(selectSearchState(rootState)).toEqual(initialSearchState);
  });

  it('should select the searchState', () => {
    const state1: SearchState = {
      ...initialSearchState,
      searchPerformed: false
    };

    let filtered = selectSearchPerformed.projector(state1);
    expect(filtered).toBeFalse();
    const state2: SearchState = {
      ...initialSearchState,
      searchPerformed: true
    };
    filtered = selectSearchPerformed.projector(state2);
    expect(filtered).toBeTrue();
  });
  it('should select the SearchResults', () => {
    const state1: SearchState = {
      ...initialSearchState,
      books: []
    };

    let filtered = selectSearchResults.projector(state1);
    expect(filtered).toEqual([]);

    const state2: SearchState = {
      ...initialSearchState,
      books: [aBook]
    };
    filtered = selectSearchResults.projector(state2);
    expect(filtered).toEqual([aBook]);
  });
  it('should select the HttpError', () => {
    const error = new HttpErrorResponse({ status: 404 });
    const state1: SearchState = {
      ...initialSearchState,
      httpError: error
    };
    let filtered = selectHttpError.projector(state1);
    expect(filtered).toEqual(error);
  });
  describe('selectors Observable', () => {
    let store: MockStore;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          // any modules needed
        ],
        providers: [
          provideMockStore({ initialState: initialSearchState })
          // other providers
        ]
      });

      store = TestBed.inject(MockStore);
    });
    it('selectSearchPerformed should emit the search state', (done) => {
      const unloadedState: { [index: string]: any } = mockState({
        [searchFeatureKey]: {
          books: [aBook],
          searchPerformed: false,
          httpError: undefined
        }
      });
      const searchResultsState: { [index: string]: any } = mockState({
        [searchFeatureKey]: {
          books: [],
          searchPerformed: true,
          httpError: undefined
        }
      });
      store.setState(unloadedState);

      of(unloadedState, searchResultsState)
        .pipe(select(selectSearchPerformed), toArray())
        .subscribe((states) => {
          expect(states.length).toBe(2);
          expect(states[0]).toEqual(
            unloadedState[searchFeatureKey].searchPerformed
          );
          expect(states[1]).toEqual(
            searchResultsState[searchFeatureKey].searchPerformed
          );
          done();
        });
    });
    it('selectSearchResults should emit the found books once loaded', (done) => {
      const unloadedState = mockState({
        [searchFeatureKey]: {
          books: [],
          searchPerformed: false,
          httpError: undefined
        }
      });
      const searchResultsState = mockState({
        [searchFeatureKey]: {
          books: [aBook],
          searchPerformed: true,
          httpError: undefined
        }
      });
      store.setState(unloadedState);

      of(unloadedState, searchResultsState)
        .pipe(select(selectSearchResults), toArray())
        .subscribe((states) => {
          expect(states.length).toBe(2);
          expect(states[0]).toEqual([]);
          expect(states[1]).toEqual([aBook]);
          done();
        });
    });
  });
});
