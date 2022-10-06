import { Component, OnInit } from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  Observable,
  Subject
} from 'rxjs';
import { Store } from '@ngrx/store';

import {
  selectHttpError,
  selectSearchPerformed,
  selectSearchResults
} from './search.selectors';
import { loadSearchs } from './search.actions';
import { BookEntity } from '../books/store/book-entity/book-entity.model';

@Component({
  selector: 'bm-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  private searchStringFromKeyBoard$: Subject<string> | undefined;
  searchBookResults$: Observable<BookEntity[] | undefined> =
    this.store.select(selectSearchResults);

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
      .subscribe((searchString) => {
        this.store.dispatch(loadSearchs({ searchString }));
        return;
      });
  }

  keyup(text: string) {
    this.searchStringFromKeyBoard$?.next(text);
  }
}
