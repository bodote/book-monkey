import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BookStoreService } from '../../shared/book-store.service';
import { Book } from '../../shared/book';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'bm-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.css']
})
export class BookEditComponent implements OnInit {
  book$!: Observable<Book>;
  errorMessage = '';
  saved = false;
  successMsg = '';

  constructor(
    private route: ActivatedRoute,
    private bookStoreService: BookStoreService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      if (params?.get('isbn')) {
        let isbn = params.get('isbn');
        this.book$ = this.bookStoreService.getBook(isbn);
      } else {
        this.book$ = of({} as Book);
      }
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
      error: (error) => {
        this.errorMessage = JSON.stringify(error);
        console.error('ERROR in http.put saveBook: ' + JSON.stringify(error));
      }
    });
  }
}
