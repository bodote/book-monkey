import { createReducer, on } from '@ngrx/store';
import * as BookActions from './book.actions';
import { Book } from '../../shared/book';
import { HttpErrorResponse } from '@angular/common/http';

export const bookFeatureKey = 'book';

export interface State {
  books: Book[];
  uiState: {
    currentBook: Book | undefined;
    loading: boolean;
    httpError: HttpErrorResponse | null;
    errorMessage: string | null;
  };
}
export const initialState: State = {
  books: [],
  uiState: {
    currentBook: undefined,
    loading: false,
    httpError: null,
    errorMessage: null
  }
};

export const reducer = createReducer(
  initialState,

  on(BookActions.loadBooks, (state): State => {
    return {
      ...state,
      uiState: { ...state.uiState, loading: true, httpError: null }
    };
  }),
  on(BookActions.loadBooksSuccess, (state, action): State => {
    return {
      ...state,
      books: action.books,
      uiState: { ...state.uiState, loading: false }
    };
  }),
  on(BookActions.loadBooksFailure, (state, action): State => {
    //return state;
    return {
      ...state,
      uiState: { ...state.uiState, loading: false, httpError: action.error }
    };
  }),
  on(BookActions.setCurrentBook, (state): State => {
    return {
      ...state,
      uiState: {
        ...state.uiState,
        loading: true,
        httpError: null,
        errorMessage: null
      }
    }; //processed by an effect only
  }),
  on(BookActions.setCurrentBookSuccess, (state, action): State => {
    return {
      ...state,
      uiState: {
        ...state.uiState,
        loading: false,
        currentBook: action.currentBook
      }
    };
  }),
  on(BookActions.loadAllAndSetCurrentBookSuccess, (state, action): State => {
    return {
      ...state,
      books: action.books,
      uiState: {
        ...state.uiState,
        loading: false,
        currentBook: action.currentBook,
        httpError: null
      }
    };
  }),
  on(BookActions.loadBooksOkButNotFound, (state, action): State => {
    return {
      ...state,
      books: action.books,
      uiState: {
        ...state.uiState,
        loading: false,
        httpError: null,
        errorMessage: action.errorMessage
      }
    };
  })
);
