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
import { selectCurrentBookAndTimeStamp } from '../store/book-entity/book-entity.selectors';
import { BookEntity } from '../store/book-entity/book-entity.model';
import { loadBookEntities } from '../store/book-entity/book-entity.actions';

interface curBookTS {
  currentBook: BookEntity | undefined;
  lastUpdateTS: number;
}

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
    let isbn = paramMap.get('');
    return this.store.select(selectCurrentBookAndTimeStamp).pipe(
      tap((data: curBookTS) => {
        if (data.lastUpdateTS < Date.now()) {
          this.store.dispatch(loadBookEntities());
        }
      }),
      filter((data: curBookTS) => data.lastUpdateTS >= Date.now()),
      switchMap(() => {
        return of(true);
      })
    );
  }
}
