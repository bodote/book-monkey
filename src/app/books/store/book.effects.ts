import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { BookStoreService } from '../../shared/book-store.service';
import {
  doNothing,
  loadAllAndSetCurrentBookSuccess,
  loadBooks,
  loadBooksFailure,
  loadBooksOkButNotFound,
  loadBooksSuccess,
  setCurrentBook,
  setCurrentBookSuccess
} from './book.actions';
import { of, switchMap } from 'rxjs';
import { Book } from '../../shared/book';
import { catchError, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectBookState } from './book.selectors';

@Injectable()
export class BookEffects {
  loadBooks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadBooks),
      switchMap(() =>
        this.bs.getAll().pipe(
          map((books: Book[]) => loadBooksSuccess({ books })),
          catchError((error) => of(loadBooksFailure({ error })))
        )
      )
    );
  });
  loadCurrentBook$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(setCurrentBook),
      concatLatestFrom((action) => this.store.select(selectBookState)),
      switchMap(([action, state]) => {
        let currentBook = state.books.find((book) => book.isbn == action.isbn);
        if (!!currentBook) return of(setCurrentBookSuccess({ currentBook }));
        if (state.books.length == 0 || action.isbn != state.currentBook?.isbn) {
          return this.bs.getAll().pipe(
            map((books: Book[]) => {
              let currentBook = books.find((book) => book.isbn == action.isbn);
              if (!!currentBook)
                return loadAllAndSetCurrentBookSuccess({ books, currentBook });
              else {
                return loadBooksOkButNotFound({
                  books,
                  errorMessage:
                    'All Books reloaded, but this ISBN was not found'
                });
              }
            }),
            catchError((error) => of(loadBooksFailure({ error })))
          );
        }
        return of(doNothing());
      })
    );
  });
  constructor(
    private actions$: Actions,
    private bs: BookStoreService,
    private store: Store
  ) {}
}
