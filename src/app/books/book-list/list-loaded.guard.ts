import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot
} from '@angular/router';
import { first, Observable, of, switchMap, tap } from 'rxjs';
import { BookStoreService } from '../../shared/book-store.service';
import { Store } from '@ngrx/store';
import { selectAllBooks } from '../store/book.selectors';
import { Book } from '../../shared/book';
import { internalErrorAction, loadBooksSuccess } from '../store/book.actions';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ListLoadedGuard implements CanActivate {
  constructor(private bs: BookStoreService, private store: Store) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store.select(selectAllBooks).pipe(
      first(),
      switchMap((books: Book[]) =>
        books?.length > 0
          ? this.activateRoute()
          : this.bs.getAll().pipe(
              tap((books) => this.store.dispatch(loadBooksSuccess({ books }))),
              switchMap(() => this.activateRoute()),
              catchError((error) => {
                this.store.dispatch(
                  internalErrorAction({ message: JSON.stringify(error) })
                );
                return of(false);
              })
            )
      )
    );
  }
  activateRoute() {
    return of(true);
  }
}
