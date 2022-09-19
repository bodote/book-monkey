import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import {
  selectAllBooks,
  selectError,
  selectIsLoading,
  selectSaveSuccess
} from '../store/book.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'bm-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books2$ = this.store.select(selectAllBooks);
  showSaveSuccess$ = this.store.select(selectSaveSuccess);
  listView!: boolean;
  error: HttpErrorResponse | undefined;
  loading$ = this.store.select(selectIsLoading);
  error2$: Observable<{
    http?: HttpErrorResponse | null;
    text?: string | null;
  }> = this.store.select(selectError);

  constructor(private cd: ChangeDetectorRef, private store: Store) {}

  ngOnInit(): void {
    this.listView = true;
  }
}
