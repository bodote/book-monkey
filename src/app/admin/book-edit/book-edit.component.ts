import { Component, OnInit } from '@angular/core';
import { Observable, of, Subject, tap } from 'rxjs';
import { BookStoreService } from '../../shared/book-store.service';
import { Book } from '../../shared/book';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'bm-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.css']
})
export class BookEditComponent implements OnInit {
  book$!: Observable<Book>;

  saved = false;
  successMsg = '';
  loadingError$ = new Subject<string>();
  emptyDataError = 'got empty data from backend';
  putSaveBookError = 'ERROR in http.put saveBook: ';
  constructor(
    private route: ActivatedRoute,
    private bookStoreService: BookStoreService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      let isbn = params.get('isbn');
      this.book$ = this.bookStoreService.getBook(isbn).pipe(
        tap((data) => {
          if (data.title === undefined) {
            setTimeout(() => this.loadingError$.next(this.emptyDataError), 0);
            console.error(this.emptyDataError);
          }
        }),
        catchError((error: HttpErrorResponse) => {
          console.error(error.message);
          // to avoid "Expression has changed after it was checked" - error
          // to get the  error  displayed in the next change detection cycle, use "setTimeout"
          setTimeout(() => this.loadingError$.next(error.message), 0);
          return of({} as Book);
        })
      );
    });
  }

  saveBook(book: Book) {
    this.bookStoreService.putBook(book).subscribe({
      next: (res) => {
        this.saved = true;
        this.successMsg = res;
        this.book$ = of(book);
        setTimeout(() => (this.saved = false), 5000);
      },
      error: (error: HttpErrorResponse) => {
        this.loadingError$.next(error.message);
        console.error(this.putSaveBookError + JSON.stringify(error));
      }
    });
  }
}
