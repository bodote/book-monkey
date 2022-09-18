import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromBook from './book.reducer';
import { Book } from '../../shared/book';

export const selectBookState = createFeatureSelector<fromBook.BookState>(
  fromBook.bookFeatureKey
);

export const selectAllBooks = createSelector(
  selectBookState,
  (state) => state.books
);

export const selectCurrentBook = createSelector(selectBookState, (state) => {
  if (!!state?.uiState) {
    return state?.uiState?.currentBook;
  } else return null;
});

export const selectIsLoading = createSelector(
  selectBookState,
  (state) => state?.uiState?.loading
);

export const selectSaveSuccess = createSelector(
  selectBookState,
  (state) => state.uiState.showSaveSuccess
);

export const selectError = createSelector(selectBookState, (state) => {
  if (!!state?.uiState?.httpError || !!state?.uiState?.errorMessage)
    return {
      http: state.uiState?.httpError,
      text: state.uiState?.errorMessage
    };
  else return {};
});

export const selectSearchResults = createSelector(
  selectBookState,
  (state): Book[] => {
    if (!!state?.uiState?.searchResults) return state.uiState.searchResults;
    else return [];
  }
);
