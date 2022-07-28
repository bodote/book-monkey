import { Component, OnInit } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { BookStoreService } from '../shared/book-store.service';
import { Book } from '../shared/book';

@Component({
  selector: 'bm-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.css']
})
export class BookEditComponent implements OnInit {
  book$!: Observable<Book>;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookStoreService: BookStoreService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      if (params?.get('isbn')) {
        let isbn = params.get('isbn');
        this.book$ = this.bookStoreService.getBook(isbn).pipe(
          tap((book) => {
            console.log(
              'routeParam subscr; got the book: ' + JSON.stringify(book)
            );
          })
        );
      } else {
        this.book$ = of({} as Book);
      }
    });
  }

  saveBook(book: Book) {
    console.log('put Book: ' + JSON.stringify(book));
    this.bookStoreService.putBook(book).subscribe(
      (res) => {
        console.log('OK: http.put saveBook: ' + JSON.stringify(res));
      },
      (err) => {
        console.error('ERROR in http.put saveBook: ' + JSON.stringify(err));
        this.errorMessage = JSON.stringify(err);
      }
    );
  }
}
