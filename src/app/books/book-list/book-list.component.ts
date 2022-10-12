import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import {
  selectAllBookEntities,
  selectErrorState,
  selectShowSavedSuccess
} from '../store/book-entity/book-entity.selectors';
import { Observable } from 'rxjs';
import { resetErrorsAction } from '../store/book-entity/book-entity.actions';

@Component({
  selector: 'bm-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books$ = this.store.select(selectAllBookEntities);
  showSaveSuccess$ = this.store.select(selectShowSavedSuccess);
  listView!: boolean;
  error$: Observable<{
    httpError?: HttpErrorResponse | null;
    errorMessage?: string | null;
    lastUpdateTS: number;
  }> = this.store.select(selectErrorState);

  constructor(private cd: ChangeDetectorRef, private store: Store) {}

  ngOnInit(): void {
    this.listView = true;
  }
  closeError() {
    this.store.dispatch(resetErrorsAction());
  }
}
