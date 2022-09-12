import { Component, OnInit } from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  Subject,
  switchMap,
  tap
} from 'rxjs';
import { BookStoreService } from '../shared/book-store.service';
import { Book } from '../shared/book';

@Component({
  selector: 'bm-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  private searchStringFromKeyBoard$: Subject<string> | undefined;
  foundBooks: Book[] | undefined;
  isLoading: boolean = false;

  //TODO replace BookStoreService with a Store-Action
  constructor(private bookStoreService: BookStoreService) {}

  ngOnInit(): void {
    this.searchStringFromKeyBoard$ = new Subject<string>();
    this.searchStringFromKeyBoard$
      .pipe(
        filter((text: string) => text.length > 2),
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => (this.isLoading = true)),
        switchMap((text) => this.bookStoreService.getAllSearch(text)),
        tap(() => (this.isLoading = false))
      )
      .subscribe({
        next: (books) => {
          //console.log('books: ');
          //console.table(books);
          this.foundBooks = books as Book[];
          return;
        },
        error: (e) => {
          console.error(e);
          this.isLoading = false;
        }
      });
  }

  keyup(text: string) {
    this.searchStringFromKeyBoard$?.next(text);
  }
}
