import { ROOT_REDUCERS } from '../../store';
import { INIT } from '@ngrx/store';
import { BookEntityState } from './book-entity/book-entity.reducer';

export const mockBookState = (
  override: Partial<BookEntityState> = {}
): BookEntityState => {
  const initialState: any = {};
  Object.entries(ROOT_REDUCERS).forEach(([key, reducer]) => {
    initialState[key] = reducer(undefined, { type: INIT });
  });
  return { ...initialState, ...override } as BookEntityState;
};
