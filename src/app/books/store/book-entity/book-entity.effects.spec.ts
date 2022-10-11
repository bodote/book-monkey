import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, toArray } from 'rxjs';

import { BookEntityEffects } from './book-entity.effects';
import { TypedAction } from '@ngrx/store/src/models';
import { BookStoreService } from '../../../shared/book-store.service';
import { BookFactory } from './book.factory.spec';
import { BookEntity } from './book-entity.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from '../../../store';
import { mockState } from '../../../store/index.spec';
import {
  addBookEntity,
  addBookEntitySuccess,
  deleteBookEntity,
  deleteBookEntitySuccess,
  loadAllAndSetCurrentBook,
  loadAllAndSetCurrentBookSuccess,
  loadBookEntities,
  loadBookEntitiesSuccess,
  upsertBookEntity,
  upsertBookEntitySuccess
} from './book-entity.actions';

describe('BookEntityEffects', () => {
  let actions$: Observable<TypedAction<any>>;
  let effects: BookEntityEffects;
  let mockService = jasmine.createSpyObj<BookStoreService>('bookStoreService', [
    'getAllEntities',
    'postBook',
    'deleteBook',
    'putBook'
  ]);
  let factory: BookFactory;
  let bookEntity: BookEntity;
  let store: MockStore;
  beforeEach(() => {
    factory = new BookFactory();
    bookEntity = factory.bookEntity();

    TestBed.configureTestingModule({
      providers: [
        BookEntityEffects,
        provideMockActions(() => actions$),
        { provide: BookStoreService, useValue: mockService },
        provideMockStore<AppState>({ initialState: mockState() })
      ]
    });
    effects = TestBed.inject(BookEntityEffects);
    store = TestBed.inject(MockStore);
  });
  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
  describe(' success case with BookService.getAllEntities ', () => {
    beforeEach(() => {
      mockService.getAllEntities = jasmine
        .createSpy<() => Observable<BookEntity[]>>()
        .and.returnValue(of([bookEntity]));
    });
    it('loadBooks$ should dispatch action loadBookEntitiesSuccess', (done) => {
      actions$ = of(loadBookEntities());
      effects.loadBooks$.pipe(toArray()).subscribe((actions) => {
        expect(actions.length).toBe(1);
        const actionExpected = loadBookEntitiesSuccess({
          bookEntities: [bookEntity],
          timeStamp: Date.now()
        });
        expect(loadBookEntities().type).toContain('Load BookEntities');
        expect(actionExpected.type).toContain('Load BookEntities Success');
        expect(actions.length).toEqual(1);
        expect(actions[0].type).toEqual(actionExpected.type);
        expect((actions[0] as typeof actionExpected).bookEntities).toEqual(
          actionExpected.bookEntities
        );
        expect(
          (actions[0] as typeof actionExpected).timeStamp
        ).toBeLessThanOrEqual(actionExpected.timeStamp);
        expect(mockService.getAllEntities).toHaveBeenCalledOnceWith();
        done();
      });
    });
    it('reloadBooksAndSetCurrentBook$ should dispatch action loadBookEntitiesSuccess', (done) => {
      actions$ = of(loadAllAndSetCurrentBook({ isbn: bookEntity.isbn }));
      effects.reloadBooksAndSetCurrentBook$
        .pipe(toArray())
        .subscribe((actions) => {
          expect(actions.length).toBe(1);
          const actionExpected = loadAllAndSetCurrentBookSuccess({
            books: [bookEntity],
            currentBookId: bookEntity?.isbn,
            timeStamp: Date.now()
          });
          expect(
            loadAllAndSetCurrentBook({ isbn: bookEntity.isbn }).type
          ).toContain('Load all and set Current Book');
          expect(actionExpected.type).toContain(
            'Load all and set Current Book Success'
          );
          expect(actions.length).toEqual(1);
          expect(actions[0].type).toEqual(actionExpected.type);
          expect((actions[0] as typeof actionExpected).currentBookId).toEqual(
            actionExpected.currentBookId
          );
          expect((actions[0] as typeof actionExpected).books).toEqual(
            actionExpected.books
          );
          expect(
            (actions[0] as typeof actionExpected).timeStamp
          ).toBeLessThanOrEqual(actionExpected.timeStamp);
          expect(mockService.getAllEntities).toHaveBeenCalledOnceWith();
          done();
        });
    });
  });
  describe(' success case with BookService.postBook ', () => {
    beforeEach(() => {
      mockService.postBook = jasmine
        .createSpy<() => Observable<string>>()
        .and.returnValue(of('OK'));
    });
    it('addBook$ should dispatch action addBookEntitySuccess', (done) => {
      actions$ = of(addBookEntity({ bookEntity }));
      effects.addBook$.pipe(toArray()).subscribe((actions) => {
        expect(actions.length).toBe(1);
        const actionExpected = addBookEntitySuccess({
          bookEntity
        });
        expect(actionExpected.type).toContain('Add BookEntity Success');
        expect(addBookEntity({ bookEntity }).type).toContain('Add BookEntity');
        expect(actions.length).toEqual(1);
        expect(actions[0].type).toEqual(actionExpected.type);
        expect((actions[0] as typeof actionExpected).bookEntity).toEqual(
          actionExpected.bookEntity
        );
        expect(mockService.postBook).toHaveBeenCalledOnceWith(bookEntity);
        done();
      });
    });
  });
  describe(' success case with BookService.deleteBook ', () => {
    beforeEach(() => {
      mockService.deleteBook = jasmine
        .createSpy<() => Observable<string>>()
        .and.returnValue(of('OK'));
    });
    it('deleteBook$ should dispatch action addBookEntitySuccess', (done) => {
      actions$ = of(deleteBookEntity({ id: bookEntity.isbn }));
      effects.deleteBook$.pipe(toArray()).subscribe((actions) => {
        expect(actions.length).toBe(1);
        const actionExpected = deleteBookEntitySuccess({
          id: bookEntity.isbn
        });
        expect(deleteBookEntity({ id: bookEntity.isbn }).type).toContain(
          'Delete BookEntity'
        );
        expect(actionExpected.type).toContain('Delete BookEntity Success');
        expect(actions.length).toEqual(1);
        expect(actions[0].type).toEqual(actionExpected.type);
        expect((actions[0] as typeof actionExpected).id).toEqual(
          actionExpected.id
        );
        expect(mockService.deleteBook).toHaveBeenCalledOnceWith(
          bookEntity.isbn
        );
        done();
      });
    });
  });
  describe(' success case with BookService.putBook ', () => {
    beforeEach(() => {
      mockService.putBook = jasmine
        .createSpy<() => Observable<string>>()
        .and.returnValue(of('OK'));
    });
    it('saveCurrentBook$ should dispatch action addBookEntitySuccess', (done) => {
      actions$ = of(
        upsertBookEntity({ bookEntity }),
        upsertBookEntity({ bookEntity })
      );
      effects.saveCurrentBook$.pipe(toArray()).subscribe((actions) => {
        expect(actions.length).toBe(1); //! because the 2nd action is exactly the same and should be ignored
        const actionExpected = upsertBookEntitySuccess({
          bookEntity
        });
        expect(upsertBookEntity({ bookEntity }).type).toContain(
          'Upsert BookEntity'
        );
        expect(actionExpected.type).toContain('Upsert BookEntity Success');
        expect(actions.length).toEqual(1);
        expect(actions[0].type).toEqual(actionExpected.type);
        expect((actions[0] as typeof actionExpected).bookEntity).toEqual(
          actionExpected.bookEntity
        );
        expect(mockService.putBook).toHaveBeenCalledOnceWith(bookEntity);
        done();
      });
    });
  });
});
