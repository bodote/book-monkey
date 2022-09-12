import { Component, OnDestroy, OnInit } from '@angular/core';
import { Book } from '../../shared/book';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  selectCurrentBook,
  selectError,
  selectSaveSuccess
} from '../../books/store/book.selectors';
import {
  internalErrorAction,
  saveCurrentBook,
  setCurrentBook
} from '../../books/store/book.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'bm-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.css']
})
export class BookEditComponent implements OnInit, OnDestroy {
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

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      let isbn = params.get('isbn');

      if (!!isbn) this.store.dispatch(setCurrentBook({ isbn }));
      else {
        this.store.dispatch(
          internalErrorAction({
            message: 'not book with isbn ' + isbn + ' found'
          })
        );
      }
    });
  }

  saveBook(book: Book) {
    this.store.dispatch(saveCurrentBook({ book }));
    this.subscriptionSuccess = this.showSaveSuccess$.subscribe((showSave) => {
      this.saved = showSave;
      this.successMsg = 'Book has been saved successfully';
    });
  }
}
