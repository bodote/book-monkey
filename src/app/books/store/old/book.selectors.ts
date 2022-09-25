import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromBook from './book.reducer';

export const selectBookState = createFeatureSelector<fromBook.BookState>(
  fromBook.bookFeatureKey
);

export const selectAllBooksOrHttpError = createSelector(
  selectBookState,
  (state) => {
    console.log('selector, lastUpdateTS: ', state);
    return {
      books: state.books,
      lastUpdateTS: state.uiState.lastUpdateTS,
      httpError: state.uiState?.httpError
    };
  }
);

export const selectAllBooks = createSelector(selectBookState, (state) => {
  return state.books;
});

export const selectCurrentBook = createSelector(selectBookState, (state) => {
  if (!!state?.uiState) {
    return state?.uiState?.currentBook;
  } else return null;
});
export const selectCurrentBookAndAll = createSelector(
  selectBookState,
  (state) => {
    console.log(
      'selectCurrentBookAndAll timestamp = ' + state.uiState.lastUpdateTS
    );
    return {
      currentBook: state.uiState.currentBook,
      allBooks: state.books,
      lastUpdateTS: state.uiState.lastUpdateTS,
      httpError: state.uiState.httpError,
      errorMessage: state.uiState.errorMessage
    };
  }
);

// export const selectIsLoading = createSelector(
//   selectBookState,
//   (state) => state?.uiState?.loading
// );

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
