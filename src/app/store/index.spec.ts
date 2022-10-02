import { INIT } from '@ngrx/store';
import { AppState, ROOT_REDUCERS } from '.';

export const mockState = (override: Partial<AppState> = {}): AppState => {
  const initialState: any = {};
  Object.entries(ROOT_REDUCERS).forEach(([key, reducer]) => {
    initialState[key] = reducer(undefined, { type: INIT });
  });
  return { ...initialState, ...override } as AppState;
};
