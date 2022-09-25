// noinspection JSUnusedGlobalSymbols
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BookStoreService } from '../../../shared/book-store.service';
import {
  addBook,
  addBookSuccess,
  deleteBook,
  deleteBookSuccess,
  httpFailure,
  loadAllAndSetCurrentBook,
  loadAllAndSetCurrentBookSuccess,
  loadBooks,
  loadBooksSuccess,
  resetSavedFlag,
  saveCurrentBook,
  saveCurrentBookSuccess
} from './book.actions';
import { of, switchMap, tap } from 'rxjs';
import { Book } from '../../../shared/book';
import { catchError, delay, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class BookEffects {
  loadBooks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadBooks),
      switchMap(() =>
        this.bs.getAll().pipe(
          map((books: Book[]) =>
            loadBooksSuccess({ books, timeStamp: Date.now() })
          ),
          catchError((error) =>
            of(httpFailure({ httpError: error, timeStamp: Date.now() }))
          )
        )
      )
    );
  });

  deleteBook$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteBook),
      switchMap((action) => {
        let isbn = action.isbn;
        return this.bs.deleteBook(isbn).pipe(
          map((response: string) => deleteBookSuccess({ isbn })),
          catchError((error) =>
            of(httpFailure({ httpError: error, timeStamp: Date.now() }))
          )
        );
      })
    );
  });
  addBook$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addBook),
      switchMap((action) => {
        let book = action.book;
        return this.bs.postBook(book).pipe(
          map((response: string) => addBookSuccess({ book })),
          catchError((error) =>
            of(httpFailure({ httpError: error, timeStamp: Date.now() }))
          )
        );
      })
    );
  });

  addBookSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addBookSuccess),
      tap(() => {
        this.router.navigate(['/books/list']);
        console.log('resetSavedFlag before delay');
      }),
      delay(5000), // show the success message for 5 more seconds
      map((a) => {
        console.log('resetSavedFlag after delay');
        return resetSavedFlag();
      })
    );
  });

  saveCurrentBook$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(saveCurrentBook),
      switchMap((action) => {
        let book = action.book;
        return this.bs.putBook(book).pipe(
          map((response: string) => saveCurrentBookSuccess({ book })),
          catchError((error) =>
            of(httpFailure({ httpError: error, timeStamp: Date.now() }))
          )
        );
      })
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

  constructor(
    private actions$: Actions,
    private bs: BookStoreService,
    private router: Router
  ) {}
}
