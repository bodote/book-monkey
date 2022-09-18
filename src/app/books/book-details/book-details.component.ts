import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Book } from '../../shared/book';
import { Store } from '@ngrx/store';
import {
  selectCurrentBook,
  selectError,
  selectIsLoading
} from '../store/book.selectors';
import { deleteBook } from '../store/book.actions';

@Component({
  selector: 'bm-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent {
  book!: Book;
  book$ = this.store.select(selectCurrentBook);
  loading$ = this.store.select(selectIsLoading);
  id: number = 0;
  error$ = this.store.select(selectError);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store
  ) {}

  readonly confirmMessage = 'Really delete book?';

  delete(isbn: string | undefined): void {
    this.confirm(this.confirmMessage).subscribe((ok) => {
      if (ok && !!isbn) {
        this.reallyDelete(isbn);
      }
    });
  }

  reallyDelete(isbn: string): void {
    this.store.dispatch(deleteBook({ isbn }));
    this.router.navigate(['/books/list']);
  }

  confirm(message?: string): Observable<boolean> {
    const confirmation = window.confirm(message);
    return of(confirmation);
  }
}
