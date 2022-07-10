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
  deleteBook(isbn: string | undefined) {
    return this.http
      .delete(`https://api4.angular-buch.com/secure/book/${isbn}`, {
        responseType: 'arraybuffer'
      })
      .pipe(retry({ count: 3, delay: 1000 }), catchError(this.processError));
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

  constructor(private http: HttpClient) {}
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
    console.error('Error in bookStoreService: ' + err.message);
    return throwError((): string => 'HttpError: ' + err.message);
  }
}
