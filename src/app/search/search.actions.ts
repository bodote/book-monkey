import { createAction, props } from '@ngrx/store';
import { Book } from '../shared/book';

export const loadSearchs = createAction(
  '[Search] Load Book Searchs',
  props<{ searchString: string }>()
);

export const loadSearchsSuccess = createAction(
  '[Search] Load Searchs Success',
  props<{ searchResults: Book[] }>()
);

export const loadSearchsFailure = createAction(
  '[Search] Load Searchs Failure',
  props<{ error: any }>()
);
