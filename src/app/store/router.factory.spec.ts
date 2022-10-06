import { loaderState, LoaderState } from './router.reducer';

export class RouterFactory {
  loaderState(state: Partial<LoaderState>): LoaderState {
    return {
      ...loaderState,
      ...state
    };
  }
}
