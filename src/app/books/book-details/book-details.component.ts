import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import { Book } from '../../shared/book';
import { BookStoreService } from '../../shared/book-store.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { selectAllBooks, selectError } from '../store/book.selectors';
import { delay, map } from 'rxjs/operators';
import { loadBooks } from '../store/book.actions';

@Component({
  selector: 'bm-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  book!: Book;
  book$: Observable<Book | undefined> | undefined;
  id: number = 0;
  error: HttpErrorResponse | undefined;
  loadingError$ = this.store.select(selectError);
  notFoundError: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bookService: BookStoreService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      let isbn: string | null;
      let retries = 0;
      this.notFoundError = null;
      if ((isbn = params.get('isbn')) != null) {
        this.book$ = this.store.select(selectAllBooks).pipe(
          map((books) => books.find((book) => book.isbn === isbn)),
          delay(100),
          tap((book) => {
            if (!book && retries < 2) {
              console.error(' no book with this isbn found: ' + isbn);
              console.log('retry once....' + retries);
              this.store.dispatch(loadBooks());
            } else if (!!book && retries < 2) {
              console.log('store.selectAllBooks found it !');
            } else if (retries >= 2 && !book) {
              console.log('retrie counter=' + retries);
              this.notFoundError =
                'store.selectAllBooks already tried once, not found this isbn in store:' +
                isbn;
            }
            retries++;
          })
        );
      } else {
        console.error(
          'no isbn param found in route, rerouting to /home (should actually route to an error page) '
        );
        this.router.navigate(['/home']);
      }
    });
  }

  readonly confirmMessage = 'Really delete book?';

  delete(isbn: string | undefined): void {
    this.confirm(this.confirmMessage).subscribe((ok) => {
      if (ok) {
        this.reallyDelete(isbn);
      }
    });
  }

  reallyDelete(isbn: string | undefined): void {
    this.bookService.deleteBook(isbn).subscribe({
      next: () => {
        this.router.navigate(['/books/list']);
      },
      error: (err) => {
        this.error = err;
      }
    });
  }

  confirm(message?: string): Observable<boolean> {
    const confirmation = window.confirm(message);
    return of(confirmation);
  }
}
