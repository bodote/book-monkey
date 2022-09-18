import { Component, OnDestroy } from '@angular/core';
import { Book } from '../../shared/book';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  selectCurrentBook,
  selectError,
  selectSaveSuccess
} from '../../books/store/book.selectors';
import { saveCurrentBook } from '../../books/store/book.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'bm-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.css']
})
export class BookEditComponent implements OnDestroy {
  book$ = this.store.select(selectCurrentBook);
  error$ = this.store.select(selectError);
  showSaveSuccess$ = this.store.select(selectSaveSuccess);
  subscriptionSuccess: Subscription | undefined;

  saved = false;
  successMsg = '';

  constructor(private route: ActivatedRoute, private store: Store) {}

  ngOnDestroy(): void {
    if (this.subscriptionSuccess) {
      this.subscriptionSuccess.unsubscribe();
    }
  }

  saveBook(book: Book) {
    this.store.dispatch(saveCurrentBook({ book }));
    this.subscriptionSuccess = this.showSaveSuccess$.subscribe((showSave) => {
      this.saved = showSave;
      this.successMsg = 'Book has been saved successfully';
    });
  }
}
