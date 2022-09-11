import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromBook from './book.reducer';

export const selectBookState = createFeatureSelector<fromBook.State>(
  fromBook.bookFeatureKey
);

export const selectAllBooks = createSelector(
  selectBookState,
  (state) => state.books
);

export const selectCurrentBook = createSelector(
  selectBookState,
  (state) => state.uiState.currentBook
);

export const selectIsLoading = createSelector(
  selectBookState,
  (state) => state.uiState.loading
);

export const selectError = createSelector(selectBookState, (state) => {
  if (!!state.uiState.httpError || state.uiState.errorMessage)
    return {
      http: state.uiState.httpError,
      text: state.uiState.errorMessage
    };
  else return {};
});
