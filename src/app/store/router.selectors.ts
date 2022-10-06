import * as fromRouterStore from '@ngrx/router-store';
import { RouterState } from '../custom-router-state-serializer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LoaderState } from './router.reducer';
import { loaderFeatureKey } from './index';

export const selectRouterState = createFeatureSelector<
  fromRouterStore.RouterReducerState<RouterState>
>(
  'router' // TODO testcoverage
);

export const selectLoaderState =
  createFeatureSelector<LoaderState>(loaderFeatureKey);

export const selectPageLoading = createSelector(
  selectLoaderState,
  (loaderState) => {
    return !!loaderState.loading;
  }
);
