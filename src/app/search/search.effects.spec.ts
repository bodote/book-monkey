import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, toArray } from 'rxjs';

import { SearchEffects } from './search.effects';
import { BookStoreService } from '../shared/book-store.service';
import { Book } from '../shared/book';
import { loadSearchs, loadSearchsSuccess } from './search.actions';
import { BookFactory } from '../books/book.factory.spec';
import { TypedAction } from '@ngrx/store/src/models';
import { BookEntity } from '../books/store/book-entity/book-entity.model';

describe('SearchEffects', () => {
  let actions$: Observable<TypedAction<any>>;
  let effects: SearchEffects;
  let mockService = jasmine.createSpyObj<BookStoreService>('bookStoreService', [
    'getAllSearch'
  ]);

  let factory: BookFactory;
  let bookEntity: BookEntity;

  beforeEach(() => {
    factory = new BookFactory();
    bookEntity = factory.bookEntity();
    mockService.getAllSearch = jasmine
      .createSpy<() => Observable<Book[]>>()
      .and.returnValue(of([bookEntity]));
    TestBed.configureTestingModule({
      providers: [
        SearchEffects,
        provideMockActions(() => actions$),
        { provide: BookStoreService, useValue: mockService }
      ]
    });
    effects = TestBed.inject(SearchEffects);
  });
  describe(' with action loadSearchs', () => {
    beforeEach(() => {});

    it('should be created', () => {
      expect(effects).toBeTruthy();
    });

    it('should be get a book as the search result on loadSearchs-action', (done) => {
      actions$ = of(loadSearchs({ searchString: 'test' }));
      effects.searchBooks$.pipe(toArray()).subscribe((actions) => {
        expect(actions.length).toBe(1);
        expect(actions).toEqual([
          loadSearchsSuccess({ searchResults: [bookEntity] })
        ]);
        done();
      });
    });
  });
  describe(' with action loadSearchsSuccess ', () => {
    beforeEach(() => {});

    it('effects should NOT do anything', (done) => {
      actions$ = of(loadSearchsSuccess({ searchResults: [] }));
      effects.searchBooks$.pipe(toArray()).subscribe((actions) => {
        expect(actions.length).toBe(0);
        done();
      });
    });
  });
});
