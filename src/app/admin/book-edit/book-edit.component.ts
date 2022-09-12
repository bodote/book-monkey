import { Component, OnInit } from '@angular/core';
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
export class BookEditComponent implements OnInit {
  //TODO: clean up HTTP-Error massages
  book$ = this.store.select(selectCurrentBook);
  error$ = this.store.select(selectError);

  saved = false;
  successMsg = '';

  constructor(
    private route: ActivatedRoute,
    private bookStoreService: BookStoreService,
    private store: Store
  ) {}

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
  }
}
