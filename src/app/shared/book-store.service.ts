import { BookFactoryService } from './book-factory.service';
import { BookRaw } from './book-raw';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Book } from './book';
import { catchError, delay, map, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';

/*
 */
@Injectable({
  providedIn: 'root'
})
export class BookStoreService {
  constructor(private http: HttpClient) {}

  deleteBook(isbn: string | undefined): Observable<string> {
    return this.http
      .delete(`https://api4.angular-buch.com/secure/book/${isbn}`, {
        responseType: 'text' // needed because the api will not answer with JSON, but Angulars HttpClient defaults zu JSON
      })
      .pipe(retry({ count: 3, delay: 1000 }), catchError(this.processError));
  }

  postBook(book: Book): Observable<string> {
    const bookRaw = BookFactoryService.getRawFromBook(book);

    return this.http
      .post('https://api4.angular-buch.com/secure/book', bookRaw, {
        responseType: 'text'
      })
      .pipe(
        //tap((val) => console.log('post book return: ' + JSON.stringify(val))),
        catchError(this.processError)
      );
  }
  putBook(book: Book): Observable<string> {
    const bookRaw = BookFactoryService.getRawFromBook(book);
    return this.http
      .put(`https://api4.angular-buch.com/secure/book/${book.isbn}`, bookRaw, {
        responseType: 'text'
      })
      .pipe(catchError(this.processError));
  }

  getBook(isbn: string | null): Observable<Book> {
    return this.http
      .get<BookRaw>(`https://api4.angular-buch.com/secure/book/${isbn}`)
      .pipe(
        retry({ count: 3, delay: 1000 }),
        catchError(this.processError),
        map((rawBook) => BookFactoryService.getFromRaw(rawBook)),
        delay(1000)
      );
  }
  getBookFast(isbn: string | null): Observable<Book | null> {
    return this.http
      .get<BookRaw>(`https://api4.angular-buch.com/secure/book/${isbn}`)
      .pipe(
        catchError(this.processError),
        map((rawBook) => BookFactoryService.getFromRaw(rawBook))
      );
  }

  getAll(): Observable<Book[]> {
    return this.http
      .get<BookRaw[]>('https://api4.angular-buch.com/secure/books')
      .pipe(
        retry({ count: 3, delay: 500 }),
        catchError(this.processError),
        map((rawBooksArray: BookRaw[]): Book[] =>
          rawBooksArray.map((rawBook) => BookFactoryService.getFromRaw(rawBook))
        ),
        delay(1000)
      );
  }

  getAllSearch(text: string): Observable<Book[]> {
    return this.http
      .get<BookRaw[]>(
        `https://api4.angular-buch.com/secure/books/search/${text}`
      )
      .pipe(
        retry({ count: 3, delay: 1000 }),
        catchError(this.processError),
        map((rawBooksArray: BookRaw[]): Book[] =>
          rawBooksArray.map((rawBook) => BookFactoryService.getFromRaw(rawBook))
        )
      );
  }

  private processError(err: HttpErrorResponse): Observable<any> {
    //console.error('Service HttpErrorResponse: ' + JSON.stringify(err));
    return throwError(() => err);
  }
}
