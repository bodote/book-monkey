import { Component, OnDestroy } from '@angular/core';
import { Book } from '../../shared/book';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { addBookEntity } from '../../books/store/book-entity/book-entity.actions';
import {
  selectError,
  selectShowSavedSuccess
} from '../../books/store/book-entity/book-entity.selectors';

@Component({
  selector: 'bm-create-book',
  templateUrl: './create-book.component.html',
  styleUrls: ['./create-book.component.css']
})
export class CreateBookComponent implements OnDestroy {
  //TODO: clean up HTTP-Error massages
  //loading$ = this.store.select(selectIsLoading);
  showSaveSuccess$ = this.store.select(selectShowSavedSuccess);
  error$ = this.store.select(selectError);

  saved = false;
  successMsg = '';
  subscriptionSuccess: Subscription | undefined;

  constructor(private store: Store) {}

  createBookSave(book: Book) {
    this.store.dispatch(addBookEntity({ bookEntity: book }));
    this.subscriptionSuccess = this.showSaveSuccess$.subscribe((showSave) => {
      this.saved = showSave;
      this.successMsg = 'Book has been saved successfully';
    });
  }
  ngOnDestroy() {
    if (this.subscriptionSuccess) {
      this.subscriptionSuccess.unsubscribe();
    }
  }
}
