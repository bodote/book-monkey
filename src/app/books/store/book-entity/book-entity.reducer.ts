import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { BookEntity } from './book-entity.model';
import * as BookEntityActions from './book-entity.actions';
import { Book } from '../../../shared/book';
import { HttpErrorResponse } from '@angular/common/http';

export const bookEntitiesFeatureKey = 'bookEntities';

export interface BookEntityState extends EntityState<BookEntity> {
  // additional entities state properties
  currentBook: Book | undefined;
  httpError: HttpErrorResponse | null;
  errorMessage: string | null;
  showSaveSuccess: boolean;
  searchResults: Book[];
  lastUpdateTS: number;
}

export const adapter: EntityAdapter<BookEntity> =
  createEntityAdapter<BookEntity>({
    selectId: (bookEntity) => bookEntity.isbn
  });

export const initialState: BookEntityState = adapter.getInitialState({
  currentBook: undefined,
  httpError: null,
  errorMessage: null,
  showSaveSuccess: false,
  searchResults: [],
  lastUpdateTS: 0
});

export const reducer = createReducer(
  initialState,
  on(BookEntityActions.addBookEntity, (state, action) =>
    adapter.addOne(action.bookEntity, state)
  ),
  on(BookEntityActions.upsertBookEntity, (state, action) =>
    adapter.upsertOne(action.bookEntity, state)
  ),
  on(BookEntityActions.addBookEntitys, (state, action) =>
    adapter.addMany(action.bookEntitys, state)
  ),
  on(BookEntityActions.upsertBookEntitys, (state, action) =>
    adapter.upsertMany(action.bookEntitys, state)
  ),
  on(BookEntityActions.updateBookEntity, (state, action) =>
    adapter.updateOne(action.bookEntity, state)
  ),
  on(BookEntityActions.updateBookEntitys, (state, action) =>
    adapter.updateMany(action.bookEntitys, state)
  ),
  on(BookEntityActions.deleteBookEntity, (state, action) =>
    adapter.removeOne(action.id, state)
  ),
  on(BookEntityActions.deleteBookEntitys, (state, action) =>
    adapter.removeMany(action.ids, state)
  ),
  on(BookEntityActions.clearBookEntitys, (state) => adapter.removeAll(state)),
  on(BookEntityActions.loadBookEntitiesSuccess, (state, action) =>
    adapter.setAll(action.bookEntities, state)
  ),
  on(BookEntityActions.httpFailure, (state, action): BookEntityState => {
    return {
      ...state,
      httpError: action.httpError,
      lastUpdateTS: action.timeStamp
    };
  })
);
