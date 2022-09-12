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
    showSaveSuccess: boolean;
  };
}
export const initialState: State = {
  books: [],
  uiState: {
    currentBook: undefined,
    loading: false,
    httpError: null,
    errorMessage: null,
    showSaveSuccess: false
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
  on(BookActions.httpFailure, (state, action): State => {
    //return state;
    return {
      ...state,
      uiState: { ...state.uiState, loading: false, httpError: action.httpError }
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
  }),
  on(BookActions.deleteBook, (state, action): State => {
    console.log('deleteBook Action with isbn:' + action.isbn);
    return {
      ...state,
      uiState: { ...state.uiState, loading: true, httpError: null }
    };
  }),
  on(BookActions.deleteBookSuccess, (state, action): State => {
    const index = state.books.findIndex((book) => book.isbn === action.isbn);
    let newBooksA = [...state.books];
    newBooksA.splice(index, 1);
    return {
      ...state,
      books: newBooksA,
      uiState: { ...state.uiState, loading: false }
    };
  }),
  on(BookActions.addBook, (state, action): State => {
    return {
      ...state,
      uiState: {
        ...state.uiState,
        loading: true,
        httpError: null,
        showSaveSuccess: false
      }
    };
  }),
  on(BookActions.addBookSuccess, (state, action): State => {
    const books = [...state.books];
    books.push(action.book);
    return {
      ...state,
      books: books,
      uiState: { ...state.uiState, loading: false, showSaveSuccess: true }
    };
  }),
  on(BookActions.saveCurrentBook, (state, action): State => {
    return {
      ...state,
      uiState: {
        ...state.uiState,
        loading: true,
        httpError: null,
        showSaveSuccess: false
      }
    };
  }),
  on(BookActions.saveCurrentBookSuccess, (state, action): State => {
    let books = [...state.books];
    //replace book
    books = books.map((book) => {
      if (book.isbn === action.book.isbn) return action.book;
      else return book;
    });
    return {
      ...state,
      books: books,
      uiState: { ...state.uiState, loading: false, showSaveSuccess: true }
    };
  })
);
