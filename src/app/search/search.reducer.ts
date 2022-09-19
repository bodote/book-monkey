import { createReducer, on } from '@ngrx/store';
import { Book } from '../shared/book';
import {
  loadSearchs,
  loadSearchsFailure,
  loadSearchsSuccess
} from './search.actions';
import { HttpErrorResponse } from '@angular/common/http';

export const searchFeatureKey = 'search';

export interface SearchState {
  books: Book[];
  searchPerformed: boolean;
  httpError: HttpErrorResponse | undefined;
}

export const initialState: SearchState = {
  books: [],
  searchPerformed: false,
  httpError: undefined
};

export const reducer = createReducer(
  initialState,
  on(loadSearchs, (state, action): SearchState => {
    //do nothing, handled by effect, and don't delete the old search results yet!
    return {
      ...state,
      searchPerformed: false
    };
  }),
  on(loadSearchsSuccess, (state, action): SearchState => {
    return {
      ...state,
      books: action.searchResults,
      searchPerformed: true
    };
  }),
  //
  on(loadSearchsFailure, (state, action): SearchState => {
    return {
      ...state,
      searchPerformed: true,
      httpError: action.error
    };
  })
);
