import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Book } from '../../shared/book';
import { BookStoreService } from '../../shared/book-store.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bm-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  book!: Book;
  id: number = 0;

  error: HttpErrorResponse | undefined;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bookService: BookStoreService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      let isbn: string | null;
      if ((isbn = params?.get('isbn')) != null) {
        this.getABook(isbn);
      }
    });
  }

  getABook(isbn: string) {
    this.bookService.getBook(isbn).subscribe({
      next: (book) => {
        this.book = book;
      },
      error: (err: HttpErrorResponse) => (this.error = err)
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
