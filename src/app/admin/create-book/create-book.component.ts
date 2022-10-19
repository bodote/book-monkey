import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addBookEntity,
  resetErrorsAction
} from '../../books/store/book-entity/book-entity.actions';
import {
  selectErrorState,
  selectShowSavedSuccess
} from '../../books/store/book-entity/book-entity.selectors';
import { BookEntity } from '../../books/store/book-entity/book-entity.model';

@Component({
  selector: 'bm-create-book',
  templateUrl: './create-book.component.html',
  styleUrls: ['./create-book.component.css']
})
export class CreateBookComponent {
  showSaveSuccess$ = this.store.select(selectShowSavedSuccess);
  error$ = this.store.select(selectErrorState);

  constructor(private store: Store) {}

  createBookSave(book: BookEntity) {
    this.store.dispatch(addBookEntity({ bookEntity: book }));
  }

  closeError() {
    this.store.dispatch(resetErrorsAction());
  }
}
