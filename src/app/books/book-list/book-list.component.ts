import { Component, OnInit } from '@angular/core';
import { Book } from '../../shared/book';
import { BookStoreService } from '../../shared/book-store.service';
import { Observable, of, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'bm-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books$: Observable<Book[] | null> | undefined;
  listView!: boolean;
  detailBook!: Book;
  error: string | undefined;

  constructor(private bs: BookStoreService) {
    this.bs = bs;
  }

  ngOnInit(): void {
    this.books$ = this.bs.getAll().pipe(
      tap(() => (this.error = undefined)),
      catchError((err) => {
        this.error = err;
        return of(null);
      })
    );
    this.listView = true;
  }
}
