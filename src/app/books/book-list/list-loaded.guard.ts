import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { distinct, filter, Observable, of, switchMap, take, tap } from 'rxjs';
import { BookStoreService } from '../../shared/book-store.service';
import { Store } from '@ngrx/store';
import { selectAllBooksOrHttpError } from '../store/book.selectors';
import { Book } from '../../shared/book';
import { bookErrorAction, loadBooks } from '../store/book.actions';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

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
        if (data.books.length > 0 && !data.httpError) {
          return of(true);
        }
        return of(this.router.parseUrl('/error'));
      }),
      // otherwise, something went wrong
      catchError((error) => {
        this.store.dispatch(
          bookErrorAction({ message: JSON.stringify(error) })
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
    return this.store.select(selectAllBooksOrHttpError).pipe(
      distinct(
        ({ books, lastUpdateTS, httpError }) =>
          '' + books.length + lastUpdateTS + httpError?.message
      ),
      tap((data) => {
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
