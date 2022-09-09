import { createReducer, on } from '@ngrx/store';
import * as BookActions from './book.actions';
import { Book } from '../../shared/book';
import { HttpErrorResponse } from '@angular/common/http';

export const bookFeatureKey = 'book';

export interface State {
  books: Book[];
  loading: boolean;
  error: HttpErrorResponse | null;
}
export const initialState: State = {
  books: [],
  loading: false,
  error: null
};

export const reducer = createReducer(
  initialState,

  on(BookActions.loadBooks, (state) => {
    return { ...state, loading: true, error: null };
  }),
  on(BookActions.loadBooksSuccess, (state, action) => {
    return { ...state, books: action.books, loading: false };
  }),
  on(BookActions.loadBooksFailure, (state, action) => {
    return { ...state, loading: false, error: action.error };
  })
);
