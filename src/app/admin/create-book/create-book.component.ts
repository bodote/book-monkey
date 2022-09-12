import { Component, OnDestroy } from '@angular/core';
import { Book } from '../../shared/book';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { addBook } from '../../books/store/book.actions';
import {
  selectError,
  selectIsLoading,
  selectSaveSuccess
} from '../../books/store/book.selectors';

@Component({
  selector: 'bm-create-book',
  templateUrl: './create-book.component.html',
  styleUrls: ['./create-book.component.css']
})
export class CreateBookComponent implements OnDestroy {
  //TODO: clean up HTTP-Error massages
  loading$ = this.store.select(selectIsLoading);
  showSaveSuccess$ = this.store.select(selectSaveSuccess);
  errorMessage$ = this.store.select(selectError);
  errorMessage: string | undefined;
  saved = false;
  successMsg = '';
  subscriptionSuccess: Subscription | undefined;
  subscriptionError: Subscription | undefined;
  constructor(private store: Store) {}

  createBookSave(book: Book) {
    this.store.dispatch(addBook({ book }));
    this.subscriptionSuccess = this.showSaveSuccess$.subscribe((showSave) => {
      this.saved = showSave;
      this.successMsg = 'Book has been saved successfully';
      setTimeout(() => (this.saved = false), 5000);
    });
    this.subscriptionError = this.errorMessage$.subscribe((error) => {
      if (!!error.http || !!error.text) this.errorMessage = '';
      if (error.http) this.errorMessage += error.http.message + '; ';
      if (error.text) this.errorMessage += error.text;
    });
  }
  ngOnDestroy() {
    if (this.subscriptionSuccess) {
      this.subscriptionSuccess.unsubscribe();
    }
    if (this.subscriptionError) {
      this.subscriptionError.unsubscribe();
    }
  }
}
