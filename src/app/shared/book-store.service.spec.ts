import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { BookStoreService } from './book-store.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { BookRaw } from './book-raw';
import { Book } from './book';
import { formatDate } from '@angular/common';

enum HttpMethods {
  DELETE = 'DELETE',
  GET = 'GET',
  PUT = 'PUT'
}
const theDate = new Date('2020-02-01');
let bookRaw = {
  title: 'string',
  authors: [],
  published: formatDate(theDate, 'YYYY-MM-dd', 'en', 'Z'),
  isbn: '123'
} as BookRaw;
let book = {
  title: 'string',
  authors: [],
  published: theDate,
  isbn: '123'
} as Book;

xdescribe('BookStoreService', () => {
  describe(' with Testbed', () => {
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
      numErrorResponds: number,
      url: string,
      method: string,
      expectedNumberOfRetrials: number = 3
    ) {
      let req = httpTestingController.expectOne(url);
      for (let i = 0; i < numErrorResponds; i++) {
        expect(req.request?.method).toEqual(method);
        req.error(errorEvent, errorResponse);
        tick(2000);
        if (i < expectedNumberOfRetrials)
          req = httpTestingController.expectOne(url);
      }
      return req;
    }

    it('should call deleteBook() and delete a book with isbn with 3 retries , if the first and second try fails', fakeAsync(() => {
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
    it('should call getBook() to get a book with isbn with 3 retries , if the first and second try fails', fakeAsync(() => {
      //act
      service.getBook('123').subscribe((b) => {
        expect(b.title).toEqual(book.title);
        expect(b.published).toEqual(book.published);
      });
      //assert and mock server responses via "flush()"
      let req = runAlwaysFailingRequests(
        3,
        'https://api4.angular-buch.com/secure/book/123',
        HttpMethods.GET
      );
      req?.flush(book);
      tick(1000);
      const n = flush();
      expect(n).toEqual(0);
    }));
    it('should call getBook() to get a book with isbn with 3 retries , but all 3 retries fails', fakeAsync(() => {
      //act
      service.getBook('123').subscribe({
        next: (b) => {
          fail('expect error');
        },
        error: (error) => {
          expect(error.status).toEqual(404);
        }
      });
      //assert and mock server responses via "flush()"
      let req = runAlwaysFailingRequests(
        4,
        'https://api4.angular-buch.com/secure/book/123',
        HttpMethods.GET,
        3
      );

      tick(1000);
      const n = flush();
      expect(n).toEqual(0);
    }));
    it('should call getAll() to get a book with isbn with 3 retries , if the first and second try fails', fakeAsync(() => {
      //act
      service.getAll().subscribe((b) => {
        expect(b[0].title).toEqual(book.title);
        expect(b[0].published).toEqual(book.published);
      });
      //assert and mock server responses via "flush()"
      let req = runAlwaysFailingRequests(
        3,
        'https://api4.angular-buch.com/secure/books',
        HttpMethods.GET
      );
      req?.flush([book]);
      tick(1000);
      const n = flush();
      expect(n).toEqual(0);
    }));
    it('should call getAll() to get a book with isbn with 3 retries , but all retrials fail', fakeAsync(() => {
      //act
      service.getAll().subscribe({
        next: (b) => {
          fail('expect error');
        },
        error: (error) => {
          expect(error.status).toEqual(404);
        }
      });
      //assert and mock server responses via "flush()"
      let req = runAlwaysFailingRequests(
        4,
        'https://api4.angular-buch.com/secure/books',
        HttpMethods.GET,
        3
      );

      tick(1000);
      const n = flush();
      expect(n).toEqual(0);
    }));
    xit('should call getAllSearch() to get a book with isbn with 3 retries , if the first and second try fails', fakeAsync(() => {
      //act
      service.getAllSearch('searchstring').subscribe((b) => {
        expect(b[0].title).toEqual(book.title);
        expect(b[0].published).toEqual(book.published);
      });
      //assert and mock server responses via "flush()"
      let req = runAlwaysFailingRequests(
        3,
        'https://api4.angular-buch.com/secure/books/search/searchstring',
        HttpMethods.GET
      );
      req?.flush([book]);
      tick(1000);
      const n = flush();
      expect(n).toEqual(0);
    }));
    xit('should call getAllSearch() to get a book with isbn with 3 retries , but all 3 retrials fail', fakeAsync(() => {
      //act
      service.getAllSearch('searchstring').subscribe({
        next: (b) => {
          fail('we actualy expect an error');
        },
        error: (error: HttpErrorResponse) => {
          expect(error.status).toEqual(404);
        }
      });
      //assert and mock server responses via "flush()"
      let req = runAlwaysFailingRequests(
        4,
        'https://api4.angular-buch.com/secure/books/search/searchstring',
        HttpMethods.GET,
        3
      );
      tick(1000);
      const n = flush();
      expect(n).toEqual(0);
    }));
    it('should try to deleteBook() and throw error when even the 3rd retry fails ', fakeAsync(() => {
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
  describe(' but without Testbed', () => {
    let bookStoreService: BookStoreService;
    let httpStub: HttpClient;
    beforeEach(() => {});
    it('getAll() should call http GET with url and return a Book array converted from BookRaw array', (done) => {
      //arrange:
      httpStub = jasmine.createSpyObj('httpStub', {
        get: of([bookRaw])
      });
      bookStoreService = new BookStoreService(httpStub);
      //act

      bookStoreService.getAll().subscribe((b: Book[]) => {
        expect(b.length).toEqual(1);
        expect(b[0].title).toEqual(book.title);
        expect(b[0].published).toEqual(book.published);
        done();
      });
      expect(httpStub.get).toHaveBeenCalledOnceWith(
        'https://api4.angular-buch.com/secure/books'
      );
    });
    it(
      'getBook() should call http GET with url and isbn  ' + ' from BookRaw',
      (done) => {
        //arrange:
        httpStub = jasmine.createSpyObj('httpStub', {
          get: of(bookRaw)
        });
        bookStoreService = new BookStoreService(httpStub);
        bookStoreService.getBook('123').subscribe((b: Book) => {
          expect(b.title).toEqual(book.title);
          expect(b.published).toEqual(book.published);
          done();
        });
        expect(httpStub.get).toHaveBeenCalledOnceWith(
          'https://api4.angular-buch.com/secure/book/123'
        );
      }
    );
    it('getBookFast() should call http GET with url and isbn and return this Book converted from BookRaw', (done) => {
      //arrange:
      httpStub = jasmine.createSpyObj('httpStub', {
        get: of(bookRaw)
      });
      bookStoreService = new BookStoreService(httpStub);
      bookStoreService.getBookFast('123').subscribe((b: Book | null) => {
        expect(b?.title).toEqual(book.title);
        expect(b?.published).toEqual(book.published);
        done();
      });
      expect(httpStub.get).toHaveBeenCalledOnceWith(
        'https://api4.angular-buch.com/secure/book/123'
      );
    });
    it('putBook() should call http PUT with book and return ok', (done) => {
      //arrange:
      httpStub = jasmine.createSpyObj('httpStub', {
        put: of('OK')
      });
      bookStoreService = new BookStoreService(httpStub);
      bookStoreService.putBook(book).subscribe((data) => {
        expect(data).toEqual('OK');
        done();
      });

      expect(httpStub.put).toHaveBeenCalledOnceWith(
        'https://api4.angular-buch.com/secure/book/123',
        bookRaw,
        {
          responseType: 'text' as jasmine.ExpectedRecursive<'json'>
        }
      );
    });
    it('postBook() should call http POST with book and return ok', (done) => {
      //arrange:
      httpStub = jasmine.createSpyObj('httpStub', {
        post: of('OK')
      });
      bookStoreService = new BookStoreService(httpStub);
      bookStoreService.postBook(book).subscribe((data) => {
        expect(data).toEqual('OK');
        done();
      });

      expect(httpStub.post).toHaveBeenCalledOnceWith(
        'https://api4.angular-buch.com/secure/book',
        bookRaw,
        {
          responseType: 'text' as jasmine.ExpectedRecursive<'json'>
        }
      );
    });
    it('getAllSearch() should call http get with search string and return list of books', (done) => {
      //arrange:
      httpStub = jasmine.createSpyObj('httpStub', {
        get: of([bookRaw])
      });
      bookStoreService = new BookStoreService(httpStub);
      bookStoreService.getAllSearch('search_string').subscribe((books) => {
        expect(books).toEqual([book]);
        done();
      });

      expect(httpStub.get).toHaveBeenCalledOnceWith(
        'https://api4.angular-buch.com/secure/books/search/search_string'
      );
    });
  });
});
