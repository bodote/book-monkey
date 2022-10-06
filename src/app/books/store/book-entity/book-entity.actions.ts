import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { BookEntity } from './book-entity.model';
import { HttpErrorResponse } from '@angular/common/http';

export const loadBookEntities = createAction(
  '[BookEntity/API] Load BookEntities'
);
export const loadBookEntitiesSuccess = createAction(
  '[BookEntity/API] Load BookEntities Success',
  props<{ bookEntities: BookEntity[]; timeStamp: number }>()
);

export const bookErrorAction = createAction(
  '[BookEntity/API]  Error',
  props<{ message: string }>()
);

export const httpFailure = createAction(
  '[BookEntity/API] HTTP Error Response',
  props<{ httpError: HttpErrorResponse; timeStamp: number }>()
);

export const addBookEntity = createAction(
  '[BookEntity/API] Add BookEntity',
  props<{ bookEntity: BookEntity }>()
);

export const addBookEntitySuccess = createAction(
  '[BookEntity/API] Add Book Success',
  props<{ bookEntity: BookEntity }>()
);
export const upsertBookEntity = createAction(
  '[BookEntity/API] Upsert BookEntity',
  props<{ bookEntity: BookEntity }>()
);

export const upsertBookEntitySuccess = createAction(
  '[BookEntity/API] Upsert BookEntity Success',
  props<{ bookEntity: BookEntity }>()
);

export const addBookEntitys = createAction(
  '[BookEntity/API] Add BookEntities',
  props<{ bookEntitys: BookEntity[] }>()
);

export const upsertBookEntitys = createAction(
  '[BookEntity/API] Upsert BookEntities',
  props<{ bookEntitys: BookEntity[] }>()
);

export const updateBookEntity = createAction(
  '[BookEntity/API] Update BookEntity',
  props<{ bookEntity: Update<BookEntity> }>()
);

export const updateBookEntitys = createAction(
  '[BookEntity/API] Update BookEntities',
  props<{ bookEntitys: Update<BookEntity>[] }>()
);

export const deleteBookEntity = createAction(
  '[BookEntity/API] Delete BookEntity',
  props<{ id: string }>()
);

export const deleteBookEntitySuccess = createAction(
  '[BookEntity/API] Delete BookEntity Success',
  props<{ id: string }>()
);

export const deleteBookEntitys = createAction(
  '[BookEntity/API] Delete BookEntitys',
  props<{ ids: string[] }>()
);

export const clearBookEntitys = createAction(
  '[BookEntity/API] Clear BookEntities'
);

export const loadAllAndSetCurrentBookSuccess = createAction(
  '[BookEntity/API] Load all and set Current Book Success',
  props<{
    books: BookEntity[];
    currentBook: BookEntity | undefined;
    timeStamp: number;
  }>()
);
export const loadAllAndSetCurrentBook = createAction(
  '[BookEntity/API] Load all and set Current Book',
  props<{ isbn: string }>()
);
export const isbnNotFound = createAction(
  '[BookEntity/API] reloaded books from server, but ISBN still not Found',
  props<{ errorMessage: string }>()
);

export const setCurrentBookSuccess = createAction(
  '[BookEntity/API] Set Current Book Success',
  props<{ currentBookId: string }>()
);

export const resetSavedSuccessFlag = createAction(
  '[BookEntity/API] Reset Saved Success Flag'
);

export const resetErrorsAction = createAction('[BookEntity/API] Error reset');
