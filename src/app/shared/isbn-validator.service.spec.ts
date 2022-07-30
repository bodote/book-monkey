import { TestBed } from '@angular/core/testing';

import { BodosValidatorService } from './bodos-validator.service';

describe('IsbnValidatorService', () => {
  let service: BodosValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BodosValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
