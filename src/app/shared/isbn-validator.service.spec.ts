import { TestBed } from '@angular/core/testing';

import { IsbnValidatorService } from './isbn-validator.service';

describe('IsbnValidatorService', () => {
  let service: IsbnValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsbnValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
