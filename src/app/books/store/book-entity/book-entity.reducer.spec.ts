import {
  bookEntityReducer,
  initialBookEntityState
} from './book-entity.reducer';
import {
  addBookEntity,
  addBookEntitySuccess,
  bookErrorAction,
  httpFailure,
  loadBookEntities,
  loadBookEntitiesSuccess
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
  describe('addBookEntity action', () => {
    it('should return the previous state', () => {
      const bookA = factory.bookEntity();
      const stateBefore = factory.bookState({
        showSaveSuccess: true
      });
      const result = bookEntityReducer(
        stateBefore,
        addBookEntity({ bookEntity: bookA })
      );
      let expectedState = factory.bookState({
        showSaveSuccess: false
      });
      expect(result).toEqual(expectedState);
    });
  });
  describe('upsertBookEntity action', () => {
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
  describe('upsertBookEntitySuccess action', () => {
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
  describe('addBookEntitys action', () => {
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
  describe('upsertBookEntitys action', () => {
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
  describe('updateBookEntity action', () => {
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
  describe('updateBookEntities action', () => {
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
  describe('deleteBookEntity action', () => {
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
  describe('deleteBookEntitySuccess action', () => {
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
  describe('deleteBookEntitys action', () => {
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
  describe('clearBookEntitys action', () => {
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
