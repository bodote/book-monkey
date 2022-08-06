import { BodosValidatorService } from './bodos-validator.service';
import { BookStoreService } from '../../shared/book-store.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BodosValidatorService', () => {
  let service: BookStoreService;
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(BookStoreService);
  });
  it('should create an instance', () => {
    const directive = new BodosValidatorService(service);
    expect(directive).toBeTruthy();
  });
});
