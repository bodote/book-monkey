import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { distinctUntilChanged, filter, of, switchMap, take, tap } from 'rxjs';
import { BookStoreService } from '../../shared/book-store.service';
import { Store } from '@ngrx/store';
import { selectTotalAndErrors } from '../store/book-entity/book-entity.selectors';
import {
  bookErrorAction,
  loadBookEntities
} from '../store/book-entity/book-entity.actions';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import isEqual from 'lodash/isEqual';

@Injectable({
  providedIn: 'root'
})
export class ListLoadedGuard implements CanActivate {
  constructor(
    private bs: BookStoreService,
    private store: Store,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.getFromStoreOrAPI().pipe(
      switchMap((data) => {
        if (data.total > 0 && !data.httpError) {
          return of(true);
        }
        return of(this.router.parseUrl('/error'));
      }),
      // otherwise, something went wrong
      catchError((error) => {
        let errorMsg;
        error instanceof HttpErrorResponse
          ? (errorMsg = JSON.stringify(error))
          : (errorMsg = error.toString());
        console.error('errorMsg=' + errorMsg);
        this.store.dispatch(
          bookErrorAction({
            message: errorMsg
          })
        );
        return of(this.router.parseUrl('/error'));
      })
    );
  }

  private getFromStoreOrAPI() {
    return this.store.select(selectTotalAndErrors).pipe(
      distinctUntilChanged((previous, current) => {
        return isEqual(previous, current);
      }),
      tap((data) => {
        if (
          (!data.total && !data.httpError && !data.errorMessage) ||
          data.lastUpdateTS < Date.now() - 1000 * 60
        ) {
          this.store.dispatch(loadBookEntities());
        }
      }),
      filter((data) => !!data.total || !!data.httpError || !!data.errorMessage),
      take(1)
    );
  }
}
