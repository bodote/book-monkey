import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectCurrentBook,
  selectErrorState
} from '../store/book-entity/book-entity.selectors';
import {
  deleteBookEntity,
  resetErrorsAction
} from '../store/book-entity/book-entity.actions';
import { BookEntity } from '../store/book-entity/book-entity.model';

@Component({
  selector: 'bm-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent {
  book!: BookEntity;
  book$ = this.store.select(selectCurrentBook);
  id: number = 0;
  error$ = this.store.select(selectErrorState);

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
    this.store.dispatch(deleteBookEntity({ id: isbn }));
    this.router.navigate(['/books/list']);
  }

  confirm(message?: string): Observable<boolean> {
    const confirmation = window.confirm(message);
    return of(confirmation);
  }
  closeError() {
    this.store.dispatch(resetErrorsAction());
  }
}
