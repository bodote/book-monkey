import { INIT } from '@ngrx/store';
import { AppState, ROOT_REDUCERS } from '../../store';
import {
  bookEntitiesFeatureKey,
  bookEntityReducer,
  BookEntityState
} from './book-entity/book-entity.reducer';

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
      // ids: overrideBookEntityState.ids,
      // entities: overrideBookEntityState.entities,
      // httpError: overrideBookEntityState.httpError,
      // errorMessage: overrideBookEntityState.errorMessage,
      // lastUpdateTS: overrideBookEntityState.lastUpdateTS
    }
  } as AppState;
};
