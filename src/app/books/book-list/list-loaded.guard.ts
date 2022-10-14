import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { distinctUntilChanged, filter, of, switchMap, take, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectTotalAndErrors } from '../store/book-entity/book-entity.selectors';
import {
  bookErrorAction,
  loadBookEntities
} from '../store/book-entity/book-entity.actions';
import { HttpErrorResponse } from '@angular/common/http';
import isEqual from 'lodash/isEqual';

@Injectable({
  providedIn: 'root'
})
export class ListLoadedGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.getFromStoreOrAPI().pipe(
      switchMap((data) => {
        if (data.total > 0 && !data.httpError && !data.errorMessage) {
          // only if we have data AND no errors whatsoever
          return of(true);
        }
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
        this.dispatchActions(data);
      }),
      filter((data) => {
        return this.canWeProceed(data);
      }),
      take(1)
    );
  }

  private canWeProceed(data: {
    total: number;
    lastUpdateTS: number;
    httpError: HttpErrorResponse | null;
    errorMessage: string | null;
  }) {
    if (data.lastUpdateTS >= Date.now() - 1000 * 60) {
      // yes: new timestamp
      return true;
    } else if (!!data.total || !!data.httpError || !!data.errorMessage) {
      // yes: old timestamp , but we have data or an error message
      return true;
    }
    // no: wait for next data, because it's an old timestamp,
    // and we have no data nor errors -> wait for store update, do nothing
    return false;
  }

  private dispatchActions(data: {
    total: number;
    lastUpdateTS: number;
    httpError: HttpErrorResponse | null;
    errorMessage: string | null;
  }) {
    if (data.lastUpdateTS < Date.now() - 1000 * 60) {
      // old timestamp
      this.store.dispatch(loadBookEntities());
      console.error('have dispatched loadBookEntities');
    } else {
      // new timestamp
      if (!data.total && !data.httpError && !data.errorMessage) {
        this.store.dispatch(
          bookErrorAction({
            message: 'no books found from backend recently'
          })
        );
      }
    }
  }
}
