import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import { BookListComponent } from './book-list.component';
import { throwError } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
import { BookEntity } from '../store/book-entity/book-entity.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from '../../store';
import { mockStateWithBooksEntities } from '../store/index.spec';
import { BookFactory } from '../store/book-entity/book.factory.spec';

const testBookData: BookEntity = {
  authors: ['author'],
  isbn: '1234567890',
  published: new Date('2022-02-02'),
  title: 'a title',
  subtitle: '',
  description: '',
  rating: 3,
  thumbnails: [{ title: '', url: '' }]
};
xdescribe('BookListComponent', () => {
  let component: BookListComponent;
  let fixture: ComponentFixture<BookListComponent>;
  let store: MockStore;
  let dispatchSpy: jasmine.Spy<any>;
  let testScheduler: TestScheduler;
  const factory = new BookFactory();
  const firstB = factory.bookEntity();
  const secondB = factory.bookEntity();
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookListComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideMockStore<AppState>({
          initialState: mockStateWithBooksEntities()
        })
      ]
    }).compileComponents();

    testScheduler = new TestScheduler((actual, expected) => {
      // asserting the two objects are equal - required
      expect(actual).toEqual(expected);
    });
    fixture = TestBed.createComponent(BookListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    dispatchSpy = spyOn(store, 'dispatch');
  });

  it('should create and get the of(book[]) ', () => {
    store.setState(mockStateWithBooksEntities(factory.stateWith2Books()));
    fixture.detectChanges();
    testScheduler.run((helpers) => {
      const { expectObservable } = helpers;
      fixture.detectChanges();
      expect(component).toBeTruthy();
      expect(component.books$).toBeDefined();
      if (component.books$) {
        const valuesOut = { a: firstB, b: secondB };
        expectObservable(component.books$).toBe('(ab|)', valuesOut);
      } else {
        fail();
      }
      expect(component.listView).toBeTrue();
    });
  });
  xit('should insert no additional delay to that comming from the BookStoreService ', () => {
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
  xit('should show "loading" if books are not yet available ', fakeAsync(() => {
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
  xit('should show error if BookStoreService runs into an error ', () => {
    const errorObservable$ = throwError(() => {
      return new HttpErrorResponse({ status: 404 });
    });

    fixture.detectChanges();
    let error = fixture.debugElement.query(By.css('div.container > div.alert'));
    let loading = fixture.debugElement.query(By.css('div.relative > div'));
    expect(loading).toBeNull();
    expect(error).toBeDefined();
    expect(error.nativeElement.textContent).toContain('"status": 404');
  });
});
