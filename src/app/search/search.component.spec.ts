import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BookStoreService } from '../shared/book-store.service';
import { mergeMap, Observable, of, throwError, timer } from 'rxjs';
import { Book } from '../shared/book';
import { delay } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { mockState } from '../store/index.spec';
import { BookFactory } from '../books/book.factory.spec';
import { AppState } from '../store';
import { By } from '@angular/platform-browser';
import { loadSearchs } from './search.actions';

const testBookData: Book = {
  authors: ['author'],
  isbn: '1234567890',
  published: new Date('2022-02-02'),
  title: 'a title',
  subtitle: '',
  description: '',
  rating: 3,
  thumbnails: [{ title: '', url: '' }]
};
describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let mockService = jasmine.createSpyObj<BookStoreService>('bookStoreService', [
    'getAllSearch'
  ]);
  let store: MockStore;
  let dispatchSpy: jasmine.Spy<any>;
  let factory: BookFactory;

  beforeEach(async () => {
    factory = new BookFactory();
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
      const firstB = factory.bookEntity();
      const secondB = factory.bookEntity();
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
      expect(dispatchSpy).toHaveBeenCalledWith(loadSearchs({ searchString }));
    })
  );
  xit(
    'should not call BookStoreService.getAllSearch after 400ms if keyup() is called with a string ' +
      'of only  2 chars and should not subscribe and set foundBooks',
    fakeAsync(() => {
      mockService.getAllSearch = jasmine
        .createSpy<() => Observable<Book[]>>()
        .and.returnValue(of([testBookData]).pipe(delay(10)));
      const searchString = '12';
      // expect(component.isLoading).toBeFalse();
      // component.keyup(searchString);
      // tick(390);
      // expect(component.foundBooks).toBeUndefined();
      // expect(mockService.getAllSearch).toHaveBeenCalledTimes(0);
      // tick(10);
      // expect(component.isLoading).toBeFalse();
      // expect(mockService.getAllSearch).not.toHaveBeenCalledOnceWith(
      //   searchString
      // );
      // tick(10);
      // expect(component.foundBooks).toBeUndefined();
      // expect(component.isLoading).toBeFalse();
    })
  );
  xit(
    'should call BookStoreService.getAllSearch after 400ms if keyup() is called with a string ' +
      'longer then 2 chars and should print error on console',
    fakeAsync(() => {
      spyOn(console, 'error');
      mockService.getAllSearch = jasmine
        .createSpy<() => Observable<Book[]>>()
        .and.returnValue(
          timer(10).pipe(
            mergeMap((e) =>
              throwError(() => new HttpErrorResponse({ status: 404 }))
            )
          )
        );
      const searchString = 'test';
      expect(component).toBeTruthy();
      component.keyup(searchString);
      tick(390);
      // expect(component.foundBooks).toBeUndefined();
      // expect(mockService.getAllSearch).toHaveBeenCalledTimes(0);
      // tick(11);
      // expect(component.isLoading).toBeTrue();
      // expect(mockService.getAllSearch).toHaveBeenCalledOnceWith(searchString);
      // tick(10);
      // expect(console.error).toHaveBeenCalledTimes(1);
      // expect(component.isLoading).toBeFalse();
    })
  );
});
