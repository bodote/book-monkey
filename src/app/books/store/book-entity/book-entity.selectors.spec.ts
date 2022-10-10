import { BookFactory } from './book.factory.spec';
import {
  selectAllBooksEntities,
  selectCurrentBook
} from './book-entity.selectors';
import { BookEntity } from './book-entity.model';

describe('BookEntity selectors', () => {
  const factory = new BookFactory();
  it('selectAllBooksEntities should select all books', () => {
    const state = factory.stateWith2Books();
    const result: BookEntity[] = selectAllBooksEntities.projector(state);
    const booksFromState = factory.getBooksFromState(state);
    expect(result).toEqual(booksFromState);
  });
  it('selectErrorState should select ErrorState', () => {
    fail('fail');
  });
  it('selectCurrentBook should select  CurrentBook', () => {
    const state = factory.stateWith2Books();
    const result = selectCurrentBook.projector(state);
    const currentBook = state.currentBookId
      ? state.entities[state.currentBookId]
      : undefined;
    expect(result).toEqual(currentBook);
  });
});
