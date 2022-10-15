import { Component, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
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
import { Observable, Subscription } from 'rxjs';
import { BookEntity } from '../../books/store/book-entity/book-entity.model';

@Component({
  selector: 'bm-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.css']
})
export class BookEditComponent implements OnDestroy {
  book$ = this.store.select(selectCurrentBook);
  error$ = this.store.select(selectErrorState);
  showSaveSuccess$: Observable<boolean> = this.store.select(
    selectShowSavedSuccess
  );
  subscriptionSuccess: Subscription | undefined;
  successMsg = 'Book has been saved successfully';

  constructor(private route: ActivatedRoute, private store: Store) {}

  ngOnDestroy(): void {
    if (this.subscriptionSuccess) {
      this.subscriptionSuccess.unsubscribe();
    }
  }
  closeError() {
    this.store.dispatch(resetErrorsAction());
  }
  saveBook(book: BookEntity) {
    this.store.dispatch(upsertBookEntity({ bookEntity: book }));
  }
}
