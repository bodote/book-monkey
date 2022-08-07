import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { BookStoreService } from './book-store.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

enum HttpMethods {
  DELETE = 'DELETE',
  GET = 'GET'
}

describe('BookStoreService', () => {
  let service: BookStoreService;
  let httpTestingController: HttpTestingController;
  let httpClient;
  const errorResponse = {
    status: 404,
    statusText: 'Not Found'
  };
  const errorEvent = new ProgressEvent('error');

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(BookStoreService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  function runAlwaysFailingRequests(
    numRequests: number,
    url: string,
    method: string
  ) {
    let req = httpTestingController.expectOne(url);
    for (let i = 0; i < numRequests; i++) {
      expect(req.request?.method).toEqual(method);
      req.error(errorEvent, errorResponse);
      tick(2000);
      req = httpTestingController.expectOne(url);
    }
    return req;
  }

  it('should delete a book with isbn with 3 retries , if the first and second try fails', fakeAsync(() => {
    //act
    service.deleteBook('123').subscribe((data) => expect(data).toEqual('OK'));
    //assert and mock server responses via "flush()"
    let req = runAlwaysFailingRequests(
      3,
      'https://api4.angular-buch.com/secure/book/123',
      HttpMethods.DELETE
    );
    req?.flush('OK');
  }));

  it('should throw error when even the 3rd retry fails ', fakeAsync(() => {
    let errorText = '';
    //act
    service.deleteBook('123').subscribe({
      next: (data) => expect(data).toEqual('OK'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toEqual(404);
        errorText = error.statusText;
      }
    });
    //assert and mock server responses via "flush()"
    let req = runAlwaysFailingRequests(
      3,
      'https://api4.angular-buch.com/secure/book/123',
      HttpMethods.DELETE
    );
    req.error(errorEvent, errorResponse);
    expect(errorText.length).toBeGreaterThan(2);
  }));

  afterEach(() => {
    httpTestingController.verify();
  });
});
