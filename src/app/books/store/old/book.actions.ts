import { createAction, props } from '@ngrx/store';
import { Book } from '../../../shared/book';
import { HttpErrorResponse } from '@angular/common/http';

export const loadBooks = createAction('[Book] Load Books');

export const loadBooksSuccess = createAction(
  '[Book] Load Books Success',
  props<{ books: Book[]; timeStamp: number }>()
);

export const setCurrentBookSuccess = createAction(
  '[Book] Set Current Book Success',
  props<{ currentBook: Book }>()
);

export const loadAllAndSetCurrentBookSuccess = createAction(
  '[Book] Load ass books and set Current Book Success',
  props<{ books: Book[]; currentBook: Book | undefined; timeStamp: number }>()
);
export const loadAllAndSetCurrentBook = createAction(
  '[Book] Load all books and set Current Book',
  props<{ isbn: string }>()
);

export const httpFailure = createAction(
  '[Book] HTTP Error Response',
  props<{ httpError: HttpErrorResponse; timeStamp: number }>()
);

export const isbnNotFound = createAction(
  '[Book] reloaded books from server, but ISBN still not Found',
  props<{ errorMessage: string }>()
);

export const deleteBook = createAction(
  '[Book] Delete Book',
  props<{ isbn: string }>()
);

export const deleteBookSuccess = createAction(
  '[Book] Delete Book Success',
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

export const resetSavedFlag = createAction('[Book] Set Saved Flag to false');

export const saveCurrentBookSuccess = createAction(
  '[Book] Save Current Book Success',
  props<{ book: Book }>()
);

export const bookErrorAction = createAction(
  '[Book Error] ',
  props<{ message: string }>()
);

export const resetErrorsAction = createAction('[Book Reset] Error reset');
