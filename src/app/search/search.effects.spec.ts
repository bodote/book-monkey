import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, toArray } from 'rxjs';

import { SearchEffects } from './search.effects';
import { BookStoreService } from '../shared/book-store.service';
import { Book } from '../shared/book';
import {
  loadSearchs,
  loadSearchsFailure,
  loadSearchsSuccess
} from './search.actions';
import { BookFactory } from '../books/book.factory.spec';
import { TypedAction } from '@ngrx/store/src/models';
import { BookEntity } from '../books/store/book-entity/book-entity.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from '../store';
import { mockState } from '../store/index.spec';
import { HttpErrorResponse } from '@angular/common/http';

describe('SearchEffects', () => {
  let actions$: Observable<TypedAction<any>>;
  let effects: SearchEffects;
  let mockService = jasmine.createSpyObj<BookStoreService>('bookStoreService', [
    'getAllSearch'
  ]);

  let factory: BookFactory;
  let bookEntity: BookEntity;
  let store: MockStore;
  beforeEach(() => {
    factory = new BookFactory();
    bookEntity = factory.bookEntity();

    TestBed.configureTestingModule({
      providers: [
        SearchEffects,
        provideMockActions(() => actions$),
        { provide: BookStoreService, useValue: mockService },
        provideMockStore<AppState>({ initialState: mockState() })
      ]
    });
    effects = TestBed.inject(SearchEffects);
    store = TestBed.inject(MockStore);
  });
  describe(' success case, ', () => {
    beforeEach(() => {
      mockService.getAllSearch = jasmine
        .createSpy<() => Observable<Book[]>>()
        .and.returnValue(of([bookEntity]));
    });

    it('effects should be created', () => {
      expect(effects).toBeTruthy();
    });

    it('it should  get a book as the search result on loadSearchs-action', (done) => {
      actions$ = of(loadSearchs({ searchString: 'test' }));
      effects.searchBooks$.pipe(toArray()).subscribe((actions) => {
        expect(actions.length).toBe(1);
        expect(actions).toEqual([
          loadSearchsSuccess({ searchResults: [bookEntity] })
        ]);
        done();
      });
    });
    it(' effects with action loadSearchsSuccess effects should NOT do anything', (done) => {
      const action = loadSearchsSuccess({ searchResults: [] });
      actions$ = of(action);
      expect(action.type).toEqual('[Search] Load Searchs Success');
      effects.searchBooks$.pipe(toArray()).subscribe((actions) => {
        expect(actions.length).toBe(0);
        done();
      });
    });
  });
  describe(' error case ', () => {
    let httpError: HttpErrorResponse;
    beforeEach(() => {
      httpError = new HttpErrorResponse({ status: 404 });
      mockService.getAllSearch = jasmine
        .createSpy<() => Observable<Book[]>>()
        .and.throwError(httpError);
    });
    it('should return a error action ', (done) => {
      actions$ = of(loadSearchs({ searchString: 'test' }));
      effects.searchBooks$.pipe(toArray()).subscribe({
        next: (actions) => {
          expect(actions.length).toBe(1);
          const errorAction = loadSearchsFailure({ error: httpError });
          expect(actions).toEqual([errorAction]);
          expect(errorAction.type).toEqual('[Search] Load Searchs Failure');
          done();
        },
        error: (error) => {
          fail(':' + error);
          done();
        }
      });
    });
  });
});
