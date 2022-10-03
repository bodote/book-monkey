import { BookEntity } from './store/book-entity/book-entity.model';
import { Dictionary } from '@ngrx/entity';
import { initialSearchState, SearchState } from '../search/search.reducer';
import { BookRaw } from '../shared/book-raw';

export class BookFactory {
  private lastId = 0;

  bookEntity(book?: Partial<BookEntity>): BookEntity {
    const id = this.lastId++;
    return {
      isbn: `123-${id}`,
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
      isbn: `123-${id}`,
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
  state(state: Partial<SearchState>): SearchState {
    return {
      ...initialSearchState,
      ...state
    };
  }
}
