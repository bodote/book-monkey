import { TestBed } from '@angular/core/testing';

import { BookFactoryService } from './book-factory.service';

describe('BookFactoryService', () => {
  let service: BookFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
