import { createReducer, on } from '@ngrx/store';
import * as BookActions from './book.actions';
import { Book } from '../../../shared/book';
import { HttpErrorResponse } from '@angular/common/http';

export const bookFeatureKey = 'book';

export interface BookState {
  books: Book[];
  uiState: {
    currentBook: Book | undefined;
    //loading: boolean;
    httpError: HttpErrorResponse | null;
    errorMessage: string | null;
    showSaveSuccess: boolean;
    searchResults: Book[];
    lastUpdateTS: number;
  };
}
export const initialState: BookState = {
  books: [],
  uiState: {
    currentBook: undefined,
    //loading: false,
    httpError: null,
    errorMessage: null,
    showSaveSuccess: false,
    searchResults: [],
    lastUpdateTS: 0
  }
};

function loadBooksReducer() {
  return (state: BookState): BookState => {
    return {
      ...state,
      uiState: { ...state.uiState, httpError: null, errorMessage: null }
    };
  };
}

export const reducer = createReducer(
  initialState,
  on(BookActions.loadBooks, loadBooksReducer()),
  on(BookActions.resetErrorsAction, (state, action): BookState => {
    return {
      ...state,
      uiState: { ...state.uiState, httpError: null, errorMessage: null }
    };
  }),
  on(BookActions.loadBooksSuccess, (state, action): BookState => {
    return {
      ...state,
      books: action.books,
      uiState: { ...state.uiState, lastUpdateTS: action.timeStamp }
    };
  }),
  on(BookActions.httpFailure, (state, action): BookState => {
    //return state;
    return {
      ...state,
      uiState: {
        ...state.uiState,
        httpError: action.httpError,
        lastUpdateTS: action.timeStamp
      } //loading: false,
    };
  }),

  on(BookActions.setCurrentBookSuccess, (state, action): BookState => {
    return {
      ...state,
      uiState: {
        ...state.uiState,
        //loading: false,
        currentBook: action.currentBook
      }
    };
  }),
  on(BookActions.loadAllAndSetCurrentBook, (state, action): BookState => {
    console.log(
      'loadAllAndSetCurrentBook Action with timestamp=' +
        state.uiState.lastUpdateTS
    );
    return {
      ...state,
      uiState: { ...state.uiState }
    };
  }),
  on(
    BookActions.loadAllAndSetCurrentBookSuccess,
    (state, action): BookState => {
      console.log(
        'loadAllAndSetCurrentBookSuccess Action with old timestamp=' +
          state.uiState.lastUpdateTS +
          'new Timestamp = ' +
          action.timeStamp
      );
      return {
        ...state,
        books: action.books,
        uiState: {
          ...state.uiState,
          //loading: false,
          currentBook: action.currentBook,
          httpError: null,
          lastUpdateTS: action.timeStamp
        }
      };
    }
  ),
  on(BookActions.isbnNotFound, (state, action): BookState => {
    return {
      ...state,
      uiState: {
        ...state.uiState,
        // loading: false,
        httpError: null,
        errorMessage: action.errorMessage
      }
    };
  }),
  on(BookActions.deleteBook, (state, action): BookState => {
    console.log('deleteBook Action with isbn:' + action.isbn);
    return {
      ...state,
      uiState: { ...state.uiState, httpError: null } // loading: true,
    };
  }),
  on(BookActions.deleteBookSuccess, (state, action): BookState => {
    const index = state.books.findIndex((book) => book.isbn === action.isbn);
    let newBooksA = [...state.books];
    newBooksA.splice(index, 1);
    return {
      ...state,
      books: newBooksA
      //uiState: { ...state.uiState, loading: false }
    };
  }),
  on(BookActions.addBook, (state, action): BookState => {
    return {
      ...state,
      uiState: {
        ...state.uiState,
        // loading: true,
        httpError: null,
        showSaveSuccess: false
      }
    };
  }),
  on(BookActions.addBookSuccess, (state, action): BookState => {
    const books = [...state.books];
    books.push(action.book);
    return {
      ...state,
      books: books,
      uiState: { ...state.uiState, showSaveSuccess: true } //loading: false,
    };
  }),
  on(BookActions.saveCurrentBook, (state, action): BookState => {
    return {
      ...state,
      uiState: {
        ...state.uiState,
        //loading: true,
        httpError: null,
        showSaveSuccess: false
      }
    };
  }),
  on(BookActions.resetSavedFlag, (state, action): BookState => {
    return {
      ...state,
      uiState: {
        ...state.uiState,
        showSaveSuccess: false
      }
    };
  }),
  on(BookActions.saveCurrentBookSuccess, (state, action): BookState => {
    let books = [...state.books];
    //replace book
    books = books.map((book) => {
      if (book.isbn === action.book.isbn) return action.book;
      else return book;
    });
    return {
      ...state,
      books: books,
      uiState: { ...state.uiState, showSaveSuccess: true } //loading: false,
    };
  }),

  on(BookActions.bookErrorAction, (state, action): BookState => {
    //return state;
    return {
      ...state,
      uiState: {
        ...state.uiState,
        // loading: false,
        errorMessage: action.message
      }
    };
  })
);
