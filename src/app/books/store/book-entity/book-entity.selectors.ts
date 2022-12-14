import { adapter } from './book-entity.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromBook from '../book-entity/book-entity.reducer';
import { HttpErrorResponse } from '@angular/common/http';
import { BookEntity } from './book-entity.model';

//these are just EntitySelectors NOT MemoizedSelectors !
export const { selectIds, selectEntities, selectAll, selectTotal } =
  adapter.getSelectors();

export const selectBookState = createFeatureSelector<fromBook.BookEntityState>(
  fromBook.bookEntitiesFeatureKey
);

export const selectBookIds = createSelector(selectBookState, (state) =>
  selectIds(state)
);

export const selectErrorState = createSelector(selectBookState, (state) => {
  if (!!state.httpError || !!state.errorMessage)
    return {
      httpError: state.httpError,
      errorMessage: state.errorMessage,
      lastUpdateTS: state.lastUpdateTS
    };
  else return {};
});

export const selectCurrentBook = createSelector(selectBookState, (state) => {
  if (!!state.currentBookId) {
    return state.entities[state.currentBookId];
  } else return null;
});

export interface curBookTS {
  currentBookId: string | undefined;
  lastUpdateTS: number;
  httpError: HttpErrorResponse | null;
  errorMessage: string | null;
  allBooks: BookEntity[];
}

export const selectCurrentBookAndAll = createSelector(
  selectBookState,
  (state): curBookTS => {
    return {
      currentBookId: state.currentBookId,
      httpError: state.httpError,
      errorMessage: state.errorMessage,
      lastUpdateTS: state.lastUpdateTS,
      allBooks: selectAll(state)
    };
  }
);

export const selectShowSavedSuccess = createSelector(
  selectBookState,
  (state) => {
    return state.showSaveSuccess;
  }
);

export const selectTotalBooks = createSelector(selectBookState, (state) => {
  return selectTotal(state);
});
export const selectAllBookEntities = createSelector(
  selectBookState,
  (state) => {
    return selectAll(state);
  }
);

export const selectTotalAndErrors = createSelector(selectBookState, (state) => {
  if (!state)
    return {
      total: 0,
      lastUpdateTS: 0,
      httpError: null,
      errorMessage: null
    };
  return {
    total: selectTotal(state),
    lastUpdateTS: state.lastUpdateTS,
    httpError: state.httpError,
    errorMessage: state.errorMessage
  };
});
