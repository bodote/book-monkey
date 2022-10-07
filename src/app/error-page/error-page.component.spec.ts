import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorPageComponent } from './error-page.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { BookEntityState } from '../books/store/book-entity/book-entity.reducer';
import { mockBookState } from '../books/store/index.spec';
import { HttpErrorResponse } from '@angular/common/http';

describe('ErrorPageComponent', () => {
  let component: ErrorPageComponent;
  let fixture: ComponentFixture<ErrorPageComponent>;
  let store: MockStore;
  let dispatchSpy: jasmine.Spy<any>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorPageComponent],
      imports: [],
      schemas: [NO_ERRORS_SCHEMA], // NEU
      providers: [
        provideMockStore<BookEntityState>({
          initialState: mockBookState()
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = TestBed.inject(MockStore);
    dispatchSpy = spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    store.setState(
      mockBookState({
        httpError: new HttpErrorResponse({ status: 404 })
      })
    );
  });
});
