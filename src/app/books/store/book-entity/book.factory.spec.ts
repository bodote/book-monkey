import { BookEntity } from './book-entity.model';
import { Dictionary } from '@ngrx/entity';
import { BookRaw } from '../../../shared/book-raw';
import {
  bookEntitiesFeatureKey,
  bookEntityReducer,
  BookEntityState,
  initialBookEntityState
} from './book-entity.reducer';
import { AppState, ROOT_REDUCERS } from '../../../store';
import { INIT } from '@ngrx/store';

export const mockStateWithBooksEntities = (
  overrideBookEntityState: Partial<BookEntityState> = {}
): AppState => {
  const initialState: any = {};
  Object.entries(ROOT_REDUCERS).forEach(([key, reducer]) => {
    initialState[key] = reducer(undefined, { type: INIT });
  });
  initialState[bookEntitiesFeatureKey] = bookEntityReducer(undefined, {
    type: INIT
  }); // we need to add the state of  Feature Modules manually here!
  return {
    ...initialState,
    bookEntities: {
      ...initialState[bookEntitiesFeatureKey],
      ...overrideBookEntityState
    }
  } as AppState;
};

export class BookFactory {
  private lastId = 0;

  bookEntity(book?: Partial<BookEntity>): BookEntity {
    const id = this.lastId++;
    return {
      isbn: `123456789${id}`,
      title: `Title ${id}`,
      description: `Description ${id}`,
      rating: 1,
      published: new Date('2002-02-02'),
      authors: ['author1'],
      ...book
    };
  }

  bookRaw(bookRaw?: Partial<BookRaw>): BookRaw {
    const id = this.lastId++;
    return {
      authors: ['author'],
      isbn: `123456789${id}`,
      published: '2022-02-02',
      title: 'a title',
      subtitle: '',
      description: '',
      rating: 3,
      thumbnails: [{ title: '', url: '' }],
      ...bookRaw
    };
  }

  entities(...booksEntities: BookEntity[]): Dictionary<BookEntity> {
    const entities: Dictionary<BookEntity> = {};
    booksEntities.forEach((bookEnt) => (entities[bookEnt.isbn] = bookEnt));
    return entities;
  }

  bookState(state: Partial<BookEntityState>): BookEntityState {
    return {
      ...initialBookEntityState,
      ...state
    };
  }
  emptyBookState(): BookEntityState {
    return this.bookState({});
  }
  stateWith2Books(): BookEntityState {
    const bookA = this.bookEntity();
    const bookB = this.bookEntity();
    const booksInit = this.entities(bookA, bookB);
    const ts1 = 1;
    return this.bookState({
      ids: [bookA.isbn, bookB.isbn],
      entities: booksInit,
      currentBookId: bookA.isbn,
      lastUpdateTS: ts1,
      showSaveSuccess: false
    });
  }
  getBooksFromState(state: BookEntityState): BookEntity[] {
    let booksInit: BookEntity[] = [];
    let i = 0;
    Object.keys(state.entities).forEach((key) => {
      if (state.entities[key]) {
        booksInit[i++] = <BookEntity>state.entities[key];
      }
    });
    return booksInit;
  }
}
