import { TestBed } from '@angular/core/testing';

import { BookDetailsGuard } from './book-details.guard';

describe('BookDetailsGuard', () => {
  let guard: BookDetailsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BookDetailsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
