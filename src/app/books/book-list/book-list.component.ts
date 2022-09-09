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
    this.store.dispatch(loadBooks());
    // this.books$ = this.bs.getAll().pipe(
    //   catchError((err) => {
    //     this.error = err;
    //     this.cd.detectChanges();
    //     return of(null);
    //   })
    // );

    this.listView = true;
  }
}
