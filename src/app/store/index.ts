import { RouterState } from '../custom-router-state-serializer';
import { ActionReducerMap } from '@ngrx/store';
import * as fromRouterStore from '@ngrx/router-store';
import * as fromLoaderState from './router.reducer';
import * as fromSearchRedState from '../search/search.reducer';

export const searchFeatureKey = 'search';
export const loaderFeatureKey = 'loader';

export interface AppState {
  router: RouterState;
  [loaderFeatureKey]: fromLoaderState.LoaderState;
  [searchFeatureKey]: fromSearchRedState.SearchState;
}
export const ROOT_REDUCERS: ActionReducerMap<AppState> = {
  router: fromRouterStore.routerReducer,
  [loaderFeatureKey]: fromLoaderState.reducer,
  [searchFeatureKey]: fromSearchRedState.reducer
};
//export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
//ng g reducer store/router --skipTests=true
