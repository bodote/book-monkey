import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorPageComponent } from './error-page.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { Observable } from 'rxjs';
import { TypedAction } from '@ngrx/store/src/models';
import { provideMockActions } from '@ngrx/effects/testing';
import { AppState } from '../store';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { resetErrorsAction } from '../books/store/book-entity/book-entity.actions';
import { mockStateWithBooksEntities } from '../books/store/book-entity/book.factory.spec';

describe('ErrorPageComponent', () => {
  let actions$: Observable<TypedAction<any>>;
  let component: ErrorPageComponent;
  let fixture: ComponentFixture<ErrorPageComponent>;
  let store: MockStore;
  let dispatchSpy: jasmine.Spy<any>;
  let router: Router;
  let navigateSpy: jasmine.Spy<any>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorPageComponent],
      imports: [RouterTestingModule],
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
    router = TestBed.inject(Router);
    navigateSpy = spyOn(router, 'navigate');
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
  it('should call router and store if close() is called', () => {
    component.closeError();
    const action = resetErrorsAction();
    expect(action.type).toEqual('[BookEntity/API] Error reset');
    expect(dispatchSpy).toHaveBeenCalledWith(action);
    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
  });
});
