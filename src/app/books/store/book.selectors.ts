import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromBook from './book.reducer';

export const selectBookState = createFeatureSelector<fromBook.State>(
  fromBook.bookFeatureKey
);

export const selectAllBooks = createSelector(
  selectBookState,
  (bookState) => bookState.books
);

export const selectCurrentBook = createSelector(
  selectBookState,
  (bookState) => bookState.currentBook
);

export const selectIsLoading = createSelector(
  selectBookState,
  (bookState) => bookState.loading
);

export const selectError = createSelector(selectBookState, (bookState) => {
  return { http: bookState.httpError, text: bookState.errorMessage };
});
