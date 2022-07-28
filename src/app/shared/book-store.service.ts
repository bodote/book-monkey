import { BookFactoryService } from './book-factory.service';
import { BookRaw } from './book-raw';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Book } from './book';
import { catchError, delay, map, retry } from 'rxjs/operators';
import { tap, throwError } from 'rxjs';

/*
 */
@Injectable({
  providedIn: 'root'
})
export class BookStoreService {
  constructor(
    private http: HttpClient,
    private bookFactory: BookFactoryService
  ) {}

  deleteBook(isbn: string | undefined) {
    return this.http
      .delete(`https://api4.angular-buch.com/secure/book/${isbn}`, {
        responseType: 'arraybuffer'
      })
      .pipe(retry({ count: 3, delay: 1000 }), catchError(this.processError));
  }

  postBook(book: Book): Observable<BookRaw> {
    return this.http
      .post<BookRaw>(
        'https://api4.angular-buch.com/secure/book',
        this.bookFactory.getRawFromBook(book)
      )
      .pipe(
        tap((val) => console.log('post book return: ' + JSON.stringify(val))),
        catchError(this.processError)
      );
  }
  putBook(book: Book): Observable<BookRaw> {
    return this.http
      .put<BookRaw>(
        `https://api4.angular-buch.com/secure/book/${book.isbn}`,
        this.bookFactory.getRawFromBook(book)
      )
      .pipe(
        tap((val) => console.log('put book return: ' + JSON.stringify(val))),
        catchError(this.processError)
      );
  }

  getBook(isbn: string | null) {
    return this.http
      .get<BookRaw>(`https://api4.angular-buch.com/secure/book/${isbn}`)
      .pipe(
        retry({ count: 3, delay: 1000 }),
        catchError(this.processError),
        map((rawBook) => BookFactoryService.getFromRaw(rawBook)),
        delay(1000)
      );
  }

  getAll(): Observable<Book[]> {
    return this.http
      .get<BookRaw[]>('https://api4.angular-buch.com/secure/books')
      .pipe(
        retry({ count: 3, delay: 1000 }),
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
    console.error('service HttpErrorResponse: ' + JSON.stringify(err));
    return throwError(() => err);
  }
}
