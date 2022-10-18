import { BookDetailsGuard2 } from './book-details2.guard';
import { Store } from '@ngrx/store';
import {
  ActivatedRouteSnapshot,
  ParamMap,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { TestScheduler } from 'rxjs/testing';
import { logFrames } from '../../shared/helper.spec';
import { Observable } from 'rxjs';
import {
  curBookTS,
  selectCurrentBookAndAll
} from '../store/book-entity/book-entity.selectors';
import {
  bookErrorAction,
  loadAllAndSetCurrentBook,
  setCurrentBookSuccess
} from '../store/book-entity/book-entity.actions';
import { BookFactory } from '../store/book-entity/book.factory.spec';
import { BookEntity } from '../store/book-entity/book-entity.model';

function testAndLog(actual: any, expected: any) {
  logFrames('actual', actual);
  logFrames('expected', expected);
  // asserting the two objects are equal - required
  expect(actual).toEqual(expected);
}

describe('BookDetailsGuard2 canActivate', () => {
  let bookDetailsGuard: BookDetailsGuard2;
  let mockStore: jasmine.SpyObj<Store<object>>;
  let mockSelect: jasmine.Spy<(s: any) => Observable<any>>;

  const mockParamMap = jasmine.createSpyObj<ParamMap>('paramMap', ['get']);

  let mockRouter: jasmine.SpyObj<Router>;
  let testScheduler: TestScheduler;
  const twoMinutes = 1000 * 120;
  const oldTimestamp = twoMinutes - 1000 * 60 - +1;
  const factory = new BookFactory();
  const stateWith2Books = factory.stateWith2Books();
  let bookA: BookEntity = factory.getBooksFromState(stateWith2Books)[0];
  let bookB: BookEntity = factory.getBooksFromState(stateWith2Books)[1];
  const urlTree = new UrlTree();
  let selectReturn: curBookTS;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj<Router>('router', ['parseUrl']);
    mockRouter.parseUrl.and.returnValue(urlTree);
    mockStore = jasmine.createSpyObj<Store>('mockStore', [
      'dispatch',
      'select'
    ]);
    selectReturn = {
      allBooks: factory.getBooksFromState(stateWith2Books),
      currentBookId: bookA.isbn,
      errorMessage: null,
      httpError: null,
      lastUpdateTS: twoMinutes - 1000 * 60
    };
    mockSelect = mockStore.select as jasmine.Spy<(s: any) => Observable<any>>;
    bookDetailsGuard = new BookDetailsGuard2(mockStore, mockRouter);
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(twoMinutes));
  });
  afterEach(() => {
    jasmine.clock().uninstall();
  });
  it('should return of(UrlTree(/error)) if there is no isbn number as a path parameter', function () {
    testScheduler = new TestScheduler((actual, expected) => {
      testAndLog(actual, expected);
      // Also testing everything that happen inside a pipe() of one of the Observables here:
      expect(mockRouter.parseUrl).toHaveBeenCalledOnceWith('/error');
    });
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;
      const select$ = cold('a', { a: selectReturn });
      mockSelect.and.returnValue(select$);
      const mockParamMap = jasmine.createSpyObj<ParamMap>('paramMap', ['get']);
      mockParamMap.get.and.returnValue(null);
      let actual$ = bookDetailsGuard.canActivate(
        { paramMap: mockParamMap } as any as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot
      );
      let expectedValues = { r: urlTree };
      expect(mockParamMap.get).toHaveBeenCalledOnceWith('isbn');
      expectObservable(actual$).toBe('(r|)', expectedValues);
    });
  });
  describe('with NEW timestamp in the store,', () => {
    it('and isbn param matches that in the store, should return of(true) ', function () {
      testScheduler = new TestScheduler((actual, expected) => {
        testAndLog(actual, expected);
        // Also testing everything that happen inside a pipe() of one of the Observables here:
        expect(mockStore.dispatch as jasmine.Spy<any>).not.toHaveBeenCalled();
      });
      testScheduler.run((helpers) => {
        const { cold, expectObservable } = helpers;
        const select$ = cold('a', {
          a: selectReturn
        });
        mockSelect.and.returnValue(select$);
        const mockParamMap = jasmine.createSpyObj<ParamMap>('paramMap', [
          'get'
        ]);
        mockParamMap.get.and.returnValue(bookA.isbn);
        let actual$ = bookDetailsGuard.canActivate(
          { paramMap: mockParamMap } as any as ActivatedRouteSnapshot,
          {} as RouterStateSnapshot
        );
        let expectedValues = { r: true };
        expectObservable(actual$).toBe('r', expectedValues);
      });
    });
    describe(" but isbn param doesn't match that in the store.currentBook ", () => {
      it(
        'and if there is ONE other book in the store with the requested ISBN,' +
          '  should not return anything in the Observable AND dispatch(setCurrentBookSuccess) ',
        function () {
          testScheduler = new TestScheduler((actual, expected) => {
            testAndLog(actual, expected);
            // Also testing everything that happen inside a pipe() of one of the Observables here:
            expect(
              mockStore.dispatch as jasmine.Spy<any>
            ).toHaveBeenCalledOnceWith(
              setCurrentBookSuccess({ currentBookId: bookA.isbn })
            );
          });
          testScheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;
            selectReturn.currentBookId = bookB.isbn;
            const select$ = cold('a', {
              a: selectReturn
            });
            mockSelect.and.returnValue(select$);
            const mockParamMap = jasmine.createSpyObj<ParamMap>('paramMap', [
              'get'
            ]);
            mockParamMap.get.and.returnValue(bookA.isbn);
            let actual$ = bookDetailsGuard.canActivate(
              { paramMap: mockParamMap } as any as ActivatedRouteSnapshot,
              {} as RouterStateSnapshot
            );
            expectObservable(actual$).toBe('');
          });
        }
      );
      it(
        'and if there is NO book in the store with the requested ISBN ' +
          'should  return an UrlTree("/error") in the Observable and  dispatch(bookErrorAction) anything',
        function () {
          testScheduler = new TestScheduler((actual, expected) => {
            testAndLog(actual, expected);
            // Also testing everything that happen inside a pipe() of one of the Observables here:
            expect(
              mockStore.dispatch as jasmine.Spy<any>
            ).toHaveBeenCalledOnceWith(
              bookErrorAction({ message: 'isbn number not found' })
            );
            expect(mockRouter.parseUrl).toHaveBeenCalledOnceWith('/error');
          });
          testScheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;
            selectReturn.currentBookId = bookA.isbn;
            const select$ = cold('a', {
              a: selectReturn
            });
            mockSelect.and.returnValue(select$);
            const mockParamMap = jasmine.createSpyObj<ParamMap>('paramMap', [
              'get'
            ]);
            mockParamMap.get.and.returnValue('wrongId');
            let actual$ = bookDetailsGuard.canActivate(
              { paramMap: mockParamMap } as any as ActivatedRouteSnapshot,
              {} as RouterStateSnapshot
            );
            expectObservable(actual$).toBe('r', { r: urlTree });
          });
        }
      );
    });
  });
  describe('with old timestamp in the store', () => {
    it(
      'should not return anything in the Observable yet but emit a dispatch(loadAllAndSetCurrentBook)' +
        'if  there is no Book at all with the requested isbn-nr yet, ',
      function () {
        const differentIsbn = 'differentIsbn';
        testScheduler = new TestScheduler((actual, expected) => {
          testAndLog(actual, expected);
          // Also testing everything that happen inside a pipe() of one of the Observables
          expect(
            mockStore.dispatch as jasmine.Spy<any>
          ).toHaveBeenCalledOnceWith(
            loadAllAndSetCurrentBook({ isbn: differentIsbn })
          );
        });
        testScheduler.run((helpers) => {
          const { cold, expectObservable } = helpers;
          selectReturn.lastUpdateTS = oldTimestamp;
          selectReturn.currentBookId = undefined;
          const selectReturn$ = cold('a', {
            a: selectReturn
          });
          mockSelect
            .withArgs(selectCurrentBookAndAll)
            .and.returnValue(selectReturn$);
          mockParamMap.get.and.returnValue(differentIsbn);
          let actual$ = bookDetailsGuard.canActivate(
            { paramMap: mockParamMap } as any as ActivatedRouteSnapshot,
            {} as RouterStateSnapshot
          );
          expect(mockSelect).toHaveBeenCalledWith(selectCurrentBookAndAll);
          expectObservable(actual$).toBe('-');
        });
      }
    );
    it(
      'should not return anything in the Observable yet  but  emit a dispatch(loadAllAndSetCurrentBook)' +
        ' even if there is already a currentBook with the requested isbn-nr ',
      function () {
        testScheduler = new TestScheduler((actual, expected) => {
          testAndLog(actual, expected);
          // Also testing everything that happen inside a pipe() of one of the Observables
          expect(
            mockStore.dispatch as jasmine.Spy<any>
          ).toHaveBeenCalledOnceWith(
            loadAllAndSetCurrentBook({ isbn: bookB.isbn })
          );
        });
        testScheduler.run((helpers) => {
          const { cold, expectObservable } = helpers;
          selectReturn.lastUpdateTS = oldTimestamp;
          selectReturn.currentBookId = bookA.isbn;
          const selectReturn$ = cold('a', {
            a: selectReturn
          });
          mockSelect
            .withArgs(selectCurrentBookAndAll)
            .and.returnValue(selectReturn$);
          mockParamMap.get.and.returnValue(bookB.isbn);
          let actual$ = bookDetailsGuard.canActivate(
            { paramMap: mockParamMap } as any as ActivatedRouteSnapshot,
            {} as RouterStateSnapshot
          );
          expect(mockSelect).toHaveBeenCalledWith(selectCurrentBookAndAll);
          expectObservable(actual$).toBe('');
        });
      }
    );
  });
});
