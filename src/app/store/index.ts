import { RouterState } from '../custom-router-state-serializer';
import { ActionReducerMap } from '@ngrx/store';
import * as fromRouterStore from '@ngrx/router-store';
import * as fromLoaderState from './router.reducer';
import { loaderFeatureKey } from './router.reducer';

export interface AppState {
  router: RouterState;
  [loaderFeatureKey]: fromLoaderState.LoaderState;
}
export const ROOT_REDUCERS: ActionReducerMap<AppState> = {
  router: fromRouterStore.routerReducer,
  [loaderFeatureKey]: fromLoaderState.reducer
};
//export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
//ng g reducer store/router --skipTests=true
