import { Book } from '../shared/book';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromSearch from './search.reducer';
import { HttpErrorResponse } from '@angular/common/http';

export const searchFeatureKey = 'search';
export const selectSearchState =
  createFeatureSelector<fromSearch.SearchState>(searchFeatureKey);

export const selectSearchResults = createSelector(
  selectSearchState,
  (state): Book[] => state.books
);

export const selectSearchPerformed = createSelector(
  selectSearchState,
  (state): boolean => {
    return state.searchPerformed;
  }
);

export const selectHttpError = createSelector(
  selectSearchState,
  (state): HttpErrorResponse | undefined => {
    return state.httpError;
  }
);
