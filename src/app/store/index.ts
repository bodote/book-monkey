import { RouterState } from '../custom-router-state-serializer';
import { ActionReducerMap } from '@ngrx/store';
import * as fromRouterStore from '@ngrx/router-store';
import * as fromLoaderState from './router.reducer';
import { loaderFeatureKey } from './router.reducer';
import * as fromSearchState from '../search/search.reducer';
import { searchFeatureKey } from '../search/search.selectors';

export interface AppState {
  router: RouterState;
  [loaderFeatureKey]: fromLoaderState.LoaderState;
  [searchFeatureKey]: fromSearchState.SearchState;
}
export const ROOT_REDUCERS: ActionReducerMap<AppState> = {
  router: fromRouterStore.routerReducer,
  [loaderFeatureKey]: fromLoaderState.reducer,
  [searchFeatureKey]: fromSearchState.reducer
};
//export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
//ng g reducer store/router --skipTests=true
