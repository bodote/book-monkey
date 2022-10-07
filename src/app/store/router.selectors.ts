import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LoaderState } from './router.reducer';
import { loaderFeatureKey } from './index';
// TODO not needed  ?
// const selectRouterFeature = createFeatureSelector<
//   fromRouterStore.RouterReducerState<RouterState>
// >(
//   'routerx'
// );

// export const selectRouterState = createSelector(
//   selectRouterFeature,value=>value
// );
export const selectLoaderState =
  createFeatureSelector<LoaderState>(loaderFeatureKey);

export const selectPageLoading = createSelector(
  selectLoaderState,
  (loaderState) => {
    return loaderState.loading;
  }
);
