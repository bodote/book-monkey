import { Book } from '../shared/book';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromSearch from './search.reducer';

export const selectSearchState = createFeatureSelector<fromSearch.SearchState>(
  fromSearch.searchFeatureKey
);

export const selectSearchResults = createSelector(
  selectSearchState,
  (state): Book[] => {
    if (!!state?.books) return state.books;
    else return [];
  }
);

export const selectSearchPerformed = createSelector(
  selectSearchState,
  (state): boolean => {
    return state.searchPerformed;
  }
);
