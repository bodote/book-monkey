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

export const httpFailure = createAction(
  '[Book] HTTP Error Response',
  props<{ httpError: HttpErrorResponse }>()
);

export const loadBooksOkButNotFound = createAction(
  '[Book] Load Books ok, but ISBN Not Found',
  props<{ books: Book[]; errorMessage: string }>()
);

export const deleteBook = createAction(
  '[Book] Delete Book',
  props<{ isbn: string }>()
);

export const deleteBookSuccess = createAction(
  '[Book] Delete Book Succeeded',
  props<{ isbn: string }>()
);

export const addBook = createAction('[Book] Add Book', props<{ book: Book }>());

export const addBookSuccess = createAction(
  '[Book] Add Book Succeeded',
  props<{ book: Book }>()
);

export const saveCurrentBook = createAction(
  '[Book] Save Current Book',
  props<{ book: Book }>()
);

export const saveCurrentBookSuccess = createAction(
  '[Book] Save Current Book Success',
  props<{ book: Book }>()
);

export const internalErrorAction = createAction(
  '[Internal Error] ',
  props<{ message: string }>()
);

export const searchBooks = createAction(
  '[Book] Search For Books',
  props<{ searchString: string }>()
);
export const searchBooksResult = createAction(
  '[Book] Store Search Results',
  props<{ searchResults: Book[] }>()
);
