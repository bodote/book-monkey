import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { BookEntity } from './book-entity.model';
import * as BookEntityActions from './book-entity.actions';

import { HttpErrorResponse } from '@angular/common/http';
import * as BookActions from '../book-entity/book-entity.actions';

export const bookEntitiesFeatureKey = 'bookEntities';

export interface BookEntityState extends EntityState<BookEntity> {
  // additional entities state properties
  currentBookId: string | undefined;
  httpError: HttpErrorResponse | null;
  errorMessage: string | null;
  showSaveSuccess: boolean;
  searchResults: BookEntity[];
  lastUpdateTS: number;
}

export const adapter: EntityAdapter<BookEntity> =
  createEntityAdapter<BookEntity>({
    selectId: (bookEntity) => bookEntity.isbn
  });

export const initialBookEntityState: BookEntityState = adapter.getInitialState({
  currentBookId: undefined,
  httpError: null,
  errorMessage: null,
  showSaveSuccess: false,
  searchResults: [],
  lastUpdateTS: 0
});

export const bookEntityReducer = createReducer(
  initialBookEntityState,
  on(BookEntityActions.addBookEntitySuccess, (state, action) => {
    state = adapter.addOne(action.bookEntity, state);
    state.showSaveSuccess = true;
    return state;
  }),
  on(BookEntityActions.addBookEntity, (state, action): BookEntityState => {
    return {
      ...state,
      showSaveSuccess: false
    };
  }),
  on(BookEntityActions.upsertBookEntitySuccess, (state, action) => {
    state = adapter.upsertOne(action.bookEntity, state);
    state.showSaveSuccess = true;
    return state;
  }),
  on(BookEntityActions.upsertBookEntity, (state, action) => {
    return { ...state, showSaveSuccess: false };
  }),
  on(BookEntityActions.deleteBookEntity, (state, action) => {
    return { ...state, showSaveSuccess: false };
  }),

  on(BookEntityActions.deleteBookEntitySuccess, (state, action) => {
    state = adapter.removeOne(action.id, state);
    state.showSaveSuccess = true;
    return state;
  }),

  on(BookEntityActions.loadBookEntitiesSuccess, (state, action) => {
    state = adapter.setAll(action.bookEntities, state);
    state.lastUpdateTS = action.timeStamp;
    return state;
  }),
  on(
    BookEntityActions.setCurrentBookSuccess,
    (state, action): BookEntityState => {
      return {
        ...state,
        currentBookId: action.currentBookId
      };
    }
  ),
  on(
    BookEntityActions.loadAllAndSetCurrentBookSuccess,
    (state, action): BookEntityState => {
      state = adapter.setAll(action.books, state);
      state.lastUpdateTS = action.timeStamp;
      return {
        ...state,
        currentBookId: action.currentBookId
      };
    }
  ),
  on(BookEntityActions.httpFailure, (state, action): BookEntityState => {
    return {
      ...state,
      httpError: action.httpError,
      lastUpdateTS: action.timeStamp
    };
  }),
  on(BookEntityActions.bookErrorAction, (state, action): BookEntityState => {
    return {
      ...state,
      errorMessage: action.message
    };
  }),

  on(BookActions.isbnNotFound, (state, action): BookEntityState => {
    return {
      ...state,
      httpError: null,
      errorMessage: action.errorMessage
    };
  }),
  on(BookActions.resetSavedSuccessFlag, (state, action): BookEntityState => {
    return {
      ...state,
      showSaveSuccess: false
    };
  }),
  on(BookActions.resetErrorsAction, (state, action): BookEntityState => {
    return {
      ...state,
      httpError: null,
      errorMessage: null
    };
  })
);
