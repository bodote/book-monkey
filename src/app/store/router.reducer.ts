import { createReducer, on } from '@ngrx/store';
import {
  routerCancelAction,
  routerErrorAction,
  routerNavigatedAction,
  routerNavigationAction
} from '@ngrx/router-store';

export interface LoaderState {
  loading: boolean;
}

export const loaderState: LoaderState = {
  loading: false
};

export const reducer = createReducer(
  loaderState,
  on(routerNavigationAction, (_): LoaderState => ({ loading: true })),
  on(routerNavigatedAction, (_): LoaderState => ({ loading: false })),
  on(routerCancelAction, (_): LoaderState => ({ loading: false })),
  on(routerErrorAction, (_): LoaderState => ({ loading: false }))
);
