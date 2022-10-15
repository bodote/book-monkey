import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookListComponent } from './book-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from '../../store';

import {
  BookFactory,
  mockStateWithBooksEntities
} from '../store/book-entity/book.factory.spec';
import { resetErrorsAction } from '../store/book-entity/book-entity.actions';

describe('BookListComponent', () => {
  let component: BookListComponent;
  let fixture: ComponentFixture<BookListComponent>;
  let store: MockStore;
  let dispatchSpy: jasmine.Spy<any>;
  const factory = new BookFactory();
  const bookEntityState = factory.stateWith2Books();
  const firstB = factory.getBooksFromState(bookEntityState)[0];
  const secondB = factory.getBooksFromState(bookEntityState)[1];
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
    fixture = TestBed.createComponent(BookListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    dispatchSpy = spyOn(store, 'dispatch');
  });

  it('should have an observable containing the books and show 2 book-items', (done) => {
    store.setState(mockStateWithBooksEntities(bookEntityState));
    fixture.detectChanges();
    expect(component.books$).toBeTruthy();
    component.books$.subscribe((books) => {
      expect(books.length).toBe(2);
      expect(books[0]).toEqual(firstB);
      expect(books[1]).toEqual(secondB);
      done();
    });
    expect(component.listView).toBeTrue();
    const bookFound0 = fixture.debugElement.query(
      By.css('[data-id="book-item-0"]')
    );
    const bookFound1 = fixture.debugElement.query(
      By.css('[data-id="book-item-1"]')
    );
    expect(bookFound0).toBeTruthy();
    expect(bookFound1).toBeTruthy();
  });
  it('should show  http errors if any ', (done) => {
    const httpError = new HttpErrorResponse({ status: 404 });
    store.setState(
      mockStateWithBooksEntities({
        httpError,
        lastUpdateTS: 1
      })
    );
    fixture.detectChanges();
    component.error$.subscribe((error) => {
      expect(error.httpError).toBe(httpError);
      expect(error.lastUpdateTS).toBe(1);
      expect(error.errorMessage).toBe(null);
      done();
    });
    const errorElement = fixture.debugElement.query(
      By.css('[data-id="error-element"]')
    );
    expect(errorElement).toBeTruthy();
  });
  it('should show   errorMessage if any ', (done) => {
    const errorMessage = 'some error';
    store.setState(
      mockStateWithBooksEntities({
        errorMessage,
        lastUpdateTS: 1
      })
    );
    fixture.detectChanges();
    component.error$.subscribe((error) => {
      expect(error.errorMessage).toEqual(errorMessage);
      expect(error.lastUpdateTS).toBe(1);
      expect(error.httpError).toBe(null);
      done();
    });
    const errorElement = fixture.debugElement.query(
      By.css('[data-id="error-element"]')
    );
    expect(errorElement).toBeTruthy();
  });

  it('should dispatch(resetErrorsAction()) if there is an error and the closeErrorEventEmitter emits an event', () => {
    const errorMessage = 'some error';
    store.setState(
      mockStateWithBooksEntities({
        errorMessage,
        lastUpdateTS: 1
      })
    );
    fixture.detectChanges();
    const errorElement = fixture.debugElement.query(
      By.css('[data-id="error-element"]')
    );
    expect(errorElement).toBeTruthy();
    component.closeError();
    expect(dispatchSpy).toHaveBeenCalledOnceWith(resetErrorsAction());
  });
});
