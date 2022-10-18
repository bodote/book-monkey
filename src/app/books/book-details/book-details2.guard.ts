import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, Observable, of, switchMap, tap } from 'rxjs';
import {
  curBookTS,
  selectCurrentBookAndAll
} from '../store/book-entity/book-entity.selectors';
import {
  bookErrorAction,
  loadAllAndSetCurrentBook,
  setCurrentBookSuccess
} from '../store/book-entity/book-entity.actions';

@Injectable({
  providedIn: 'root'
})
export class BookDetailsGuard2 implements CanActivate {
  constructor(private store: Store, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    let paramMap = route.paramMap;
    let isbn: string;
    if (paramMap.get('isbn') === null)
      return of(this.router.parseUrl('/error'));
    else isbn = paramMap.get('isbn') as string;
    return this.store.select(selectCurrentBookAndAll).pipe(
      tap((data: curBookTS) => this.dispatchAction(data, isbn)),
      filter((data: curBookTS) => this.proceedRoute(data, isbn)),
      switchMap((data: curBookTS) => {
        if (data.currentBookId != isbn)
          return of(this.router.parseUrl('/error'));
        return of(true);
      })
    );
  }
  private proceedRoute(data: curBookTS, isbn: string): boolean {
    if (data.currentBookId === isbn) return true;
    return (
      this.isNewTimeStamp(data) &&
      !data.allBooks.find((book) => book.isbn === isbn)
    );
  }
  private dispatchAction(data: curBookTS, isbn: string) {
    if (this.isOldTimeStamp(data)) {
      this.store.dispatch(loadAllAndSetCurrentBook({ isbn }));
    }
    if (
      this.isNewTimeStamp(data) &&
      data.currentBookId != isbn &&
      data.allBooks.find((book) => book.isbn === isbn)
    ) {
      this.store.dispatch(setCurrentBookSuccess({ currentBookId: isbn }));
    }
    if (
      this.isNewTimeStamp(data) &&
      !data.allBooks.find((book) => book.isbn === isbn)
    ) {
      this.store.dispatch(
        bookErrorAction({ message: 'isbn number not found' })
      );
    }
  }
  private isNewTimeStamp(data: curBookTS) {
    return !this.isOldTimeStamp(data);
  }
  private isOldTimeStamp(data: curBookTS) {
    return data.lastUpdateTS < Date.now() - 1000 * 60;
  }
}
