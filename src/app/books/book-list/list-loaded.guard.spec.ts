import { TestBed } from '@angular/core/testing';
import { TestScheduler } from 'rxjs/testing';
import { ListLoadedGuard } from './list-loaded.guard';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from '../../store';
import {
  BookFactory,
  mockStateWithBooksEntities
} from '../store/book-entity/book.factory.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { BookListComponent } from './book-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { TypedAction } from '@ngrx/store/src/models';
import {
  bookErrorAction,
  loadBookEntities
} from '../store/book-entity/book-entity.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { BookEntityState } from '../store/book-entity/book-entity.reducer';
import { Store } from '@ngrx/store';

describe('ListLoadedGuard.canActivate', () => {
  let guard: ListLoadedGuard;
  let dispatchSpy: jasmine.Spy<any>;
  let actions$: Observable<TypedAction<any>>;
  let store: MockStore;
  let router: Router;
  let bookState: BookEntityState;
  const factory = new BookFactory();
  const httpError = new HttpErrorResponse({ status: 404 });
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookListComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          {
            path: 'list',
            component: BookListComponent,
            canActivate: [ListLoadedGuard]
          }
        ])
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideMockActions(() => actions$),
        provideMockStore<AppState>({
          initialState: mockStateWithBooksEntities(bookState)
        })
      ]
    }).compileComponents();
    guard = TestBed.inject(ListLoadedGuard);
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    dispatchSpy = spyOn(store, 'dispatch');
    expect(store).toBeTruthy();
    expect(guard).toBeTruthy();
    expect(router).toBeTruthy();
  });
  describe(' with an NEW store-timestamp ', () => {
    beforeEach(async () => {
      bookState = factory.stateWith2Books();
      bookState.lastUpdateTS = Date.now();
    });
    it(
      'should  return an Observable<<url>>="/error" AND  dispatch a bookErrorAction(),' +
        '  if there are NO books in the store',
      (done) => {
        // ARRANGE
        bookState.ids = [];
        bookState.entities = {};
        store.setState({
          bookEntities: bookState
        });
        expect(bookState.lastUpdateTS).toBeGreaterThanOrEqual(
          Date.now() - 1000 * 60
        );
        const canActivate$ = guard.canActivate(
          {} as ActivatedRouteSnapshot,
          {} as RouterStateSnapshot
        );
        // ACT
        canActivate$.subscribe({
          next: (urlOrTrue) => {
            // ASSERT
            expect(urlOrTrue).toEqual(router.parseUrl('/error'));
            done();
          },
          error: () => {
            fail('fail');
          }
        });
        // ASSERT
        expect(dispatchSpy).toHaveBeenCalledOnceWith(
          bookErrorAction({ message: 'no books found from backend recently' })
        );
      }
    );
    it(
      'should  return an Observable<<boolean>>=true and NOT dispatch any action,' +
        '  if there are  books in the store',
      (done) => {
        // ARRANGE
        store.setState({
          bookEntities: bookState
        });
        const canActivate$ = guard.canActivate(
          {} as ActivatedRouteSnapshot,
          {} as RouterStateSnapshot
        );
        // ACT
        canActivate$.subscribe({
          next: (urlOrTrue) => {
            // ASSERT
            expect(urlOrTrue).toBeTrue();
            done();
          },
          error: () => {
            fail('fail');
          }
        });
        // ASSERT
        expect(dispatchSpy).not.toHaveBeenCalled();
      }
    );
    describe(' as parameterized tests... ', () => {
      const parameters = [
        {
          description: 'if there is an httpError  in the store',
          state: factory.bookState({
            lastUpdateTS: Date.now(),
            httpError
          })
        },
        {
          description: 'if there is an errorMessage in the store',
          state: factory.bookState({
            lastUpdateTS: Date.now(),
            errorMessage: 'an Error'
          })
        }
      ];
      parameters.forEach((parameter) => {
        it(
          'should  return any url-item to /error in the Observable.next()  but NOT dispach any action,' +
            parameter.description,
          (done) => {
            store.setState({
              bookEntities: parameter.state
            });
            const canActivate$ = guard.canActivate(
              {} as ActivatedRouteSnapshot,
              {} as RouterStateSnapshot
            );
            // ACT
            canActivate$.subscribe({
              next: (urlOrTrue) => {
                // ASSERT
                expect(urlOrTrue).toEqual(router.parseUrl('/error'));
                done();
              },
              error: () => {
                fail('fail');
              }
            });
            // ASSERT
            expect(dispatchSpy).not.toHaveBeenCalled();
          }
        );
      });
    });
  });
  describe(' with an at least 61 second OLD store-timestamp ', () => {
    beforeEach(async () => {
      bookState = factory.stateWith2Books();
      bookState.lastUpdateTS = Date.now() - 1000 * 61;
    });
    it(
      'should return an Observable<<boolean>>=true and emit a loadBookEntites(),' +
        '  if there are books in the store',
      (done) => {
        store.setState({ bookEntities: bookState });
        expect(bookState.lastUpdateTS).toBeLessThanOrEqual(
          Date.now() - 1000 * 61
        );
        // ACT
        const canActivate$ = guard.canActivate(
          {} as ActivatedRouteSnapshot,
          {} as RouterStateSnapshot
        );
        canActivate$.subscribe({
          next: () => {
            done();
          },
          error: () => {
            fail();
          }
        });
        // ASSERT
        expect(dispatchSpy).toHaveBeenCalledOnceWith(loadBookEntities());
        //store.setState({ bookEntities: factory.stateWith2Books() });
      }
    );
    it(
      'should NOT return any item in the Observable.next()  but ONLY dispatch a loadBookEntites(),' +
        '  if there are NO books in the store',
      () => {
        // ARRANGE
        bookState.ids = [];
        bookState.entities = {};
        store.setState({ bookEntities: bookState });
        // ACT
        const canActivate$ = guard.canActivate(
          {} as ActivatedRouteSnapshot,
          {} as RouterStateSnapshot
        );
        canActivate$.subscribe({
          next: () => {
            fail();
          },
          error: () => {
            fail();
          }
        });
        // ASSERT
        expect(dispatchSpy).toHaveBeenCalledOnceWith(loadBookEntities());
      }
    );
  });
  describe(' with a mock for store.select()', () => {
    let testScheduler: TestScheduler;
    let store: jasmine.SpyObj<Store>;
    let router: jasmine.SpyObj<Router>;
    let httpError: HttpErrorResponse;
    beforeEach(() => {
      httpError = new HttpErrorResponse({ status: 404 });
    });
    it(
      'happy case: 1 item and new timestamp from store, this  is already good:' +
        ' return true and  ignore the rest',
      () => {
        store = jasmine.createSpyObj<Store>('MockStore', [
          'select',
          'dispatch'
        ]);
        router = jasmine.createSpyObj<Router>('MockRouter', ['parseUrl']);
        testScheduler = new TestScheduler((actual, expected) => {
          // asserting the two objects are equal - required
          expect(actual).toEqual(expected);
          expect(store.dispatch).not.toHaveBeenCalled();
        });
        const listLoadedGuard = new ListLoadedGuard(store, router);
        const state0 = {
          total: 2,
          lastUpdateTS: Date.now(),
          httpError: null,
          errorMessage: null
        };
        const state1 = {
          total: 3,
          lastUpdateTS: Date.now(),
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
        store = jasmine.createSpyObj<Store>('MockStore', [
          'select',
          'dispatch'
        ]);
        router = jasmine.createSpyObj<Router>('MockRouter', ['parseUrl']);
        testScheduler = new TestScheduler((actual, expected) => {
          // asserting the two objects are equal - required
          expect(actual).toEqual(expected);
          expect(store.dispatch).toHaveBeenCalledOnceWith(loadBookEntities());
        });
        const listLoadedGuard = new ListLoadedGuard(store, router);
        const state0 = {
          total: 0,
          lastUpdateTS: 1, //very old
          httpError: null,
          errorMessage: null
        };
        const state1 = {
          total: 3,
          lastUpdateTS: Date.now(),
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
        store = jasmine.createSpyObj<Store>('MockStore', [
          'select',
          'dispatch'
        ]);
        router = jasmine.createSpyObj<Router>('MockRouter', ['parseUrl']);
        testScheduler = new TestScheduler((actual, expected) => {
          // asserting the two objects are equal - required
          expect(actual).toEqual(expected);
          expect(store.dispatch).toHaveBeenCalledOnceWith(loadBookEntities());
        });
        const listLoadedGuard = new ListLoadedGuard(store, router);
        const state0 = {
          total: 3,
          lastUpdateTS: 1, //very old
          httpError: null,
          errorMessage: null
        };
        const state1 = {
          total: 3,
          lastUpdateTS: Date.now(),
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
        store = jasmine.createSpyObj<Store>('MockStore', [
          'select',
          'dispatch'
        ]);
        router = jasmine.createSpyObj<Router>('MockRouter', ['parseUrl']);
        const urlTree = jasmine.createSpyObj<UrlTree>('MockUrlTree', [
          'toString'
        ]);
        testScheduler = new TestScheduler((actual, expected) => {
          // asserting the two objects are equal - required
          expect(actual).toEqual(expected);
          expect(store.dispatch).toHaveBeenCalledOnceWith(
            bookErrorAction({ message: 'no books found from backend recently' })
          );
        });
        const listLoadedGuard = new ListLoadedGuard(store, router);
        const state0 = {
          total: 0,
          lastUpdateTS: Date.now(), //very old
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
        store = jasmine.createSpyObj<Store>('MockStore', [
          'select',
          'dispatch'
        ]);
        router = jasmine.createSpyObj<Router>('MockRouter', ['parseUrl']);
        const urlTree = jasmine.createSpyObj<UrlTree>('MockUrlTree', [
          'toString'
        ]);
        testScheduler = new TestScheduler((actual, expected) => {
          // asserting the two objects are equal - required
          expect(actual).toEqual(expected);
          expect(store.dispatch).not.toHaveBeenCalled();
        });
        const listLoadedGuard = new ListLoadedGuard(store, router);
        const state0 = {
          total: 0,
          lastUpdateTS: Date.now(), //very old
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
        store = jasmine.createSpyObj<Store>('MockStore', [
          'select',
          'dispatch'
        ]);
        router = jasmine.createSpyObj<Router>('MockRouter', ['parseUrl']);
        const urlTree = jasmine.createSpyObj<UrlTree>('MockUrlTree', [
          'toString'
        ]);
        testScheduler = new TestScheduler((actual, expected) => {
          // asserting the two objects are equal - required
          expect(actual).toEqual(expected);
          expect(store.dispatch).not.toHaveBeenCalled();
        });
        const listLoadedGuard = new ListLoadedGuard(store, router);
        const state0 = {
          total: 0,
          lastUpdateTS: Date.now(), //very old
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
