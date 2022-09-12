import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Book } from '../../shared/book';
import { Store } from '@ngrx/store';
import {
  selectCurrentBook,
  selectError,
  selectIsLoading
} from '../store/book.selectors';
import { deleteBook, setCurrentBook } from '../store/book.actions';

@Component({
  selector: 'bm-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  book!: Book;
  book$ = this.store.select(selectCurrentBook);
  loading$ = this.store.select(selectIsLoading);
  id: number = 0;
  //error: HttpErrorResponse | undefined;
  error$ = this.store.select(selectError);
  //notFoundError: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      let isbn: string | null;
      if ((isbn = params.get('isbn')) != null) {
        this.store.dispatch(setCurrentBook({ isbn }));
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
