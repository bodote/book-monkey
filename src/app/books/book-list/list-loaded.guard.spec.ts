import { TestScheduler } from 'rxjs/testing';
import { ListLoadedGuard } from './list-loaded.guard';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import {
  bookErrorAction,
  loadBookEntities
} from '../store/book-entity/book-entity.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';

describe('ListLoadedGuard.canActivate', () => {
  describe(' with a mock for store.select()', () => {
    let testScheduler: TestScheduler;
    let store: jasmine.SpyObj<Store>;
    let router: jasmine.SpyObj<Router>;
    let httpError: HttpErrorResponse;
    let listLoadedGuard: ListLoadedGuard;
    beforeEach(() => {
      store = jasmine.createSpyObj<Store>('MockStore', ['select', 'dispatch']);

      httpError = new HttpErrorResponse({ status: 404 });
      router = jasmine.createSpyObj<Router>('MockRouter', ['parseUrl']);
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date(1000 * 120));
      listLoadedGuard = new ListLoadedGuard(store, router);
    });
    afterEach(() => {
      jasmine.clock().uninstall();
    });
    it(
      'happy case: 1 item and new timestamp from store, this  is already good:' +
        ' return true and  ignore the rest',
      () => {
        testScheduler = new TestScheduler((actual, expected) => {
          // asserting the two objects are equal - required
          expect(actual).toEqual(expected);
          expect(store.dispatch).not.toHaveBeenCalled();
        });
        const state0 = {
          total: 2,
          lastUpdateTS: Date.now() - 1000 * 60,
          httpError: null,
          errorMessage: null
        };
        const state1 = {
          total: 3,
          lastUpdateTS: Date.now() - 1000 * 60,
          httpError: null,
          errorMessage: null
        };
        testScheduler.run((helpers) => {
          const { cold, expectObservable } = helpers;
          const inputValues = { a: state0, b: state1, c: true };
          const storeSelect$ = cold('aab|', inputValues);
          store.select.and.returnValue(storeSelect$);
          // ACT
          const actual$ = listLoadedGuard.canActivate(
            {} as ActivatedRouteSnapshot,
            {} as RouterStateSnapshot
          );
          expectObservable(actual$).toBe('(c|)', inputValues);
        });
      }
    );
    it(
      '1st and 2nd item from store are the same and it has an old timestamp and NO books, ' +
        '3rd has the books and a new timestamp.' +
        'we expect a call to dispatch(loadBookEntities()) and finally emit "true" on 3nd time slot',
      () => {
        testScheduler = new TestScheduler((actual, expected) => {
          // asserting the two objects are equal - required
          expect(actual).toEqual(expected);
          expect(store.dispatch).toHaveBeenCalledOnceWith(loadBookEntities());
        });
        const state0 = {
          total: 0,
          lastUpdateTS: 1, //very old
          httpError: null,
          errorMessage: null
        };
        const state1 = {
          total: 3,
          lastUpdateTS: Date.now() - 1000 * 60,
          httpError: null,
          errorMessage: null
        };
        testScheduler.run((helpers) => {
          const { cold, expectObservable } = helpers;
          const inputValues = { a: state0, b: state1, c: true };
          const storeSelect$ = cold('aab|', inputValues);
          //  ACT
          store.select.and.returnValue(storeSelect$);
          const actual$ = listLoadedGuard.canActivate(
            {} as ActivatedRouteSnapshot,
            {} as RouterStateSnapshot
          );
          expectObservable(actual$).toBe('--(c|)', inputValues);
        });
      }
    );
    it(
      '1st and 2nd item from store are the same and it has an old timestamp and SOME books, ' +
        '3rd has the books and a new timestamp.' +
        'we expect a call to dispatch(loadBookEntities()) and finally emit "true" on 1nd time slot',
      () => {
        testScheduler = new TestScheduler((actual, expected) => {
          // asserting the two objects are equal - required
          expect(actual).toEqual(expected);
          expect(store.dispatch).toHaveBeenCalledOnceWith(loadBookEntities());
        });
        const state0 = {
          total: 3,
          lastUpdateTS: 1, //very old
          httpError: null,
          errorMessage: null
        };
        const state1 = {
          total: 3,
          lastUpdateTS: Date.now() - 1000 * 60,
          httpError: null,
          errorMessage: null
        };
        testScheduler.run((helpers) => {
          const { cold, expectObservable } = helpers;
          const inputValues = { a: state0, b: state1, c: true };
          const storeSelect$ = cold('aab|', inputValues);
          //  ACT
          store.select.and.returnValue(storeSelect$);
          const actual$ = listLoadedGuard.canActivate(
            {} as ActivatedRouteSnapshot,
            {} as RouterStateSnapshot
          );
          expectObservable(actual$).toBe('(c|)', inputValues);
        });
      }
    );
    it(
      '1st item from store  has an new timestamp but NO books, ' +
        'and there were no other errors' +
        'we expect a call to dispatch(bookErrorAction()) and finally emit "UrlTree(/error)" on 1nd time slot',
      () => {
        const urlTree = jasmine.createSpyObj<UrlTree>('MockUrlTree', [
          'toString'
        ]);
        testScheduler = new TestScheduler((actual, expected) => {
          // asserting the two objects are equal - required
          expect(actual).toEqual(expected);
          expect(router.parseUrl).toHaveBeenCalledOnceWith('/error');
          expect(store.dispatch).toHaveBeenCalledOnceWith(
            bookErrorAction({ message: 'no books found from backend recently' })
          );
        });
        const state0 = {
          total: 0,
          lastUpdateTS: Date.now() - 1000 * 60,
          httpError: null,
          errorMessage: null
        };
        router.parseUrl.and.returnValue(urlTree);
        testScheduler.run((helpers) => {
          const { cold, expectObservable } = helpers;
          const inputValues = { a: state0, u: urlTree, c: true };
          const storeSelect$ = cold('aaa|', inputValues);
          //  ACT
          store.select.and.returnValue(storeSelect$);
          const actual$ = listLoadedGuard.canActivate(
            {} as ActivatedRouteSnapshot,
            {} as RouterStateSnapshot
          );
          expectObservable(actual$).toBe('(u|)', inputValues);
        });
      }
    );
    it(
      '1st item from store  has an new timestamp, NO books and an HTTPError ' +
        'we expect NO call to dispatch() and finally emit "UrlTree(/error)" on 1nd time slot',
      () => {
        const urlTree = jasmine.createSpyObj<UrlTree>('MockUrlTree', [
          'toString'
        ]);
        testScheduler = new TestScheduler((actual, expected) => {
          // asserting the two objects are equal - required
          expect(actual).toEqual(expected);
          expect(router.parseUrl).toHaveBeenCalledOnceWith('/error');
          expect(store.dispatch).not.toHaveBeenCalled();
        });
        const state0 = {
          total: 0,
          lastUpdateTS: Date.now() - 1000 * 60,
          httpError: httpError,
          errorMessage: null
        };
        router.parseUrl.and.returnValue(urlTree);
        testScheduler.run((helpers) => {
          const { cold, expectObservable } = helpers;
          const inputValues = { a: state0, u: urlTree, c: true };
          const storeSelect$ = cold('aaa|', inputValues);
          //  ACT
          store.select.and.returnValue(storeSelect$);
          const actual$ = listLoadedGuard.canActivate(
            {} as ActivatedRouteSnapshot,
            {} as RouterStateSnapshot
          );
          expectObservable(actual$).toBe('(u|)', inputValues);
        });
      }
    );
    it(
      '1st item from store  has an new timestamp, NO books and an errorMessage ' +
        'we expect NO call to dispatch() and finally emit "UrlTree(/error)" on 1nd time slot',
      () => {
        const urlTree = jasmine.createSpyObj<UrlTree>('MockUrlTree', [
          'toString'
        ]);
        testScheduler = new TestScheduler((actual, expected) => {
          // asserting the two objects are equal - required
          expect(actual).toEqual(expected);
          expect(store.dispatch).not.toHaveBeenCalled();
        });
        const state0 = {
          total: 0,
          lastUpdateTS: Date.now() - 1000 * 60,
          httpError: null,
          errorMessage: 'some error'
        };
        router.parseUrl.and.returnValue(urlTree);
        testScheduler.run((helpers) => {
          const { cold, expectObservable } = helpers;
          const inputValues = { a: state0, u: urlTree, c: true };
          const storeSelect$ = cold('aaa|', inputValues);
          //  ACT
          store.select.and.returnValue(storeSelect$);
          const actual$ = listLoadedGuard.canActivate(
            {} as ActivatedRouteSnapshot,
            {} as RouterStateSnapshot
          );
          expectObservable(actual$).toBe('(u|)', inputValues);
        });
      }
    );
  });
});
