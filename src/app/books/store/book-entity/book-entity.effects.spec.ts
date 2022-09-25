import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { BookEntityEffects } from './book-entity.effects';

describe('BookEntityEffects', () => {
  let actions$: Observable<any>;
  let effects: BookEntityEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BookEntityEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(BookEntityEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
