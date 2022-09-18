import * as fromRouterStore from '@ngrx/router-store';
import { RouterState } from '../custom-router-state-serializer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { loaderFeatureKey, LoaderState } from './router.reducer';

const selectRouterState =
  createFeatureSelector<fromRouterStore.RouterReducerState<RouterState>>(
    'router'
  );
const selectLoaderState = createFeatureSelector<LoaderState>(loaderFeatureKey);

export const selectPageLoading = createSelector(
  selectLoaderState,
  (loaderState) => {
    return !!loaderState?.loading;
  }
);
