import { createAction, props } from '@ngrx/store';
import { Book } from '../../shared/book';
import { HttpErrorResponse } from '@angular/common/http';

export const loadBooks = createAction('[Book] Load Books');

export const loadBooksSuccess = createAction(
  '[Book] Load Books Success',
  props<{ books: Book[] }>()
);

export const setCurrentBook = createAction(
  '[Book] Set Current Book',
  props<{ isbn: string }>()
);

export const setCurrentBookSuccess = createAction(
  '[Book] Set Current Book Success',
  props<{ currentBook: Book }>()
);

export const loadAllAndSetCurrentBookSuccess = createAction(
  '[Book] Load books and set Current Book Success',
  props<{ books: Book[]; currentBook: Book }>()
);

export const loadBooksFailure = createAction(
  '[Book] Load Books Failure',
  props<{ error: HttpErrorResponse }>()
);

export const loadBooksOkButNotFound = createAction(
  '[Book] Load Books Failure',
  props<{ books: Book[]; errorMessage: string }>()
);

export const doNothing = createAction('[Do Nothing] ');
