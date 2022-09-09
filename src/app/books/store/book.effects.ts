import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BookStoreService } from '../../shared/book-store.service';
import { loadBooks, loadBooksFailure, loadBooksSuccess } from './book.actions';
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
          catchError((error) => of(loadBooksFailure({ error })))
        )
      )
    );
  });
  constructor(private actions$: Actions, private bs: BookStoreService) {}
}
