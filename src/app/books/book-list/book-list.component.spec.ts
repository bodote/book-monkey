import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import { BookListComponent } from './book-list.component';
import { BookStoreService } from '../../shared/book-store.service';
import { Observable, of, throwError } from 'rxjs';
import { Book } from '../../shared/book';
import { TestScheduler } from 'rxjs/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { delay } from 'rxjs/operators';
import { By } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';

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
describe('BookListComponent', () => {
  let component: BookListComponent;
  let fixture: ComponentFixture<BookListComponent>;
  let mockService = jasmine.createSpyObj<BookStoreService>('bookStoreService', [
    'getAll'
  ]);
  let testScheduler: TestScheduler;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookListComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: BookStoreService, useValue: mockService }]
    }).compileComponents();

    testScheduler = new TestScheduler((actual, expected) => {
      // asserting the two objects are equal - required
      expect(actual).toEqual(expected);
    });
    fixture = TestBed.createComponent(BookListComponent);
    component = fixture.componentInstance;
  });

  it('should create and get the of(book[]) ', () => {
    mockService.getAll = jasmine
      .createSpy<() => Observable<Book[]>>()
      .and.returnValue(of([testBookData]));
    testScheduler.run((helpers) => {
      const { expectObservable } = helpers;
      fixture.detectChanges();
      expect(component).toBeTruthy();
      expect(component.books$).toBeDefined();
      if (component.books$) {
        const valuesOut = { x: [testBookData] };
        expectObservable(component.books$).toBe('(x|)', valuesOut);
      } else {
        fail();
      }
      expect(component.listView).toBeTrue();
    });
  });
  it('should insert no additional delay to that comming from the BookStoreService ', () => {
    mockService.getAll = jasmine
      .createSpy<() => Observable<Book[]>>()
      .and.returnValue(of([testBookData]).pipe(delay(1000)));
    testScheduler.run((helpers) => {
      const { expectObservable } = helpers;
      fixture.detectChanges();

      expect(component.books$).toBeDefined();
      const valuesOut = { x: [testBookData] };
      if (component.books$) {
        expectObservable(component.books$).toBe(' 1000ms (x|)', valuesOut);
      } else {
        fail();
      }
    });
  });
  it('should show "loading" if books are not yet available ', fakeAsync(() => {
    mockService.getAll = jasmine
      .createSpy<() => Observable<Book[]>>()
      .and.returnValue(of([testBookData]).pipe(delay(1000)));

    fixture.detectChanges();
    let loading = fixture.debugElement.query(By.css('div.relative > div'));
    expect(loading).toBeDefined();
    expect(loading.nativeElement.textContent).toContain('Loading');
    expect(component.books$).toBeDefined();
    tick(1001);
    fixture.detectChanges();
    loading = fixture.debugElement.query(By.css('div.relative > div'));
    expect(loading).toBeNull();
  }));
  it('should show error if BookStoreService runs into an error ', () => {
    const errorObservable$ = throwError(() => {
      return new HttpErrorResponse({ status: 404 });
    });
    mockService.getAll = jasmine
      .createSpy<() => Observable<Book[]>>()
      .and.returnValue(errorObservable$);

    fixture.detectChanges();
    let error = fixture.debugElement.query(By.css('div.container > div.alert'));
    let loading = fixture.debugElement.query(By.css('div.relative > div'));
    expect(loading).toBeNull();
    expect(error).toBeDefined();
    expect(error.nativeElement.textContent).toContain('"status": 404');
  });
});
