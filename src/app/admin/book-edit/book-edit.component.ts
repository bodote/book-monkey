import { Component, OnDestroy } from '@angular/core';
import { Book } from '../../shared/book';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  selectCurrentBook,
  selectError,
  selectShowSavedSuccess
} from '../../books/store/book-entity/book-entity.selectors';
import { upsertBookEntity } from '../../books/store/book-entity/book-entity.actions';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'bm-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.css']
})
export class BookEditComponent implements OnDestroy {
  book$ = this.store.select(selectCurrentBook);
  error$ = this.store.select(selectError);
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

  saveBook(book: Book) {
    this.store.dispatch(upsertBookEntity({ bookEntity: book }));
  }
}
