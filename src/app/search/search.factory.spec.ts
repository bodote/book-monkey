import { initialSearchState, SearchState } from './search.reducer';

/*
SearchState {
  books: BookEntity[];
  searchPerformed: boolean;
  httpError: HttpErrorResponse | undefined;
}
 */
export class SearchFactory {
  searchState(state: Partial<SearchState>): SearchState {
    return {
      ...initialSearchState,
      ...state
    };
  }
}
