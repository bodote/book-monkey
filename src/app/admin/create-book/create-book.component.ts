import { Component, OnDestroy } from '@angular/core';
import { Book } from '../../shared/book';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { addBook } from '../../books/store/book.actions';
import {
  selectError,
  selectSaveSuccess
} from '../../books/store/book.selectors';

@Component({
  selector: 'bm-create-book',
  templateUrl: './create-book.component.html',
  styleUrls: ['./create-book.component.css']
})
export class CreateBookComponent implements OnDestroy {
  //TODO: clean up HTTP-Error massages
  //loading$ = this.store.select(selectIsLoading);
  showSaveSuccess$ = this.store.select(selectSaveSuccess);
  error$ = this.store.select(selectError);

  saved = false;
  successMsg = '';
  subscriptionSuccess: Subscription | undefined;

  constructor(private store: Store) {}

  createBookSave(book: Book) {
    this.store.dispatch(addBook({ book }));
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
