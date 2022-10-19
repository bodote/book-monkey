import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectCurrentBook,
  selectErrorState,
  selectShowSavedSuccess
} from '../../books/store/book-entity/book-entity.selectors';
import {
  resetErrorsAction,
  upsertBookEntity
} from '../../books/store/book-entity/book-entity.actions';
import { Observable } from 'rxjs';
import { BookEntity } from '../../books/store/book-entity/book-entity.model';

@Component({
  selector: 'bm-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.css']
})
export class BookEditComponent {
  book$ = this.store.select(selectCurrentBook);
  error$ = this.store.select(selectErrorState);
  showSaveSuccess$: Observable<boolean> = this.store.select(
    selectShowSavedSuccess
  );

  constructor(private store: Store) {}

  closeError() {
    this.store.dispatch(resetErrorsAction());
  }
  saveBook(book: BookEntity) {
    this.store.dispatch(upsertBookEntity({ bookEntity: book }));
  }
}
