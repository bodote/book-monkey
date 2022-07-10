import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestScheduler } from 'rxjs/testing';
import { exhaustMap, iif, of, tap } from 'rxjs';
import { HomeComponent } from './home.component';
import { catchError, retry } from 'rxjs/operators';
import { SearchComponent } from '../search/search.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let testScheduler: TestScheduler;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent, SearchComponent],
      imports: [HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    testScheduler = new TestScheduler((actual, expected) => {
      // asserting the two objects are equal - required
      expect(actual).toEqual(expected);
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // This test runs synchronously.
  it('test observables', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;
      const valuesIn = { a: '1', b: '2', c: '3', d: '4' };
      const source$ = cold('---a---b--|', valuesIn);
      const inner$ = cold('-i---j---k-|', { i: 'e', j: 'f', k: 'g' });
      //--------------------------------i---j---k-|-----------
      //---------------------------------------------|

      const final$ = source$.pipe(
        tap((value) => console.log('in :' + value)),
        //mergeMap(()=>inner$),
        exhaustMap(() => inner$),
        tap((value) => console.log('out:' + value))
      );
      //--------------------i---j---k--
      //-----------------------------i---j---k--
      const valuesOut = { x: 'e', y: 'f', z: 'g' };
      const expected = '----x---y---z-|';

      expectObservable(final$).toBe(expected, valuesOut);
    });
  });
  it('test retry()', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      let count = 0;
      const source$ = iif(() => ++count <= 2, cold('---#'), cold('--y-|'));

      const final$ = source$.pipe(
        tap((value) => console.error('in :' + value)),
        retry({ count: 1, delay: 10 }),
        catchError((err) => {
          console.error('catched the error:' + err);
          return of('An Error Has occured');
        }),
        tap((value) => console.error('out :' + value))
      );
      //            --#
      //            100ms ----#
      //            200ms    ------y
      const expected = '--- 10ms ---(x|)';
      const valuesOut = { x: 'An Error Has occured', y: undefined };
      expectObservable(final$).toBe(expected, valuesOut);
    });
  });
});
