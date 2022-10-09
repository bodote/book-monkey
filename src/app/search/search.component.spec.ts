import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { mockState } from '../store/index.spec';
import { BookFactory } from '../books/store/book-entity/book.factory.spec';
import { AppState } from '../store';
import { By } from '@angular/platform-browser';
import { loadSearchs } from './search.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { toArray } from 'rxjs';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let store: MockStore;
  let dispatchSpy: jasmine.Spy<any>;
  const factory = new BookFactory();
  const firstB = factory.bookEntity();
  const secondB = factory.bookEntity();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA], // NEU
      providers: [provideMockStore<AppState>({ initialState: mockState() })]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    dispatchSpy = spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it(
    'should store.dispatch(loadSearchs) after 400ms if keyup() is called with a string ' +
      'longer then 2 chars and should subscribe and set foundBooks',
    fakeAsync(() => {
      const searchString = 'test';
      let bookFound0;
      fixture.detectChanges();

      bookFound0 = fixture.debugElement.query(
        By.css('[data-id="foundBook-0"]')
      );
      expect(bookFound0).toBeFalsy();
      store.setState(
        mockState({
          search: {
            books: [firstB, secondB],
            searchPerformed: true,
            httpError: undefined
          }
        })
      );
      component.keyup(searchString);
      tick(390);
      fixture.detectChanges();
      expect(dispatchSpy).toHaveBeenCalledTimes(0);
      tick(10);
      fixture.detectChanges();
      bookFound0 = fixture.debugElement.query(
        By.css('[data-id="foundBook-0"]')
      );
      const bookFound1 = fixture.debugElement.query(
        By.css('[data-id="foundBook-1"]')
      );

      expect(bookFound0).toBeTruthy();
      expect(bookFound1).toBeTruthy();
      const loadSAction = loadSearchs({ searchString });
      expect(dispatchSpy).toHaveBeenCalledWith(loadSAction);
      expect(loadSAction.type).toEqual('[Search] Load Book Searchs');
    })
  );
  it(
    'should not store.dispatch(loadSearchs) after 400ms if keyup() is called with a string ' +
      'of only  2 chars and should not subscribe and set foundBooks',
    fakeAsync(() => {
      const searchString = 'te';
      let bookFound0;
      fixture.detectChanges();

      bookFound0 = fixture.debugElement.query(
        By.css('[data-id="foundBook-0"]')
      );
      expect(bookFound0).toBeFalsy();
      store.setState(
        mockState({
          search: {
            books: [],
            searchPerformed: true,
            httpError: undefined
          }
        })
      );
      component.keyup(searchString);
      tick(390);
      fixture.detectChanges();
      expect(dispatchSpy).toHaveBeenCalledTimes(0);
      tick(10);
      fixture.detectChanges();
      bookFound0 = fixture.debugElement.query(
        By.css('[data-id="foundBook-0"]')
      );
      expect(dispatchSpy).toHaveBeenCalledTimes(0);
      expect(bookFound0).toBeFalsy();
    })
  );
  it('should display error alert if state has httpError set', fakeAsync(() => {
    const searchString = 'tes';
    fixture.detectChanges();
    let errorAlert = fixture.debugElement.query(
      By.css('[data-id="errorAlert"]')
    );
    expect(errorAlert).toBeFalsy();
    component.keyup(searchString);
    tick(390);
    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledTimes(0);
    component.httpError$.pipe(toArray()).subscribe((error) => {
      expect(error[0]).toBeUndefined();
      expect(error[1]).toBeUndefined();
    });
    const httpError = new HttpErrorResponse({ status: 404 });
    store.setState(
      mockState({
        search: {
          books: [],
          searchPerformed: true,
          httpError: httpError
        }
      })
    );

    tick(10);
    fixture.detectChanges();
    errorAlert = fixture.debugElement.query(By.css('[data-id="error3"]'));
    const notFound = fixture.debugElement.query(By.css('[data-id="notFound"]'));
    expect(notFound).toBeTruthy();

    expect(dispatchSpy).toHaveBeenCalledTimes(1);

    component.httpError$.subscribe((error) => {
      expect(error).toBeTruthy();
    });
    expect(errorAlert).toBeTruthy();
  }));
});
