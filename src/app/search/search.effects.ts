import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BookStoreService } from '../shared/book-store.service';
import {
  loadSearchs,
  loadSearchsFailure,
  loadSearchsSuccess
} from './search.actions';
import { BookEntity } from '../books/store/book-entity/book-entity.model';

@Injectable()
export class SearchEffects {
  constructor(private actions$: Actions, private bs: BookStoreService) {}
  searchBooks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadSearchs),
      switchMap((action) => {
        return this.bs.getAllSearch(action.searchString).pipe(
          map((books: BookEntity[]) => {
            return loadSearchsSuccess({ searchResults: books });
          })
        );
      }),
      catchError((error) => {
        return of(loadSearchsFailure({ error }));
      })
    );
  });
}
