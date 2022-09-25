import { adapter } from './book-entity.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromBook from '../book-entity/book-entity.reducer';

export const { selectIds, selectEntities, selectAll, selectTotal } =
  adapter.getSelectors();

export const selectBookState = createFeatureSelector<fromBook.BookEntityState>(
  fromBook.bookEntitiesFeatureKey
);

export const selectErrorState = createSelector(selectBookState, (state) => {
  console.log('selectErrorState', state);
  return {
    httpError: state.httpError,
    errorMessage: state.errorMessage,
    lastUpdateTS: state.lastUpdateTS
  };
});

export const selectSaveSuccess = createSelector(selectBookState, (state) => {
  return state.showSaveSuccess;
});

export const selectTotalBooks = createSelector(selectBookState, (state) => {
  return selectTotal(state);
});
export const selectAllBookEntities = createSelector(
  selectBookState,
  (state) => {
    return selectAll(state);
  }
);

export const selectTotalAndErrors = createSelector(
  selectTotalBooks,
  selectErrorState,
  (total, errorState) => {
    console.log('selector, lastUpdateTS: ', errorState);
    return {
      total: total,
      lastUpdateTS: errorState.lastUpdateTS,
      httpError: errorState.httpError,
      errorMessage: errorState.errorMessage
    };
  }
);
