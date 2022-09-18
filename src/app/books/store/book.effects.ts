// noinspection JSUnusedGlobalSymbols
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BookStoreService } from '../../shared/book-store.service';
import {
  addBook,
  addBookSuccess,
  deleteBook,
  deleteBookSuccess,
  httpFailure,
  loadBooks,
  loadBooksSuccess,
  saveCurrentBook,
  saveCurrentBookSuccess,
  searchBooks,
  searchBooksResult
} from './book.actions';
import { of, switchMap } from 'rxjs';
import { Book } from '../../shared/book';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class BookEffects {
  loadBooks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadBooks),
      switchMap(() =>
        this.bs.getAll().pipe(
          map((books: Book[]) => loadBooksSuccess({ books })),
          catchError((error) => of(httpFailure({ httpError: error })))
        )
      )
    );
  });

  searchBooks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(searchBooks),
      switchMap((action) =>
        this.bs.getAllSearch(action.searchString).pipe(
          map((books: Book[]) => searchBooksResult({ searchResults: books })),
          catchError((error) => of(httpFailure({ httpError: error })))
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
          catchError((error) => of(httpFailure({ httpError: error })))
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
          catchError((error) => of(httpFailure({ httpError: error })))
        );
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
          catchError((error) => of(httpFailure({ httpError: error })))
        );
      })
    );
  });

  constructor(private actions$: Actions, private bs: BookStoreService) {}
}
