import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, toArray } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from '../../store';
import {
  BookFactory,
  mockStateWithBooksEntities
} from '../../books/store/book-entity/book.factory.spec';
import { TypedAction } from '@ngrx/store/src/models';
import {
  selectErrorState,
  selectShowSavedSuccess
} from '../../books/store/book-entity/book-entity.selectors';
import {
  resetErrorsAction,
  upsertBookEntity
} from '../../books/store/book-entity/book-entity.actions';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BookEditComponent } from './book-edit.component';

describe('BookEditComponent', () => {
  let component: BookEditComponent;
  let fixture: ComponentFixture<BookEditComponent>;
  let actions$: Observable<TypedAction<any>>;
  let store: MockStore;
  let factory: BookFactory;

  beforeEach(async () => {
    factory = new BookFactory();
    await TestBed.configureTestingModule({
      declarations: [BookEditComponent],
      imports: [HttpClientTestingModule],
      providers: [
        provideMockActions(() => actions$),
        provideMockStore<AppState>({
          initialState: mockStateWithBooksEntities()
        })
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    store = TestBed.inject(MockStore);
    store.setState(mockStateWithBooksEntities({ showSaveSuccess: true }));
    fixture = TestBed.createComponent(BookEditComponent);
    component = fixture.componentInstance;
  });
  afterEach(() => {
    store.resetSelectors();
  });
  describe('.saveBook', () => {
    const paramList = [
      { selectShow: true, result: true },
      { selectShow: false, result: false }
    ];
    paramList.forEach((params) => {
      it(`should create, set "component.saved" to ${params.result} in order to show/not show successmessage `, () => {
        //arrange
        store.overrideSelector(selectShowSavedSuccess, params.selectShow);
        let newBook = factory.bookEntity();
        //act
        component.saveBook(newBook);
        fixture.detectChanges();
        //assert
        store.scannedActions$.pipe(toArray()).subscribe((actions) => {
          expect(actions.length).toBe(1);
          expect(actions[0]).toEqual(upsertBookEntity({ bookEntity: newBook }));
        });
        const form = fixture.debugElement.query(By.css('bm-book-form'));
        expect(form).toBeTruthy();
        expect(form.properties['saved']).toBe(params.result);
      });
    });
  });

  it(`should  show  errors `, () => {
    //arrange
    const errorInfo = {
      httpError: null,
      errorMessage: 'error',
      lastUpdateTS: 1
    };
    store.overrideSelector(selectErrorState, errorInfo);
    //act
    fixture.detectChanges();
    //assert
    const form = fixture.debugElement.query(By.css('bm-notification-alert'));
    expect(form.properties['error']).toEqual(errorInfo);
  });

  it('should dispatch resetErrorsAction on closeError-event ', fakeAsync(() => {
    //arrange
    const errorInfo = {
      httpError: null,
      errorMessage: 'error',
      lastUpdateTS: 1
    };
    store.overrideSelector(selectErrorState, errorInfo);
    fixture.detectChanges();
    const noteAlert = fixture.debugElement.query(
      By.css('bm-notification-alert')
    );
    noteAlert.triggerEventHandler('closeErrorEventEmitter');
    store.scannedActions$.pipe(toArray()).subscribe((actions) => {
      expect(actions.length).toBe(1);
      expect(actions[0]).toEqual(resetErrorsAction());
    });
  }));
});
