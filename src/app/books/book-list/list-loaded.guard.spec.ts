import { TestBed } from '@angular/core/testing';

import { ListLoadedGuard } from './list-loaded.guard';

describe('ListLoadedGuard', () => {
  let guard: ListLoadedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ListLoadedGuard);
  });

  xit('should be created', () => {
    expect(guard).toBeTruthy();
  });
});