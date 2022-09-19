import { createReducer, on } from '@ngrx/store';
import { Book } from '../shared/book';
import { loadSearchs, loadSearchsSuccess } from './search.actions';

export const searchFeatureKey = 'search';

export interface SearchState {
  books: Book[];
  searchPerformed: boolean;
}

export const initialState: SearchState = {
  books: [],
  searchPerformed: false
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
  })
);
