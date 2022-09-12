import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BookStoreService } from '../../shared/book-store.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { loadBooks } from '../store/book.actions';
import {
  selectAllBooks,
  selectError,
  selectIsLoading
} from '../store/book.selectors';
import { first } from 'rxjs';

@Component({
  selector: 'bm-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  //books$: Observable<Book[] | null> | undefined;
  books2$ = this.store.select(selectAllBooks);
  listView!: boolean;
  error: HttpErrorResponse | undefined;
  loading$ = this.store.select(selectIsLoading);
  error2$ = this.store.select(selectError);

  constructor(
    private bs: BookStoreService,
    private cd: ChangeDetectorRef,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.books2$.pipe(first()).subscribe((books) => {
      if (books.length == 0) {
        console.log('dispatch loadBook');
        this.store.dispatch(loadBooks());
      } else {
        console.log('NO dispatch , books are already in store');
      }
    });

    this.listView = true;
  }
}
