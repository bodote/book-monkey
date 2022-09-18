import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCurrentBook } from '../store/book.selectors';
import { BookStoreService } from '../../shared/book-store.service';
import { Book } from '../../shared/book';
import { catchError, map } from 'rxjs/operators';
import { TypedAction } from '@ngrx/store/src/models';
import * as fromBookActions from '../store/book.actions';
import { httpFailure } from '../store/book.actions';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookDetailsGuard implements CanActivate {
  constructor(
    private store: Store,
    private bs: BookStoreService,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | boolean {
    let isbn = route.paramMap.get('isbn');
    return this.store.select(selectCurrentBook).pipe(
      switchMap((curBook) => {
        if (!!curBook && curBook.isbn === isbn) {
          return of(true);
        } else {
          return this.bs.getAll().pipe(
            map((books: Book[]) => {
              return this.setCurBookOrLoadAll(books, isbn);
            }),
            catchError((error: HttpErrorResponse) => {
              this.store.dispatch(httpFailure({ httpError: error }));
              return of(this.router.parseUrl('/error'));
            })
          );
        }
      })
    );
  }

  private setCurBookOrLoadAll(
    books: Book[],
    isbn: string | null
  ): boolean | UrlTree {
    const newCurrentBook = books.find((book) => book.isbn == isbn);
    let action: TypedAction<any>;

    if (!!newCurrentBook) {
      action = fromBookActions.loadAllAndSetCurrentBookSuccess({
        books,
        currentBook: newCurrentBook
      });
      this.store.dispatch(action);
      return true;
    } else {
      action = fromBookActions.loadBooksOkButNotFound({
        books,
        errorMessage: 'All Books reloaded, but this ISBN was not found'
      });
      this.store.dispatch(action);
      return this.router.parseUrl('/error');
    }
  }
}
