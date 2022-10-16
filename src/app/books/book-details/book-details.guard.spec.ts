import { BookDetailsGuard2 } from './book-details2.guard';
import { Store } from '@ngrx/store';
import {
  ActivatedRouteSnapshot,
  ParamMap,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { TestScheduler } from 'rxjs/testing';
import { logFrames } from '../../shared/helper.spec';
import { Observable } from 'rxjs';
import { selectCurrentBookAndTimeStamp } from '../store/book-entity/book-entity.selectors';
import { loadBookEntities } from '../store/book-entity/book-entity.actions';

describe('BookDetailsGuard2', () => {
  let bookDetailsGuard: BookDetailsGuard2;
  let mockStore = jasmine.createSpyObj<Store>('mockStore', [
    'dispatch',
    'select'
  ]);
  let mockRouter: Router;
  let testScheduler: TestScheduler;
  const twoMinutes = 1000 * 120;
  beforeEach(() => {
    bookDetailsGuard = new BookDetailsGuard2(mockStore, mockRouter);
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(twoMinutes));
  });
  afterEach(() => {
    jasmine.clock().uninstall();
  });
  it('canActivate should return of(true) if timestamp is new', function () {
    testScheduler = new TestScheduler((actual, expected) => {
      logFrames('actual', actual);
      logFrames('expected', expected);
      // asserting the two objects are equal - required
      expect(actual).toEqual(expected);
      // Also testing everything that happen inside a pipe() of one of the Observables here:
      expect(mockStore.dispatch as jasmine.Spy<any>).not.toHaveBeenCalled();
    });
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;
      const select$ = cold('a', { a: { lastUpdateTS: twoMinutes } });
      mockStore.select.and.returnValue(select$);
      const mockParamMap = jasmine.createSpyObj<ParamMap>('paramMap', ['get']);
      mockParamMap.get.and.returnValue('123');
      let actual$ = bookDetailsGuard.canActivate(
        { paramMap: mockParamMap } as any as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot
      );
      let expectedValues = { r: true };
      expectObservable(actual$).toBe('r', expectedValues);
    });
  });
  it(
    'canActivate return-Observalble should not yet return anything but emit a dispatch(loadBookEntities)' +
      'if timestamp is old and there is no currentBook with the requested isbn-nr yet',
    function () {
      testScheduler = new TestScheduler((actual, expected) => {
        logFrames('actual', actual);
        logFrames('expected', expected);
        // asserting the two objects are equal - required
        expect(actual).toEqual(expected);
        // Also testing everything that happen inside a pipe() of one of the Observables
        expect(mockStore.dispatch as jasmine.Spy<any>).toHaveBeenCalledOnceWith(
          loadBookEntities()
        );
      });
      testScheduler.run((helpers) => {
        const { cold, expectObservable } = helpers;
        const selectReturn$ = cold('a', {
          a: { currentBook: undefined, lastUpdateTS: 1 }
        });
        (mockStore.select as jasmine.Spy<(s: any) => Observable<any>>)
          .withArgs(selectCurrentBookAndTimeStamp)
          .and.returnValue(selectReturn$);
        const mockParamMap = jasmine.createSpyObj<ParamMap>('paramMap', [
          'get'
        ]);
        mockParamMap.get.and.returnValue('123');
        let actual$ = bookDetailsGuard.canActivate(
          { paramMap: mockParamMap } as any as ActivatedRouteSnapshot,
          {} as RouterStateSnapshot
        );
        expect(
          mockStore.select as jasmine.Spy<(s: any) => Observable<any>>
        ).toHaveBeenCalledWith(selectCurrentBookAndTimeStamp);

        expectObservable(actual$).toBe('');
      });
    }
  );
});
