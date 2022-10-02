import { Component, OnInit } from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  Observable,
  Subject
} from 'rxjs';
import { Store } from '@ngrx/store';

//import { selectIsLoading } from '../books/store/book.selectors';
import { Book } from '../shared/book';
import {
  selectHttpError,
  selectSearchPerformed,
  selectSearchResults
} from './search.selectors';
import { loadSearchs } from './search.actions';

@Component({
  selector: 'bm-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  private searchStringFromKeyBoard$: Subject<string> | undefined;
  searchBookResults$: Observable<Book[] | undefined> =
    this.store.select(selectSearchResults);
  //isLoading$ = this.store.select(selectIsLoading);
  searchPerformed$ = this.store.select(selectSearchPerformed);
  httpError$ = this.store.select(selectHttpError);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.searchStringFromKeyBoard$ = new Subject<string>();
    this.searchStringFromKeyBoard$
      .pipe(
        filter((text: string) => text.length > 2),
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe({
        next: (searchString) => {
          this.store.dispatch(loadSearchs({ searchString }));
          return;
        },
        error: (e) => {
          console.error(e);
        }
      });
  }

  keyup(text: string) {
    this.searchStringFromKeyBoard$?.next(text);
  }
}
