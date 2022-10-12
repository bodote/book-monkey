import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  addBookEntity,
  addBookEntitySuccess,
  deleteBookEntity,
  deleteBookEntitySuccess,
  httpFailure,
  loadAllAndSetCurrentBook,
  loadAllAndSetCurrentBookSuccess,
  loadBookEntities,
  loadBookEntitiesSuccess,
  upsertBookEntity,
  upsertBookEntitySuccess
} from './book-entity.actions';
import { distinctUntilChanged, of, switchMap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BookStoreService } from '../../../shared/book-store.service';
import { BookEntity } from './book-entity.model';
import isEqual from 'lodash/isEqual';

@Injectable()
export class BookEntityEffects {
  constructor(private actions$: Actions, private bs: BookStoreService) {}
  loadBooks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadBookEntities),
      switchMap(() =>
        this.bs.getAllEntities().pipe(
          map((books: BookEntity[]) => {
            return loadBookEntitiesSuccess({
              bookEntities: books,
              timeStamp: Date.now()
            });
          }),
          catchError((error) =>
            of(httpFailure({ httpError: error, timeStamp: Date.now() }))
          )
        )
      )
    );
  });
  reloadBooksAndSetCurrentBook$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadAllAndSetCurrentBook),
      switchMap((action) =>
        this.bs.getAllEntities().pipe(
          map((books: BookEntity[]) => {
            const currentBook = books.find((book) => book.isbn == action.isbn);
            return loadAllAndSetCurrentBookSuccess({
              books,
              currentBookId: currentBook?.isbn,
              timeStamp: Date.now()
            });
          }),
          catchError((error) =>
            of(httpFailure({ httpError: error, timeStamp: Date.now() }))
          )
        )
      )
    );
  });

  addBook$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addBookEntity),
      switchMap((action) => {
        let book = action.bookEntity;
        return this.bs.postBook(book).pipe(
          map((response: any) => addBookEntitySuccess({ bookEntity: book })),
          catchError((error) =>
            of(httpFailure({ httpError: error, timeStamp: Date.now() }))
          )
        );
      })
    );
  });
  deleteBook$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteBookEntity),
      switchMap((action) => {
        let isbn = action.id;
        return this.bs.deleteBook(isbn).pipe(
          map((response: string) => deleteBookEntitySuccess({ id: isbn })),
          catchError((error) =>
            of(httpFailure({ httpError: error, timeStamp: Date.now() }))
          )
        );
      })
    );
  });
  saveCurrentBook$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(upsertBookEntity),
      distinctUntilChanged((actual, current) => {
        return isEqual(actual, current);
      }),
      switchMap((action) => {
        let book = action.bookEntity;
        return this.bs.putBook(book).pipe(
          map((response: string) =>
            upsertBookEntitySuccess({ bookEntity: book })
          ),
          catchError((error) =>
            of(httpFailure({ httpError: error, timeStamp: Date.now() }))
          )
        );
      })
    );
  });
}
