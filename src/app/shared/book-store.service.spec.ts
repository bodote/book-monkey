import { TestBed } from '@angular/core/testing';

import { BookStoreService } from './book-store.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('BookStoreService', () => {
  let service: BookStoreService;
  let httpTestingController;
  let httpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(BookStoreService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should delete a book with isbn', function () {
    //act
    const res = service.deleteBook('123');
    //assert
  });
});
