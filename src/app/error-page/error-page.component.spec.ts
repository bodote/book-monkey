import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorPageComponent } from './error-page.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { mockStateWithBooksEntities } from '../books/store/index.spec';
import { Observable } from 'rxjs';
import { TypedAction } from '@ngrx/store/src/models';
import { provideMockActions } from '@ngrx/effects/testing';
import { AppState } from '../store';
import { HttpErrorResponse } from '@angular/common/http';

describe('ErrorPageComponent', () => {
  let actions$: Observable<TypedAction<any>>;
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
        provideMockActions(() => actions$),
        provideMockStore<AppState>({
          initialState: mockStateWithBooksEntities()
        })
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ErrorPageComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    dispatchSpy = spyOn(store, 'dispatch');
  });

  it('should get the error object', (done) => {
    expect(component).toBeTruthy();
    store.setState(
      mockStateWithBooksEntities({
        httpError: new HttpErrorResponse({ status: 404 }),
        errorMessage: 'state.errorMessage',
        lastUpdateTS: 1234
      })
    );
    fixture.detectChanges();
    component.error$.subscribe((error) => {
      expect(error.httpError?.status).toEqual(404);
      done();
    });
  });
});
