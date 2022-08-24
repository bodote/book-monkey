import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Book } from '../../shared/book';
import { BookStoreService } from '../../shared/book-store.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bm-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books$: Observable<Book[] | null> | undefined;
  listView!: boolean;
  detailBook!: Book;
  error: HttpErrorResponse | undefined;

  constructor(private bs: BookStoreService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.books$ = this.bs.getAll().pipe(
      catchError((err) => {
        this.error = err;
        this.cd.detectChanges();
        return of(null);
      })
    );
    this.listView = true;
  }
}
