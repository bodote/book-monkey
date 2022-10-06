import { createReducer, on } from '@ngrx/store';
import {
  loadSearchs,
  loadSearchsFailure,
  loadSearchsSuccess
} from './search.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { BookEntity } from '../books/store/book-entity/book-entity.model';

export interface SearchState {
  books: BookEntity[];
  searchPerformed: boolean;
  httpError: HttpErrorResponse | undefined;
}

export const initialSearchState: SearchState = {
  books: [],
  searchPerformed: false,
  httpError: undefined
};

export const reducer = createReducer(
  initialSearchState,
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
