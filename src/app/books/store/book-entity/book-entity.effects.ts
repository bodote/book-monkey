import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  addBookEntity,
  addBookEntitySuccess,
  deleteBookEntity,
  deleteBookEntitySuccess,
  httpFailure,
  loadBookEntities,
  loadBookEntitiesSuccess,
  upsertBookEntity,
  upsertBookEntitySuccess
} from './book-entity.actions';
import { distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BookStoreService } from '../../../shared/book-store.service';
import { Router } from '@angular/router';
import { BookEntity } from './book-entity.model';
import {
  loadAllAndSetCurrentBook,
  loadAllAndSetCurrentBookSuccess
} from '../book-entity/book-entity.actions';
import { Book } from '../../../shared/book';
import isEqual from 'lodash/isEqual';

@Injectable()
export class BookEntityEffects {
  constructor(
    private actions$: Actions,
    private bs: BookStoreService,
    private router: Router
  ) {}
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
      tap(() => console.log('effect: reloadBooksAndSetCurrentBook$')),
      switchMap((action) =>
        this.bs.getAll().pipe(
          map((books: Book[]) => {
            const currentBook = books.find((book) => book.isbn == action.isbn);

            return loadAllAndSetCurrentBookSuccess({
              books,
              currentBook,
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
          map((response: string) => addBookEntitySuccess({ bookEntity: book })),
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
    console.log('Saved Current Book, and then upsertBookEntitySuccess');
    return this.actions$.pipe(
      ofType(upsertBookEntity),
      distinctUntilChanged((actual, current) => {
        console.log('isEqual? actual', actual);
        console.log('isEqual? current', current);
        return isEqual(actual, current);
      }),
      tap((action) =>
        console.log(
          'action pipe in book saveCurrentBookEffect, action=' + action.type
        )
      ),

      switchMap((action) => {
        let book = action.bookEntity;
        return this.bs.putBook(book).pipe(
          tap(() => console.log('in putBook pipe')),
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
