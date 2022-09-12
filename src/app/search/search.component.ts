import { Component, OnInit } from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  Observable,
  Subject
} from 'rxjs';
import { BookStoreService } from '../shared/book-store.service';
import { Store } from '@ngrx/store';
import { searchBooks } from '../books/store/book.actions';
import {
  selectIsLoading,
  selectSearchResults
} from '../books/store/book.selectors';
import { Book } from '../shared/book';

@Component({
  selector: 'bm-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  private searchStringFromKeyBoard$: Subject<string> | undefined;
  //foundBooks: Book[] | undefined;
  searchBookResults$: Observable<Book[]> =
    this.store.select(selectSearchResults);
  isLoading$ = this.store.select(selectIsLoading);
  noSearchPerformedYet = true;

  //TODO replace BookStoreService with a Store-Action
  constructor(
    private bookStoreService: BookStoreService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.searchStringFromKeyBoard$ = new Subject<string>();
    this.searchStringFromKeyBoard$
      .pipe(
        filter((text: string) => text.length > 2),
        debounceTime(400),
        distinctUntilChanged()
        // tap(() => (this.isLoading = true)),
        // switchMap((text) => this.bookStoreService.getAllSearch(text)),
        // tap(() => (this.isLoading = false))
      )
      .subscribe({
        next: (searchString) => {
          //console.log('books: ');
          //console.table(books);
          //this.foundBooks = books as Book[];
          if (searchString.length > 3) {
            this.store.dispatch(searchBooks({ searchString }));
            this.noSearchPerformedYet = false;
          }
          return;
        },
        error: (e) => {
          console.error(e);
          //this.isLoading = false;
        }
      });
  }

  keyup(text: string) {
    this.searchStringFromKeyBoard$?.next(text);
  }
}
