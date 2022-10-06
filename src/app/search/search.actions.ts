import { createAction, props } from '@ngrx/store';
import { BookEntity } from '../books/store/book-entity/book-entity.model';

export const loadSearchs = createAction(
  '[Search] Load Book Searchs',
  props<{ searchString: string }>()
);

export const loadSearchsSuccess = createAction(
  '[Search] Load Searchs Success',
  props<{ searchResults: BookEntity[] }>()
);

export const loadSearchsFailure = createAction(
  '[Search] Load Searchs Failure',
  props<{ error: any }>()
);
