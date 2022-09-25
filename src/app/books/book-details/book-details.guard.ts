import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { distinctUntilChanged, Observable, of, switchMap, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCurrentBookAndAll } from '../store/old/book.selectors';
import { BookStoreService } from '../../shared/book-store.service';
import { Book } from '../../shared/book';
import { catchError } from 'rxjs/operators';
import {
  bookErrorAction,
  isbnNotFound,
  loadAllAndSetCurrentBook,
  loadBooks,
  setCurrentBookSuccess
} from '../store/old/book.actions';
import { HttpErrorResponse } from '@angular/common/http';
import isEqual from 'lodash/isEqual';

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
    if (!isbn) {
      this.store.dispatch(
        bookErrorAction({
          message: 'isbn number not found in paramMap of route'
        })
      );
      return of(this.router.parseUrl('/error'));
    }
    return this.getFromStoreOrAPI(isbn).pipe(
      switchMap((data) => {
        if (data.currentBook?.isbn === isbn) return of(true);
        else return of(this.router.parseUrl('/error'));
      }),
      // otherwise, something went wrong
      catchError((error: Error) => {
        let errorMsg: string;
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

  private getFromStoreOrAPI(isbn: string): Observable<{
    currentBook: Book | undefined;
    allBooks: Book[];
    lastUpdateTS: number;
    httpError: HttpErrorResponse | null;
    errorMessage: string | null;
  }> {
    return this.store.select(selectCurrentBookAndAll).pipe(
      distinctUntilChanged((previous, current) => isEqual(previous, current)),
      // tap((data) => {
      //   if (!this.isCurrentBookOrErrorAndUpToDate(data, isbn)) {
      //     this.dispatchLoadAction(data.allBooks, data.lastUpdateTS, isbn);
      //   }
      // }),
      // filter((data) =>
      //   //current book or (httperror, and timestamp not older then 1 min).
      //   this.isCurrentBookOrErrorAndUpToDate(data, isbn)
      // ),
      take(1)
    );
  }

  private isCurrentBookOrErrorAndUpToDate<B>(
    data: {
      currentBook: Book | undefined;
      allBooks: Book[];
      httpError: HttpErrorResponse | null;
      errorMessage: string | null;
      lastUpdateTS: number;
    },
    isbn: string
  ) {
    return (
      data.currentBook?.isbn === isbn ||
      (!!data.httpError?.message &&
        data.lastUpdateTS >= Date.now() - 1000 * 60) ||
      (data.errorMessage !== null &&
        data.lastUpdateTS >= Date.now() - 1000 * 60)
    );
  }

  private dispatchLoadAction(
    allBooks: Book[],
    lastUpdateTS: number,
    isbn: string
  ) {
    if (!allBooks?.length && lastUpdateTS < Date.now() - 1000 * 60) {
      this.store.dispatch(loadBooks());
    } else {
      const currentBook = allBooks?.find((book) => book.isbn == isbn);
      if (!!currentBook) {
        this.store.dispatch(setCurrentBookSuccess({ currentBook }));
      } else {
        //2nd reload from API and check again but not too often!
        if (lastUpdateTS < Date.now() - 1000 * 60) {
          this.store.dispatch(loadAllAndSetCurrentBook({ isbn }));
        } else {
          this.store.dispatch(
            isbnNotFound({
              errorMessage:
                'reloaded books less then 1 min ago, but isbn not found'
            })
          );
        }
      }
    }
  }
}
