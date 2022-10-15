import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestScheduler } from 'rxjs/testing';
import { exhaustMap, iif, of, tap } from 'rxjs';
import { HomeComponent } from './home.component';
import { catchError, retry } from 'rxjs/operators';
import { SearchComponent } from '../search/search.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';
import { AppState } from '../store';
import { mockState } from '../store/index.spec';

interface NOTIFIC {
  kind: string;
  value: string;
  error: any;
}
interface FRAME {
  frame: number;
  notification: NOTIFIC;
}
function logFrames(label: string, frames: FRAME[]) {
  console.log(label + ':');
  frames.forEach((frame: FRAME) => {
    console.log(
      'Frame:',
      frame.frame,
      'Kind',
      frame.notification.kind,
      'Value:',
      frame.notification.value,
      frame.notification.error ? 'Error:' + frame.notification.error : ''
    );
  });
  console.log('----------');
}

describe('NOT about HomeComponent, but get familiar with marble testing', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let testScheduler: TestScheduler;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent, SearchComponent],
      imports: [HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [provideMockStore<AppState>({ initialState: mockState() })]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    testScheduler = new TestScheduler((actual, expected) => {
      logFrames('actual', actual);
      logFrames('expected', expected);
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
        //tap((value) => console.log('in :' + value)),
        //mergeMap(()=>inner$),
        exhaustMap(() => inner$)
        //tap((value) => console.log('out:' + value))
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
          return of('An Error Has occured:' + err);
        })
        //tap((value) => console.error('out :' + value))
      );
      //            --#
      //            100ms ----#
      //            200ms    ------y
      const expected = '--- 10ms ---(x|)';
      const valuesOut = { x: 'An Error Has occured:error', y: undefined };
      expectObservable(final$).toBe(expected, valuesOut);
    });
  });
});
