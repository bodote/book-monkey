import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import {
  distinctUntilChanged,
  filter,
  Observable,
  of,
  switchMap,
  take,
  tap
} from 'rxjs';
import { BookStoreService } from '../../shared/book-store.service';
import { Store } from '@ngrx/store';
import { selectAllBooksOrHttpError } from '../store/book.selectors';
import { Book } from '../../shared/book';
import { bookErrorAction, loadBooks } from '../store/book.actions';
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
    console.log('can activate: ');
    return this.getFromStoreOrAPI().pipe(
      switchMap((data) => {
        console.log('list loaded guard, switchMap: ' + JSON.stringify(data));
        if (data.books.length > 0 && !data.httpError) {
          return of(true);
        }
        return of(this.router.parseUrl('/error'));
      }),
      // otherwise, something went wrong
      catchError((error) => {
        let errorMsg = error.message;
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

  private getFromStoreOrAPI(): Observable<{
    books: Book[];
    lastUpdateTS: number;
    httpError: HttpErrorResponse | null;
  }> {
    console.log('getFromStoreOrAPI ');
    return this.store.select(selectAllBooksOrHttpError).pipe(
      distinctUntilChanged((previous, current) => {
        console.log(
          'list loaded guard, distinctUntilChanged: ' + JSON.stringify(current)
        );
        return isEqual(previous, current);
      }),
      tap((data) => {
        console.log('list loaded guard, tap: ' + JSON.stringify(data));
        if (
          (!data.books?.length && !data.httpError) ||
          data.lastUpdateTS < Date.now() - 1000 * 60
        ) {
          this.store.dispatch(loadBooks());
        }
      }),
      filter((data) => !!data?.books.length || !!data.httpError),
      take(1)
    );
  }
}
