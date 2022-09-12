import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BookStoreService } from '../../shared/book-store.service';
import { Book } from '../../shared/book';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  selectCurrentBook,
  selectError
} from '../../books/store/book.selectors';
import {
  internalErrorAction,
  saveCurrentBook,
  setCurrentBook
} from '../../books/store/book.actions';

@Component({
  selector: 'bm-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.css']
})
export class BookEditComponent implements OnInit, OnDestroy {
  //TODO: clean up HTTP-Error massages
  book$ = this.store.select(selectCurrentBook);
  error$ = this.store.select(selectError);
  errorMessage: string | undefined;
  saved = false;
  successMsg = '';
  subscriptionError: Subscription | undefined;
  //loadingError$ = new Subject<string>();
  constructor(
    private route: ActivatedRoute,
    private bookStoreService: BookStoreService,
    private store: Store
  ) {}

  ngOnDestroy(): void {
    if (this.subscriptionError) {
      this.subscriptionError.unsubscribe();
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
    this.subscriptionError = this.error$.subscribe((error) => {
      if (!!error.http || !!error.text) this.errorMessage = '';
      if (error.http) this.errorMessage += error.http.message + '; ';
      if (error.text) this.errorMessage += error.text;
    });
  }

  saveBook(book: Book) {
    this.store.dispatch(saveCurrentBook({ book }));
  }
}
