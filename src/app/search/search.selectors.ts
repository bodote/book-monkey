import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromSearch from './search.reducer';
import { HttpErrorResponse } from '@angular/common/http';
import { searchFeatureKey } from '../store';
import { BookEntity } from '../books/store/book-entity/book-entity.model';

export const selectSearchState =
  createFeatureSelector<fromSearch.SearchState>(searchFeatureKey);

export const selectSearchResults = createSelector(
  selectSearchState,
  (state): BookEntity[] => state.books
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
