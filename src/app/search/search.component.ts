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
  private search$: Subject<string> | undefined;
  foundBooks: Book[] | undefined;
  isLoading: boolean = false;

  constructor(private bookStoreService: BookStoreService) {}

  ngOnInit(): void {
    this.search$ = new Subject<string>();
    this.search$
      .pipe(
        filter((text: string) => text.length > 2),
        debounceTime(400),
        tap(() => (this.isLoading = true)),
        distinctUntilChanged(),
        tap(() => (this.isLoading = true)),
        switchMap((text) => this.bookStoreService.getAllSearch(text)),
        tap(() => (this.isLoading = false))
      )
      .subscribe({
        next: (books) => {
          console.log('books: ');
          console.table(books);
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
    this.search$?.next(text);
  }
}
