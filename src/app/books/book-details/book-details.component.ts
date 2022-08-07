import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Book } from '../../shared/book';
import { BookStoreService } from '../../shared/book-store.service';

@Component({
  selector: 'bm-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  book!: Book;
  id: number = 0;

  error: string | undefined;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bookService: BookStoreService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      if (params?.get('isbn')) {
        let isbn = params.get('isbn');
        this.getABook(isbn);
      }
    });
  }

  getABook(isbn: string | null) {
    this.bookService.getBook(isbn).subscribe({
      next: (book) => {
        if (book) {
          this.book = book;
        }
      },
      error: (err) => (this.error = err)
    });
  }

  delete(isbn: string | undefined): void {
    this.confirm('Really delete book?').subscribe((ok) => {
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
        console.error(err);
        this.error =
          'Could not delete the book, Error message is: ' + JSON.stringify(err);
      }
    });
  }

  confirm(message?: string): Observable<boolean> {
    const confirmation = window.confirm(message || 'Is it OK?');
    return of(confirmation);
  }
}
