import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  httpFailure,
  loadBookEntities,
  loadBookEntitiesSuccess
} from './book-entity.actions';
import { of, switchMap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BookStoreService } from '../../../shared/book-store.service';
import { Router } from '@angular/router';
import { BookEntity } from './book-entity.model';

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
}
