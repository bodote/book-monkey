import { BookFactoryService } from './book-factory.service';
import { BookRaw } from './book-raw';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Book } from './book';
import { catchError, delay, map, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { BookEntity } from '../books/store/book-entity/book-entity.model';

/*
 */
@Injectable({
  providedIn: 'root'
})
export class BookStoreService {
  server = `https://api4.angular-buch.com/secure`;
  //server = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  deleteBook(isbn: string | undefined): Observable<string> {
    return this.http
      .delete(`${this.server}/book/${isbn}`, {
        responseType: 'text' // needed because the api will not answer with JSON, but Angulars HttpClient defaults zu JSON
      })
      .pipe(retry({ count: 3, delay: 1000 }), catchError(this.processError));
  }

  postBook(book: Book): Observable<string> {
    const bookRaw = BookFactoryService.getRawFromBook(book);

    return this.http
      .post(`${this.server}/book`, bookRaw, {
        responseType: 'text'
      })
      .pipe(catchError(this.processError));
  }
  putBook(book: Book): Observable<string> {
    const bookRaw = BookFactoryService.getRawFromBook(book);
    return this.http
      .put(`${this.server}/book/${book.isbn}`, bookRaw, {
        responseType: 'text'
      })
      .pipe(catchError(this.processError));
  }

  getBook(isbn: string | null): Observable<Book> {
    return this.http.get<BookRaw>(`${this.server}/book/${isbn}`).pipe(
      retry({ count: 3, delay: 1000 }),
      catchError(this.processError),
      map((rawBook) => BookFactoryService.getFromRaw(rawBook)),
      delay(1000)
    );
  }
  getBookFast(isbn: string | null): Observable<Book | null> {
    return this.http.get<BookRaw>(`${this.server}/book/${isbn}`).pipe(
      catchError(this.processError),
      map((rawBook) => BookFactoryService.getFromRaw(rawBook))
    );
  }

  getAll(): Observable<Book[]> {
    return this.http.get<BookRaw[]>(`${this.server}/books`).pipe(
      retry({ count: 1, delay: 500 }),
      catchError(this.processError),
      map((rawBooksArray: BookRaw[]): Book[] =>
        rawBooksArray.map((rawBook) => BookFactoryService.getFromRaw(rawBook))
      ),
      delay(500)
    );
  }
  getAllEntities(): Observable<BookEntity[]> {
    return this.http.get<BookRaw[]>(`${this.server}/books`).pipe(
      retry({ count: 1, delay: 500 }),
      catchError(this.processError),
      map((rawBooksArray: BookRaw[]): BookEntity[] =>
        rawBooksArray.map((rawBook) =>
          BookFactoryService.getFromRaw2Entity(rawBook)
        )
      ),
      delay(500)
    );
  }

  getAllSearch(text: string): Observable<Book[]> {
    return this.http.get<BookRaw[]>(`${this.server}/books/search/${text}`).pipe(
      retry({ count: 1, delay: 100 }),
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
