import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { BookStoreService } from '../../shared/book-store.service';
import {
  addBook,
  addBookSuccess,
  deleteBook,
  deleteBookSuccess,
  httpFailure,
  internalErrorAction,
  loadAllAndSetCurrentBookSuccess,
  loadBooks,
  loadBooksOkButNotFound,
  loadBooksSuccess,
  saveCurrentBook,
  saveCurrentBookSuccess,
  searchBooks,
  searchBooksResult,
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
  setCurrentBook$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(setCurrentBook),

      concatLatestFrom(() => this.store.select(selectBookState)),
      switchMap(([action, state]) => {
        return this.updateCurrentBook$(
          state.books,
          state.uiState.currentBook,
          action.isbn
        );
      })
    );
  });

  private updateCurrentBook$(
    books: Book[],
    oldCurrentBook: Book | undefined,
    isbn: string
  ) {
    let currentBook = books.find((book) => book.isbn == isbn);
    if (!!currentBook) return of(setCurrentBookSuccess({ currentBook }));
    if (books.length == 0 || isbn != oldCurrentBook?.isbn) {
      return this.loadBooksAndFindnewCurrentBook$(isbn);
    }
    return of(
      internalErrorAction({ message: 'this error should never happen' })
    );
  }

  private loadBooksAndFindnewCurrentBook$(isbn: string) {
    return this.bs.getAll().pipe(
      map((books: Book[]) => {
        let currentBook = books.find((book) => book.isbn == isbn);
        if (!!currentBook)
          return loadAllAndSetCurrentBookSuccess({ books, currentBook });
        else {
          return loadBooksOkButNotFound({
            books,
            errorMessage: 'All Books reloaded, but this ISBN was not found'
          });
        }
      }),
      catchError((error) => {
        console.error(
          'http error: in books.effect line 55:' + JSON.stringify(error)
        );
        return of(httpFailure({ httpError: error }));
      })
    );
  }

  constructor(
    private actions$: Actions,
    private bs: BookStoreService,
    private store: Store
  ) {}
}
