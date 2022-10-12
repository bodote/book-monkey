import { BookFactory } from './book.factory.spec';
import {
  selectAllBookEntities,
  selectBookIds,
  selectCurrentBook,
  selectCurrentBookAndAll,
  selectError,
  selectErrorState,
  selectShowSavedSuccess,
  selectTotal,
  selectTotalAndErrors,
  selectTotalBooks
} from './book-entity.selectors';
import { HttpErrorResponse } from '@angular/common/http';

describe('BookEntity selectors', () => {
  const factory = new BookFactory();
  it('selectAllBooksEntities should select all books', () => {
    const state = factory.stateWith2Books();
    const result = selectAllBookEntities.projector(state);
    const booksFromState = factory.getBooksFromState(state);
    expect(result).toEqual(booksFromState);
  });
  it('selectErrorState should select ErrorState', () => {
    const errorMessage = 'the message';
    const state = factory.bookState({
      httpError: new HttpErrorResponse({ status: 404 }),
      lastUpdateTS: 1,
      errorMessage
    });
    const result = selectErrorState.projector(state);
    expect(result).toEqual({
      lastUpdateTS: state.lastUpdateTS,
      errorMessage: state.errorMessage,
      httpError: state.httpError
    });
  });
  it('selectCurrentBook should select  CurrentBook', () => {
    const state = factory.stateWith2Books();
    const result = selectCurrentBook.projector(state);
    const currentBook = state.currentBookId
      ? state.entities[state.currentBookId]
      : null;
    expect(result).toEqual(currentBook);
  });
  it('selectCurrentBook should select  CurrentBook or return null if not defined', () => {
    const state = factory.stateWith2Books();
    state.currentBookId = undefined;
    const result = selectCurrentBook.projector(state);
    const currentBook = state.currentBookId
      ? state.entities[state.currentBookId]
      : null;
    expect(result).toEqual(currentBook);
  });
  it('selectCurrentBookAndAll should select CurrentBookAndAll', () => {
    const bookA = factory.bookEntity();
    const bookB = factory.bookEntity();
    const booksInit = factory.entities(bookA, bookB);
    const errorMessage = 'the message';
    const state = factory.bookState({
      httpError: new HttpErrorResponse({ status: 404 }),
      lastUpdateTS: 1,
      errorMessage,
      ids: [bookA.isbn, bookB.isbn],
      entities: booksInit,
      currentBookId: bookA.isbn
    });
    const result = selectCurrentBookAndAll.projector(state);
    expect(result).toEqual({
      currentBookId: state.currentBookId,
      httpError: state.httpError,
      errorMessage: state.errorMessage,
      lastUpdateTS: state.lastUpdateTS,
      allBooks: factory.getBooksFromState(state)
    });
  });
  it('selectShowSavedSuccess should select ShowSavedSuccess(true)', () => {
    const state = factory.bookState({
      showSaveSuccess: true
    });
    const result = selectShowSavedSuccess.projector(state);
    expect(result).toEqual(true);
  });
  it('selectShowSavedSuccess should select ShowSavedSuccess(false)', () => {
    const state = factory.bookState({
      showSaveSuccess: false
    });
    const result = selectShowSavedSuccess.projector(state);
    expect(result).toEqual(false);
  });
  it('selectTotalBooks should select TotalBooks', () => {
    const state = factory.stateWith2Books();
    const result = selectTotalBooks.projector(state);
    expect(result).toEqual(2);
  });
  it('selectTotalAndErrors should select ErrorState', () => {
    const errorMessage = 'the message';
    const httpError = new HttpErrorResponse({ status: 404 });
    const stateW2Books = factory.stateWith2Books();
    const state = factory.bookState({
      ...stateW2Books,
      errorMessage,
      httpError,
      lastUpdateTS: 1
    });

    const result = selectTotalAndErrors.projector(state);
    expect(result).toEqual({
      total: selectTotal(state),
      lastUpdateTS: state.lastUpdateTS,
      httpError: state.httpError,
      errorMessage: state.errorMessage
    });
  });
  it('selectErrors should select ErrorState', () => {
    const errorMessage = 'the message';
    const httpError = new HttpErrorResponse({ status: 404 });
    const stateW2Books = factory.stateWith2Books();
    const state = factory.bookState({
      ...stateW2Books,
      errorMessage,
      httpError,
      lastUpdateTS: 1
    });

    const result = selectError.projector(state);
    expect(result).toEqual({
      httpError: state.httpError,
      errorMessage: state.errorMessage
    });
  });
  it('selectErrors should select ErrorState', () => {
    const httpError = new HttpErrorResponse({ status: 404 });
    const stateW2Books = factory.stateWith2Books();
    const state = factory.bookState({
      ...stateW2Books,
      httpError,
      lastUpdateTS: 1
    });

    const result = selectError.projector(state);
    expect(result).toEqual({
      httpError: state.httpError,
      errorMessage: null
    });
  });
  it('selectTotalAndErrors should return only total if no errors', () => {
    const stateW2Books = factory.stateWith2Books();
    const state = factory.bookState({
      ...stateW2Books,
      lastUpdateTS: 1
    });

    const result = selectTotalAndErrors.projector(state);
    expect(result).toEqual({
      total: selectTotal(state),
      lastUpdateTS: state.lastUpdateTS,
      httpError: null,
      errorMessage: null
    });
  });
  it('selectErrors should select empty ErrorState if there are no errors', () => {
    const stateW2Books = factory.stateWith2Books();
    const state = factory.bookState({
      ...stateW2Books,
      lastUpdateTS: 1
    });
    const result = selectError.projector(state);
    expect(result).toEqual({});
  });
  it('should return the book ids', () => {
    const bookA = factory.bookEntity();
    const bookB = factory.bookEntity();
    const booksInit = factory.entities(bookA, bookB);
    const state = factory.bookState({
      ids: [bookA.isbn, bookB.isbn],
      entities: booksInit
    });
    const result = selectBookIds.projector(state);
    expect(result[0]).toEqual(bookA.isbn);
    expect(result[1]).toEqual(bookB.isbn);
  });
});
