import {
  bookEntityReducer,
  initialBookEntityState
} from './book-entity.reducer';
import {
  addBookEntity,
  addBookEntitySuccess,
  bookErrorAction,
  deleteBookEntity,
  deleteBookEntitySuccess,
  httpFailure,
  loadBookEntities,
  loadBookEntitiesSuccess,
  upsertBookEntity,
  upsertBookEntitySuccess
} from './book-entity.actions';
import { BookFactory } from './book.factory.spec';
import { HttpErrorResponse } from '@angular/common/http';

describe('BookEntity Reducer', () => {
  const factory = new BookFactory();
  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;
      const result = bookEntityReducer(initialBookEntityState, action);
      expect(result).toEqual(initialBookEntityState);
    });
  });
  describe('loadBookEntities action', () => {
    it('should return the previous state', () => {
      const result = bookEntityReducer(
        initialBookEntityState,
        loadBookEntities
      );
      expect(result).toEqual(initialBookEntityState);
    });
  });
  describe('loadBookEntitiesSuccess action', () => {
    it('should return the state with books', () => {
      //arrange
      const bookA = factory.bookEntity();
      const bookB = factory.bookEntity();
      const books = factory.entities(bookA, bookB);
      const ts = 1;
      //act
      const result = bookEntityReducer(
        initialBookEntityState,
        loadBookEntitiesSuccess({ bookEntities: [bookA, bookB], timeStamp: ts })
      );
      //assert
      let expectedState = factory.bookState({
        ids: [bookA.isbn, bookB.isbn],
        entities: books,
        lastUpdateTS: ts
      });
      expect(result).toEqual(expectedState);
    });
  });
  describe('bookErrorAction action', () => {
    it('should return the state with error message', () => {
      const errMsgString = 'errorblabla';
      const result = bookEntityReducer(
        initialBookEntityState,
        bookErrorAction({ message: errMsgString })
      );
      //assert
      let expectedState = factory.bookState({
        errorMessage: errMsgString
      });
      expect(result).toEqual(expectedState);
    });
  });
  describe('httpFailure action', () => {
    it('should return the previous state', () => {
      const herror = new HttpErrorResponse({ status: 404 });
      const ts = 1;
      const result = bookEntityReducer(
        factory.emptyBookState(),
        httpFailure({ httpError: herror, timeStamp: ts })
      );
      //assert
      let expectedState = factory.bookState({
        httpError: herror,
        lastUpdateTS: ts
      });
      expect(result).toEqual(expectedState);
    });
  });
  describe('addBookEntitySuccess action', () => {
    it('should return the previous state', () => {
      const bookA = factory.bookEntity();
      const bookB = factory.bookEntity();
      const booksInit = factory.entities(bookA);
      const booksResult = factory.entities(bookA, bookB);
      const ts1 = 1;
      const stateBefore = factory.bookState({
        ids: [bookA.isbn],
        entities: booksInit,
        lastUpdateTS: ts1,
        showSaveSuccess: false
      });
      const result = bookEntityReducer(
        stateBefore,
        addBookEntitySuccess({ bookEntity: bookB })
      );
      let expectedState = factory.bookState({
        ids: [bookA.isbn, bookB.isbn],
        entities: booksResult,
        lastUpdateTS: ts1,
        showSaveSuccess: true
      });
      expect(result).toEqual(expectedState);
    });
  });
  describe('action ', () => {
    const bookA = factory.bookEntity();
    const parameters = [
      {
        description: 'addBookEntity ',
        action: addBookEntity,
        actionArg: { bookEntity: bookA }
      },
      {
        description: 'upsertBookEntity ',
        action: upsertBookEntity,
        actionArg: { bookEntity: bookA }
      },
      {
        description: 'deleteBookEntity',
        action: deleteBookEntity,
        actionArg: { id: bookA.isbn }
      }
    ];
    parameters.forEach((param) => {
      it(
        param.description + ' should return  state with showSaveSuccess: false',
        () => {
          const stateBefore = factory.bookState({
            showSaveSuccess: true
          });
          const result = bookEntityReducer(
            stateBefore,
            param.action(param.actionArg as any)
          );
          let expectedState = factory.bookState({
            showSaveSuccess: false
          });
          expect(result).toEqual(expectedState);
        }
      );
    });
  });
  describe('upsertBookEntitySuccess action', () => {
    it('should return state with changed book and showSaveSuccess flag set', () => {
      const bookA = factory.bookEntity();
      const bookB = factory.bookEntity();
      const bookBChanged = {
        ...bookB,
        title: 'totally different'
      };
      const booksInit = factory.entities(bookA, bookB);
      const booksChanged = factory.entities(bookA, bookBChanged);
      const ts1 = 1;
      const stateBefore = factory.bookState({
        ids: [bookA.isbn, bookB.isbn],
        entities: booksInit,
        lastUpdateTS: ts1,
        showSaveSuccess: false
      });
      const result = bookEntityReducer(
        stateBefore,
        upsertBookEntitySuccess({ bookEntity: bookBChanged })
      );
      let expectedState = factory.bookState({
        ids: [bookA.isbn, bookBChanged.isbn],
        entities: booksChanged,
        lastUpdateTS: ts1,
        showSaveSuccess: true
      });
      expect(result).toEqual(expectedState);
    });
    it('should return state with added book and showSaveSuccess flag set', () => {
      const bookA = factory.bookEntity();
      const bookBAdded = factory.bookEntity();
      const booksInit = factory.entities(bookA);
      const booksAdded = factory.entities(bookA, bookBAdded);
      const ts1 = 1;
      const stateBefore = factory.bookState({
        ids: [bookA.isbn],
        entities: booksInit,
        lastUpdateTS: ts1,
        showSaveSuccess: false
      });
      const result = bookEntityReducer(
        stateBefore,
        upsertBookEntitySuccess({ bookEntity: bookBAdded })
      );
      let expectedState = factory.bookState({
        ids: [bookA.isbn, bookBAdded.isbn],
        entities: booksAdded,
        lastUpdateTS: ts1,
        showSaveSuccess: true
      });
      expect(result).toEqual(expectedState);
    });
  });
  describe('deleteBookEntitySuccess action', () => {
    it('should return  state without the specific book', () => {
      const bookA = factory.bookEntity();
      const bookB = factory.bookEntity();
      const isdnToDelete = bookB.isbn;
      const booksInit = factory.entities(bookA, bookB);
      const booksChanged = factory.entities(bookA);
      const ts1 = 1;
      const stateBefore = factory.bookState({
        ids: [bookA.isbn, bookB.isbn],
        entities: booksInit,
        lastUpdateTS: ts1,
        showSaveSuccess: false
      });
      const result = bookEntityReducer(
        stateBefore,
        deleteBookEntitySuccess({ id: isdnToDelete })
      );
      let expectedState = factory.bookState({
        ids: [bookA.isbn],
        entities: booksChanged,
        lastUpdateTS: ts1,
        showSaveSuccess: true
      });
      expect(result).toEqual(expectedState);
    });
  });
  describe('loadAllAndSetCurrentBookSuccess action', () => {
    it('should return the previous state', () => {
      const result = bookEntityReducer(
        initialBookEntityState,
        loadBookEntities
      );
      let expectedState = factory.bookState({});
      expect(result).toEqual(expectedState);
      fail('not yet ');
    });
  });
  describe('loadAllAndSetCurrentBook action', () => {
    it('should return the previous state', () => {
      const result = bookEntityReducer(
        initialBookEntityState,
        loadBookEntities
      );
      let expectedState = factory.bookState({});
      expect(result).toEqual(expectedState);
      fail('not yet ');
    });
  });
  describe('isbnNotFound action', () => {
    it('should return the previous state', () => {
      const result = bookEntityReducer(
        initialBookEntityState,
        loadBookEntities
      );
      let expectedState = factory.bookState({});
      expect(result).toEqual(expectedState);
      fail('not yet ');
    });
  });
  describe('setCurrentBookSuccess action', () => {
    it('should return the previous state', () => {
      const result = bookEntityReducer(
        initialBookEntityState,
        loadBookEntities
      );
      let expectedState = factory.bookState({});
      expect(result).toEqual(expectedState);
      fail('not yet ');
    });
  });
  describe('resetSavedSuccessFlag action', () => {
    it('should return the previous state', () => {
      const result = bookEntityReducer(
        initialBookEntityState,
        loadBookEntities
      );
      let expectedState = factory.bookState({});
      expect(result).toEqual(expectedState);
      fail('not yet ');
    });
  });
  describe('resetErrorsAction action', () => {
    it('should return the previous state', () => {
      const result = bookEntityReducer(
        initialBookEntityState,
        loadBookEntities
      );
      let expectedState = factory.bookState({});
      expect(result).toEqual(expectedState);
      fail('not yet ');
    });
  });
});
